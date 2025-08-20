import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.registerUser);

router.post('/login', AuthController.loginUser);
router.post('/verify', AuthController.userVerify);
router.put('/resetPassword', AuthController.resetPassword);

export default router;
