import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticate } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { loginSchema, registerSchema, refreshSchema, logoutSchema } from './auth.validation';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', validateBody(registerSchema), asyncHandler(authController.register));
router.post('/login', validateBody(loginSchema), asyncHandler(authController.login));
router.post('/refresh', validateBody(refreshSchema), asyncHandler(authController.refresh));
router.post('/logout', validateBody(logoutSchema), asyncHandler(authController.logout));
router.get('/me', authenticate, asyncHandler(authController.me));

export default router;
