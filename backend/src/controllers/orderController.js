import { PrismaClient } from '@prisma/client';
import { getIO } from '../socket.js';

const prisma = new PrismaClient();
const CANCEL_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { menuItem: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate limited items
    for (const ci of cartItems) {
      const item = ci.menuItem;

      if (item.isOutOfStock) {
        return res.status(400).json({
          error: `"${item.name}" is out of stock. Please remove it from your cart.`
        });
      }

      if (item.isLimited) {
        if (ci.quantity > 2) {
          return res.status(400).json({
            error: `"${item.name}" is limited to max 2 per order.`
          });
        }
        if (item.limitedQuantity !== null && ci.quantity > item.limitedQuantity) {
          return res.status(400).json({
            error: `Only ${item.limitedQuantity} left for "${item.name}".`
          });
        }
      }
    }

    // Use Prisma transaction for atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Decrement limited quantities
      for (const ci of cartItems) {
        if (ci.menuItem.isLimited && ci.menuItem.limitedQuantity !== null) {
          const updated = await tx.menuItem.update({
            where: { id: ci.menuItemId },
            data: {
              limitedQuantity: { decrement: ci.quantity },
            },
          });

          // If quantity hits 0, mark out of stock
          if (updated.limitedQuantity <= 0) {
            await tx.menuItem.update({
              where: { id: ci.menuItemId },
              data: { isOutOfStock: true, limitedQuantity: 0 },
            });
          }
        }
      }

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      );

      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          items: {
            createMany: {
              data: cartItems.map((item) => ({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: item.menuItem.price,
              })),
            },
          },
        },
        include: { items: { include: { menuItem: true } }, user: true },
      });

      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

// Direct cancel (within 5min window)
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } }, user: true },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ error: 'Not your order' });
    if (order.status === 'DELIVERED') return res.status(400).json({ error: 'Cannot cancel delivered order' });
    if (order.status === 'CANCELLED') return res.status(400).json({ error: 'Order already cancelled' });

    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    if (elapsed > CANCEL_WINDOW_MS) {
      return res.status(400).json({ error: 'Cancellation window expired. Please request cancellation.' });
    }

    // Restore limited item quantities
    await prisma.$transaction(async (tx) => {
      for (const oi of order.items) {
        if (oi.menuItem.isLimited) {
          await tx.menuItem.update({
            where: { id: oi.menuItemId },
            data: {
              limitedQuantity: { increment: oi.quantity },
              isOutOfStock: false,
            },
          });
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
      });
    });

    // Emit socket event
    try {
      const io = getIO();
      const payload = {
        orderId: order.id,
        customerName: order.user.name,
        items: order.items.map(i => ({ name: i.menuItem.name, qty: i.quantity, price: i.price })),
        totalAmount: order.totalAmount,
        type: 'CANCELLED',
        timestamp: new Date().toISOString(),
      };

      io.to('admin').emit('orderCancelled', payload);
      // Emit to all kitchen rooms that have items in this order
      const kitchenIds = [...new Set(order.items.map(i => i.menuItem.kitchenId).filter(Boolean))];
      kitchenIds.forEach(kid => io.to(`kitchen_${kid}`).emit('orderCancelled', payload));
    } catch (e) {
      console.error('Socket emit error:', e.message);
    }

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// Request cancellation (after 5min)
export const requestCancellation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = parseInt(req.params.id);
    const { reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide a valid reason (min 5 chars)' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } }, user: true },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ error: 'Not your order' });
    if (order.status === 'DELIVERED') return res.status(400).json({ error: 'Cannot cancel delivered order' });
    if (order.status === 'CANCELLED') return res.status(400).json({ error: 'Order already cancelled' });
    if (order.cancellationRequested) return res.status(400).json({ error: 'Cancellation already requested' });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        cancellationRequested: true,
        cancellationReason: reason.trim(),
      },
    });

    // Emit socket event
    try {
      const io = getIO();
      const payload = {
        orderId: order.id,
        customerName: order.user.name,
        items: order.items.map(i => ({ name: i.menuItem.name, qty: i.quantity, price: i.price })),
        totalAmount: order.totalAmount,
        reason: reason.trim(),
        type: 'REQUESTED',
        timestamp: new Date().toISOString(),
      };

      io.to('admin').emit('orderCancelled', payload);
      const kitchenIds = [...new Set(order.items.map(i => i.menuItem.kitchenId).filter(Boolean))];
      kitchenIds.forEach(kid => io.to(`kitchen_${kid}`).emit('orderCancelled', payload));
    } catch (e) {
      console.error('Socket emit error:', e.message);
    }

    res.json({ message: 'Cancellation request submitted' });
  } catch (error) {
    console.error('Request cancel error:', error);
    res.status(500).json({ error: 'Failed to request cancellation' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['PLACED', 'STARTED_PREPARING', 'PREPARED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status,
        ...(status === 'CANCELLED' ? { cancelledAt: new Date() } : {}),
      },
      include: { items: { include: { menuItem: true } } },
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};
