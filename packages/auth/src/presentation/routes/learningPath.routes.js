import { Router } from 'express';
import { authMiddleware } from '@platform/shared/security/auth.middleware.js';
import { requirePermission } from '@platform/shared/security/rbac.middleware.js';
import { listAll, create, update, remove, enroll, progress, listMyPaths, setActive, setEnrollment } from '../controllers/learningPath.controller.js';

const router = Router();

router.get('/', authMiddleware, listAll);
router.post('/', authMiddleware, requirePermission('learning-path.write'), create);
router.get('/me', authMiddleware, listMyPaths);
router.post('/enroll', authMiddleware, enroll);
router.patch('/progress', authMiddleware, progress);
router.patch('/enrollment', authMiddleware, setActive);
router.put('/enrollment', authMiddleware, setEnrollment);
router.patch('/:id', authMiddleware, requirePermission('learning-path.write'), update);
router.delete('/:id', authMiddleware, requirePermission('learning-path.write'), remove);

export default router;
