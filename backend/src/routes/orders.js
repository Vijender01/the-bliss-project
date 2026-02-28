import express from 'express';
import { 
  placeOrder, 
  getOrders, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder, 
  requestCancellation, 
  getOrdersSummary, 
  getDeliveryConfig,
  getOrderDetails,
  markPaymentDone,
  confirmPayment
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.post('/', authMiddleware, placeOrder);
router.get('/delivery-config', getDeliveryConfig);
router.get('/', authMiddleware, getOrders);
router.get('/all', authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN']), getAllOrders);
router.get('/summary', authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN']), getOrdersSummary);
router.get('/:id', authMiddleware, getOrderDetails);
router.patch('/:id/payment-done', authMiddleware, markPaymentDone);
router.put('/:id/confirm-payment', authMiddleware, roleMiddleware(['ADMIN']), confirmPayment);
router.put('/:orderId/status', authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN']), updateOrderStatus);
router.post('/:id/cancel', authMiddleware, cancelOrder);
router.post('/:id/request-cancel', authMiddleware, requestCancellation);

export default router;
