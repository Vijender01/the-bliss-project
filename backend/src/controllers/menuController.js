import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMenu = async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isActive: true },
    });
    res.json(items);
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    const item = await prisma.menuItem.create({
      data: { name, description, price: parseFloat(price), image },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, isActive } = req.body;

    const item = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(image && { image }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json(item);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};
