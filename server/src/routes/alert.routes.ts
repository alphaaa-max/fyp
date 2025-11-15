import { Router } from 'express';
import { z } from 'zod';
import * as alertController from '../controllers/alert.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const markReadSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// Routes
router.get('/', alertController.getAlerts);
router.put('/:id/read', validate(markReadSchema), alertController.markAsRead);

export default router;
