import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { forgotPassword, verifyOtp, resetPassword} from '../controllers/forgetPasswordController.js';
import { validateLogin } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.post('/login', validateLogin, AuthController.login);

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);


export default router;
