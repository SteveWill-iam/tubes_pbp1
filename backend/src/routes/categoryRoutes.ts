import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin-only routes
router.post('/', authMiddleware, authorizeRole(['admin']), categoryController.create);
router.put('/:id', authMiddleware, authorizeRole(['admin']), categoryController.update);
router.delete('/:id', authMiddleware, authorizeRole(['admin']), categoryController.delete);

export default router;
