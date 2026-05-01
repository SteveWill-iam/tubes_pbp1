import { Router } from 'express';
import { OrdersController } from '../controllers/ordersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateOrder, validateOrderStatus } from '../middleware/orderMiddleware.js';

const router: Router = Router();

// Public route to create order
router.post('/', validateOrder, OrdersController.create);

// Protected routes (admin only)
router.get('/', authMiddleware, OrdersController.getAll);
router.get('/:id', authMiddleware, OrdersController.getById);
router.patch('/:id/status', authMiddleware, validateOrderStatus, OrdersController.updateStatus);
router.patch('/:id/payment/confirm', authMiddleware, OrdersController.confirmPayment);

export default router;
