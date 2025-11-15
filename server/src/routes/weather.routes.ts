import { Router } from 'express';
import { z } from 'zod';
import * as weatherController from '../controllers/weather.controller';
import { validate } from '../middleware/validation.middleware';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Validation schemas
const coordsSchema = z.object({
  params: z.object({
    lat: z.string().regex(/^-?\d+\.?\d*$/, 'Invalid latitude'),
    lon: z.string().regex(/^-?\d+\.?\d*$/, 'Invalid longitude'),
  }),
});

const predictionSchema = z.object({
  params: z.object({
    lat: z.string().regex(/^-?\d+\.?\d*$/, 'Invalid latitude'),
    lon: z.string().regex(/^-?\d+\.?\d*$/, 'Invalid longitude'),
  }),
  query: z.object({
    hours: z.string().regex(/^\d+$/).optional(),
  }),
});

const historySchema = z.object({
  params: z.object({
    lat: z.string().regex(/^-?\d+\.?\d*$/, 'Invalid latitude'),
    lon: z.string().regex(/^-?\d+\.?\d*$/, 'Invalid longitude'),
  }),
  query: z.object({
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

// Routes (use optionalAuth to generate alerts for authenticated users)
router.get(
  '/current/:lat/:lon',
  validate(coordsSchema),
  optionalAuth,
  weatherController.getCurrentWeather
);

router.get(
  '/forecast/:lat/:lon',
  validate(coordsSchema),
  weatherController.getForecast
);

router.get(
  '/predictions/:lat/:lon',
  validate(predictionSchema),
  weatherController.getPredictions
);

router.get(
  '/history/:lat/:lon',
  validate(historySchema),
  weatherController.getForecastHistory
);

router.get('/health', weatherController.getServiceHealth);

export default router;
