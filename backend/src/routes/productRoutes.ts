import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multerConfig.js';
import { validateProduct } from '../middleware/productMiddleware.js';

const router: Router = Router();

// Public routes
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

// Protected routes (admin only)
router.post('/', 
  authMiddleware, 
  authorizeRole(['admin']), 
  upload.single('image'), 
  validateProduct, 
  ProductController.create
);

router.put('/:id', 
  authMiddleware, 
  authorizeRole(['admin']), 
  upload.single('image'), 
  validateProduct, 
  ProductController.update
);

router.delete('/:id', authMiddleware, authorizeRole(['admin']), ProductController.delete);

export default router;
