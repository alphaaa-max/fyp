import { Router } from 'express';
import { z } from 'zod';
import * as userController from '../controllers/user.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
  }),
});

const locationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    isPrimary: z.boolean().optional(),
  }),
});

const updateLocationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    isPrimary: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

const deleteLocationSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// Routes
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

router.get('/locations', userController.getLocations);
router.post('/locations', validate(locationSchema), userController.addLocation);
router.put('/locations/:id', validate(updateLocationSchema), userController.updateLocation);
router.delete('/locations/:id', validate(deleteLocationSchema), userController.deleteLocation);

export default router;
