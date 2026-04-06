import { Router } from 'express';
import { OrdersController } from '../controllers/ordersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Public route to create order
router.post('/', OrdersController.create);

// Protected routes (admin only)
router.get('/', authMiddleware, OrdersController.getAll);
router.get('/:id', authMiddleware, OrdersController.getById);
router.patch('/:id/status', authMiddleware, OrdersController.updateStatus);

export default router;
