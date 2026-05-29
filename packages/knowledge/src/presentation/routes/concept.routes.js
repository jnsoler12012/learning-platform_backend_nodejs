import { Router } from 'express';
import { authMiddleware } from '@platform/shared/security/auth.middleware.js';
import { requirePermission } from '@platform/shared/security/rbac.middleware.js';
import {
  listAll, getById, getPrereqs, getDeps, getRels,
  create, update, remove,
  showGraph, showGraphByTrack, showConceptPath,
} from '../controllers/concept.controller.js';

const router = Router();

// Graph visualization endpoints (auth only, no extra permission needed)
router.get('/graph', authMiddleware, showGraph);
router.get('/graph/track/:track', authMiddleware, showGraphByTrack);
router.get('/graph/path/:from/:to', authMiddleware, showConceptPath);

// Concept CRUD and relationship endpoints (require learning-path permissions)
router.get('/', authMiddleware, requirePermission('learning-path.read'), listAll);
router.get('/:id', authMiddleware, requirePermission('learning-path.read'), getById);
router.get('/:id/prerequisites', authMiddleware, requirePermission('learning-path.read'), getPrereqs);
router.get('/:id/dependents', authMiddleware, requirePermission('learning-path.read'), getDeps);
router.get('/:id/related', authMiddleware, requirePermission('learning-path.read'), getRels);
router.post('/', authMiddleware, requirePermission('learning-path.write'), create);
router.patch('/:id', authMiddleware, requirePermission('learning-path.write'), update);
router.delete('/:id', authMiddleware, requirePermission('learning-path.write'), remove);

export default router;
