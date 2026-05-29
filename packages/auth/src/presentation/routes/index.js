import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import roleRoutes from './role.routes.js';
import learningPathRoutes from './learningPath.routes.js';

const router = Router();

// Mounts all sub-routers under their respective base paths
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/learning-paths', learningPathRoutes);

export default router;
