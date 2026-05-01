import { Router } from 'express';
import categoryController from '../controllers/categoryController.js';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';
import { validateCategory } from '../middleware/categoryMiddleware.js';

const router: Router = Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin-only routes
router.post('/', 
  authMiddleware, 
  authorizeRole(['admin']), 
  validateCategory, 
  categoryController.create
);

router.put('/:id', 
  authMiddleware, 
  authorizeRole(['admin']), 
  validateCategory, 
  categoryController.update
);

router.delete('/:id', authMiddleware, authorizeRole(['admin']), categoryController.delete);

export default router;
