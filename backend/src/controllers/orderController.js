import { PrismaClient } from '@prisma/client';
import { getIO } from '../socket.js';
import { formatAndSendOrderAlert, formatAndSendSummaryAlert } from '../services/telegram.js';

const prisma = new PrismaClient();
const CANCEL_WINDOW_MS = 5 * 60 * 1000;

// Helper: Calculate delivery date based on business rules
// Window: 3 PM (prev day) to 11 AM (delivery day)
function calculateDeliveryDate(now = new Date()) {
  const d = new Date(now);
  const hour = d.getHours();

  if (hour > 11) {
    // Orders after 11 AM belong to the next delivery cycle
    d.setDate(d.getDate() + 1);
  }

  // Create a Date object that represents UTC midnight of the target date
  // This ensures consistency regardless of the server's local timezone
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

// Helper: emit to admin + relevant kitchens
function emitToAdminAndKitchens(eventName, payload, kitchenIds = []) {
  try {
    const io = getIO();
    console.log(`📡 Emitting "${eventName}" to admin + kitchens [${kitchenIds.join(',')}]`, JSON.stringify(payload));
    io.to('admin').emit(eventName, payload);
    const uniqueKitchenIds = [...new Set(kitchenIds.filter(Boolean))];
    uniqueKitchenIds.forEach(kid => io.to(`kitchen_${kid}`).emit(eventName, payload));
  } catch (e) {
    console.error('Socket emit error:', e.message);
  }
}

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { specialInstructions } = req.body;

    // Validate special instructions (max 100 words)
    if (specialInstructions && specialInstructions.trim().split(/\s+/).length > 100) {
      return res.status(400).json({ error: 'Special instructions must be 100 words or less.' });
    }

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
        return res.status(400).json({ error: `"${item.name}" is out of stock.` });
      }
      if (item.isLimited) {
        if (ci.quantity > 2) {
          return res.status(400).json({ error: `"${item.name}" is limited to max 2 per order.` });
        }
        if (item.limitedQuantity !== null && ci.quantity > item.limitedQuantity) {
          return res.status(400).json({ error: `Only ${item.limitedQuantity} left for "${item.name}".` });
        }
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      for (const ci of cartItems) {
        if (ci.menuItem.isLimited && ci.menuItem.limitedQuantity !== null) {
          const updated = await tx.menuItem.update({
            where: { id: ci.menuItemId },
            data: { limitedQuantity: { decrement: ci.quantity } },
          });
          if (updated.limitedQuantity <= 0) {
            await tx.menuItem.update({
              where: { id: ci.menuItemId },
              data: { isOutOfStock: true, limitedQuantity: 0 },
            });
          }
        }
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          specialInstructions: specialInstructions?.trim() || null,
          deliveryDate: calculateDeliveryDate(),
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

    // Emit new order event for real-time dashboard
    emitToAdminAndKitchens('orderUpdated', {
      type: 'NEW_ORDER',
      orderId: order.id,
      customerName: order.user.name,
      totalAmount: order.totalAmount,
      items: order.items.map(i => ({ name: i.menuItem.name, qty: i.quantity })),
      timestamp: new Date().toISOString(),
    }, kitchenIds);
 
    // Async: Send Telegram updates
    formatAndSendOrderAlert(order).catch(console.error);
    formatAndSendSummaryAlert(prisma, order.deliveryDate).catch(console.error);
 
    res.status(201).json(order);
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

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

    await prisma.$transaction(async (tx) => {
      for (const oi of order.items) {
        if (oi.menuItem.isLimited) {
          await tx.menuItem.update({
            where: { id: oi.menuItemId },
            data: { limitedQuantity: { increment: oi.quantity }, isOutOfStock: false },
          });
        }
      }
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED', cancelledAt: new Date() },
      });
    });

    // Emit cancellation alerts
    const kitchenIds = order.items.map(i => i.menuItem.kitchenId);
    const payload = {
      orderId: order.id,
      customerName: order.user.name,
      items: order.items.map(i => ({ name: i.menuItem.name, qty: i.quantity, price: i.price })),
      totalAmount: order.totalAmount,
      type: 'CANCELLED',
      timestamp: new Date().toISOString(),
    };
    emitToAdminAndKitchens('orderCancelled', payload, kitchenIds);
    emitToAdminAndKitchens('orderUpdated', { ...payload, type: 'CANCELLED' }, kitchenIds);

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

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
      data: { cancellationRequested: true, cancellationReason: reason.trim() },
    });

    const kitchenIds = order.items.map(i => i.menuItem.kitchenId);
    const payload = {
      orderId: order.id,
      customerName: order.user.name,
      items: order.items.map(i => ({ name: i.menuItem.name, qty: i.quantity, price: i.price })),
      totalAmount: order.totalAmount,
      reason: reason.trim(),
      type: 'REQUESTED',
      timestamp: new Date().toISOString(),
    };
    emitToAdminAndKitchens('orderCancelled', payload, kitchenIds);
    emitToAdminAndKitchens('orderUpdated', { ...payload, type: 'CANCEL_REQUESTED' }, kitchenIds);

    res.json({ message: 'Cancellation request submitted' });
  } catch (error) {
    console.error('Request cancel error:', error);
    res.status(500).json({ error: 'Failed to request cancellation' });
  }
};

