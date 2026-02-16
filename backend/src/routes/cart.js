import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/:menuItemId', authMiddleware, updateCartItem);
router.delete('/:menuItemId', authMiddleware, removeFromCart);
router.delete('/', authMiddleware, clearCart);

export default router;
