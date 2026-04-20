import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';

const router = Router();

// Only 'admin' role can access admin management
router.use(authMiddleware, authorizeRole(['admin']));

router.get('/', AdminController.getAll);
router.get('/:id', AdminController.getById);
router.post('/', AdminController.create);
router.put('/:id', AdminController.update);
router.delete('/:id', AdminController.delete);

export default router;