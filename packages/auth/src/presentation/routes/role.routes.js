import { Router } from 'express';
import { authMiddleware } from '@platform/shared/security/auth.middleware.js';
import { requirePermission } from '@platform/shared/security/rbac.middleware.js';
import { create, list, assign, assignPerm } from '../controllers/role.controller.js';

const router = Router();

router.get('/', authMiddleware, requirePermission('role.read'), list);
router.post('/', authMiddleware, requirePermission('role.write'), create);
router.post('/assign', authMiddleware, requirePermission('role.write'), assign);
router.post('/permissions', authMiddleware, requirePermission('role.write'), assignPerm);

export default router;
