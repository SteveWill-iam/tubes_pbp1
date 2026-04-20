import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateBody, ValidationSchema } from '../middleware/validate.js';

const router = Router();

const loginSchema: ValidationSchema = {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true },
};

router.post('/login', validateBody(loginSchema), AuthController.login);

export default router;
