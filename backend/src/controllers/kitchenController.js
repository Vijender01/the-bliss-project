import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/kitchen/menu — list items for the owner's kitchen (or all for admin with ?kitchenId=)
export const getKitchenMenu = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let kitchenId;

    if (role === 'ADMIN') {
      kitchenId = req.query.kitchenId ? parseInt(req.query.kitchenId) : null;
      if (!kitchenId) {
        // Return all items grouped or empty if no kitchen selected
        const items = await prisma.menuItem.findMany({
          include: { kitchen: true },
          orderBy: { createdAt: 'desc' },
        });
        return res.json(items);
      }
    } else if (role === 'KITCHEN_OWNER') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.kitchenId) {
        return res.status(400).json({ error: 'No kitchen assigned to this owner' });
      }
      kitchenId = user.kitchenId;
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const items = await prisma.menuItem.findMany({
      where: { kitchenId },
      include: { kitchen: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get kitchen menu error:', error);
    res.status(500).json({ error: 'Failed to fetch kitchen menu' });
  }
};

// POST /api/kitchen/menu — add new item
export const addKitchenMenuItem = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { name, description, price, image, kitchenId: bodyKitchenId } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ error: 'Name, description, and price are required' });
    }

    let kitchenId;

    if (role === 'ADMIN') {
      kitchenId = bodyKitchenId ? parseInt(bodyKitchenId) : null;
      if (!kitchenId) {
        return res.status(400).json({ error: 'kitchenId is required for admin' });
      }
      // Verify kitchen exists
      const kitchen = await prisma.kitchen.findUnique({ where: { id: kitchenId } });
      if (!kitchen) {
        return res.status(404).json({ error: 'Kitchen not found' });
      }
    } else if (role === 'KITCHEN_OWNER') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.kitchenId) {
        return res.status(400).json({ error: 'No kitchen assigned to this owner' });
      }
      kitchenId = user.kitchenId;
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        kitchenId,
        isActive: true,
      },
      include: { kitchen: true },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Add kitchen menu item error:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

// PUT /api/kitchen/menu/:id — update item
export const updateKitchenMenuItem = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;
    const { name, description, price, image, isActive } = req.body;

    const existing = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Ownership check
    if (role === 'KITCHEN_OWNER') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.kitchenId !== existing.kitchenId) {
        return res.status(403).json({ error: 'You can only modify items in your own kitchen' });
      }
    }
    // ADMIN can modify any

    const item = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive }),
      },
      include: { kitchen: true },
    });

    res.json(item);
  } catch (error) {
    console.error('Update kitchen menu item error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

// DELETE /api/kitchen/menu/:id — delete item
export const deleteKitchenMenuItem = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;

    const existing = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Ownership check
    if (role === 'KITCHEN_OWNER') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.kitchenId !== existing.kitchenId) {
        return res.status(403).json({ error: 'You can only delete items in your own kitchen' });
      }
    }

    // Delete related cart items first
    await prisma.cartItem.deleteMany({ where: { menuItemId: parseInt(id) } });

    await prisma.menuItem.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete kitchen menu item error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

// PATCH /api/kitchen/menu/:id/out-of-stock — toggle out of stock
export const toggleOutOfStock = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;
    const { isOutOfStock } = req.body;

    const existing = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Ownership check
    if (role === 'KITCHEN_OWNER') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.kitchenId !== existing.kitchenId) {
        return res.status(403).json({ error: 'You can only modify items in your own kitchen' });
      }
    }

    const item = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: { isOutOfStock: isOutOfStock !== undefined ? isOutOfStock : true },
      include: { kitchen: true },
    });

    res.json(item);
  } catch (error) {
    console.error('Toggle out of stock error:', error);
    res.status(500).json({ error: 'Failed to update stock status' });
  }
};

// PATCH /api/kitchen/menu/:id/limited — set limited quantity
export const setLimitedQuantity = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;
    const { isLimited, limitedQuantity } = req.body;

    const existing = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Ownership check
    if (role === 'KITCHEN_OWNER') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.kitchenId !== existing.kitchenId) {
        return res.status(403).json({ error: 'You can only modify items in your own kitchen' });
      }
    }

    const item = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        isLimited: isLimited !== undefined ? isLimited : true,
        limitedQuantity: limitedQuantity !== undefined ? parseInt(limitedQuantity) : null,
      },
      include: { kitchen: true },
    });

    res.json(item);
  } catch (error) {
    console.error('Set limited quantity error:', error);
    res.status(500).json({ error: 'Failed to update limited quantity' });
  }
};

// GET /api/kitchen/list — list all kitchens (for admin dropdown)
export const listKitchens = async (req, res) => {
  try {
    const kitchens = await prisma.kitchen.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { menuItems: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json(kitchens);
  } catch (error) {
    console.error('List kitchens error:', error);
    res.status(500).json({ error: 'Failed to fetch kitchens' });
  }
};
