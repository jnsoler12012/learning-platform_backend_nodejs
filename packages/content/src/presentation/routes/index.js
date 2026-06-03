import { Router } from 'express';
import contentRoutes from './content.routes.js';

const router = Router();

// Mounts all content-related routes under /content
router.use('/content', contentRoutes);

export default router;
