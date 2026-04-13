import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin-only routes
router.post('/', authMiddleware, categoryController.create);
router.put('/:id', authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.delete);

export default router;
