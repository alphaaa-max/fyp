import { Router } from 'express';
import { z } from 'zod';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { rateLimit } from '../middleware/rateLimit.middleware';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters'),
    name: z.string().min(1).max(100).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Routes
router.post(
  '/register',
  rateLimit(5, 15 * 60 * 1000), // 5 requests per 15 minutes
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  rateLimit(10, 15 * 60 * 1000), // 10 requests per 15 minutes
  validate(loginSchema),
  authController.login
);

router.get('/me', authenticate, authController.getMe);

export default router;