export const getDeliveryConfig = async (req, res) => {
  try {
    const deliveryDate = calculateDeliveryDate();
    res.json({
      deliveryDate: deliveryDate.toISOString().split('T')[0],
      displayDate: deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      windowMessage: "Orders open from 3 PM (prev day) to 11 AM (delivery day)"
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery config' });
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

export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: { include: { menuItem: true } },
        user: { select: { name: true } }
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Only owner or admin can view
    if (order.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

export const markPaymentDone = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ error: 'Not your order' });

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { paymentStatus: 'PAYMENT_DONE' }
    });

    // Notify admin
    emitToAdminAndKitchens('orderUpdated', {
      type: 'PAYMENT_SUBMITTED',
      orderId: order.id,
      paymentStatus: 'PAYMENT_DONE',
      timestamp: new Date().toISOString(),
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Mark payment done error:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { paymentStatus: 'CONFIRMED' },
      include: { items: { include: { menuItem: true } } }
    });

    // Notify kitchen/admin
    const kitchenIds = updatedOrder.items.map(i => i.menuItem.kitchenId);
    emitToAdminAndKitchens('orderUpdated', {
      type: 'PAYMENT_CONFIRMED',
      orderId: updatedOrder.id,
      paymentStatus: 'CONFIRMED',
      timestamp: new Date().toISOString(),
    }, kitchenIds);

    res.json(updatedOrder);
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
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
      include: { items: { include: { menuItem: true } }, user: true },
    });

    // Emit status update
    const kitchenIds = order.items.map(i => i.menuItem.kitchenId);
    emitToAdminAndKitchens('orderUpdated', {
      type: 'STATUS_CHANGE',
      orderId: order.id,
      newStatus: status,
      timestamp: new Date().toISOString(),
    }, kitchenIds);

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Consolidated daily order summary
export const getOrdersSummary = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    let queryDate;

    if (date) {
      queryDate = new Date(`${date}T00:00:00.000Z`);
    } else {
      queryDate = calculateDeliveryDate();
    }

    const orders = await prisma.order.findMany({
      where: {
        deliveryDate: queryDate,
        status: { not: 'CANCELLED' }
      },
      include: {
        user: true,
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group items
    const itemMap = {};
    for (const order of orders) {
      for (const oi of order.items) {
        const key = oi.menuItemId;
        if (!itemMap[key]) {
          itemMap[key] = {
            menuItemId: key,
            name: oi.menuItem.name,
            image: oi.menuItem.image,
            category: oi.menuItem.category,
            price: oi.price,
            totalQuantity: 0,
            totalRevenue: 0,
          };
        }
        itemMap[key].totalQuantity += oi.quantity;
        itemMap[key].totalRevenue += oi.price * oi.quantity;
      }
    }

    const summary = Object.values(itemMap).sort((a, b) => b.totalQuantity - a.totalQuantity);

    res.json({
      date: queryDate.toISOString().split('T')[0],
      totalOrders: orders.length,
      cancelledOrders: 0,
      totalItems: summary.reduce((s, i) => s + i.totalQuantity, 0),
      totalRevenue: summary.reduce((s, i) => s + i.totalRevenue, 0),
      items: summary,
      orders: orders.map(o => ({
        id: o.id,
        customerName: o.user.name,
        status: o.status,
        paymentStatus: o.paymentStatus,
        totalAmount: o.totalAmount,
        specialInstructions: o.specialInstructions,
        deliveryDate: o.deliveryDate,
        createdAt: o.createdAt,
        items: o.items.map(i => ({ name: i.menuItem.name, qty: i.quantity, price: i.price })),
      })),
    });
  } catch (error) {
    console.error('Get orders summary error:', error);
    res.status(500).json({ error: 'Failed to fetch order summary' });
  }
};
