import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        menuItem: true,
      },
    });

    const total = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    res.json({ items: cartItems, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { menuItemId, quantity } = req.body;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(menuItemId) },
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_menuItemId: { userId, menuItemId: parseInt(menuItemId) } },
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { userId_menuItemId: { userId, menuItemId: parseInt(menuItemId) } },
        data: { quantity: existingItem.quantity + (quantity || 1) },
        include: { menuItem: true },
      });
      return res.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        menuItemId: parseInt(menuItemId),
        quantity: quantity || 1,
      },
      include: { menuItem: true },
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { menuItemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      await prisma.cartItem.delete({
        where: { userId_menuItemId: { userId, menuItemId: parseInt(menuItemId) } },
      });
      return res.json({ message: 'Item removed' });
    }

    const updated = await prisma.cartItem.update({
      where: { userId_menuItemId: { userId, menuItemId: parseInt(menuItemId) } },
      data: { quantity },
      include: { menuItem: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { menuItemId } = req.params;

    await prisma.cartItem.delete({
      where: { userId_menuItemId: { userId, menuItemId: parseInt(menuItemId) } },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
