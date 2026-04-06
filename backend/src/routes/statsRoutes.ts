import { Router } from 'express';
import { StatsController } from '../controllers/statsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protected route (admin only)
router.get('/', authMiddleware, StatsController.getStats);

export default router;
