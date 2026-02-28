import express from 'express';
import { placeOrder, getOrders, getAllOrders, updateOrderStatus, cancelOrder, requestCancellation, getOrdersSummary } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.post('/', authMiddleware, placeOrder);
router.get('/', authMiddleware, getOrders);
router.get('/all', authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN']), getAllOrders);
router.get('/summary', authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN']), getOrdersSummary);
router.put('/:orderId/status', authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN']), updateOrderStatus);
router.post('/:id/cancel', authMiddleware, cancelOrder);
router.post('/:id/request-cancel', authMiddleware, requestCancellation);

export default router;
