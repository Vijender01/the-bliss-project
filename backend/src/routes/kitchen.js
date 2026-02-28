import express from 'express';
import {
  getKitchenMenu,
  addKitchenMenuItem,
  updateKitchenMenuItem,
  deleteKitchenMenuItem,
  toggleOutOfStock,
  setLimitedQuantity,
  listKitchens,
} from '../controllers/kitchenController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

// All kitchen routes require authentication and KITCHEN_OWNER or ADMIN role
const kitchenAuth = [authMiddleware, roleMiddleware(['KITCHEN_OWNER', 'ADMIN'])];

// Kitchen list (admin needs this for dropdown)
router.get('/list', authMiddleware, roleMiddleware(['ADMIN']), listKitchens);

// Menu management
router.get('/menu', ...kitchenAuth, getKitchenMenu);
router.post('/menu', ...kitchenAuth, addKitchenMenuItem);
router.put('/menu/:id', ...kitchenAuth, updateKitchenMenuItem);
router.delete('/menu/:id', ...kitchenAuth, deleteKitchenMenuItem);
router.patch('/menu/:id/out-of-stock', ...kitchenAuth, toggleOutOfStock);
router.patch('/menu/:id/limited', ...kitchenAuth, setLimitedQuantity);

export default router;
