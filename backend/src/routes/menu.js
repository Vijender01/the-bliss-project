import express from 'express';
import { getMenu, getMenuItem, createMenuItem, updateMenuItem } from '../controllers/menuController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = express.Router();

router.get('/', getMenu);
router.get('/:id', getMenuItem);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), createMenuItem);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), updateMenuItem);

export default router;
