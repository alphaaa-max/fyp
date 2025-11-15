import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import weatherRoutes from './weather.routes';
import alertRoutes from './alert.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/weather', weatherRoutes);
router.use('/alerts', alertRoutes);

export default router;
