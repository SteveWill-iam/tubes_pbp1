import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { forgotPassword, verifyOtp, resetPassword} from '../controllers/forgetPasswordController.js';
import { validateBody, ValidationSchema } from '../middleware/validate.js';

const router: Router = Router();

const loginSchema: ValidationSchema = {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true },
};

router.post('/login', validateBody(loginSchema), AuthController.login);

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);


export default router;
