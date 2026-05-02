import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';
import { validateUniqueAdmin } from '../middleware/adminMiddleware.js';

const router: Router = Router();

// Only 'admin' role can access admin management
router.use(authMiddleware, authorizeRole(['admin']));

router.get('/', AdminController.getAll);
router.get('/:id', AdminController.getById);
router.post('/', validateUniqueAdmin, AdminController.create);
router.put('/:id', validateUniqueAdmin, AdminController.update);
router.delete('/:id', AdminController.delete);

export default router;