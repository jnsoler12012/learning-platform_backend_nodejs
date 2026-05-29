import { Router } from 'express';
import conceptRoutes from './concept.routes.js';

const router = Router();

// Mounts all concept-related routes under /concepts
router.use('/concepts', conceptRoutes);

export default router;
