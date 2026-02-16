import express from 'express';
import { placeOrder, getOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.post('/', authMiddleware, placeOrder);
router.get('/', authMiddleware, getOrders);
router.get('/all', authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN']), getAllOrders);
router.put('/:orderId/status', authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN']), updateOrderStatus);

export default router;
