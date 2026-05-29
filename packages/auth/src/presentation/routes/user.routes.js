import { Router } from 'express';
import { authMiddleware } from '@platform/shared/security/auth.middleware.js';
import { requirePermission } from '@platform/shared/security/rbac.middleware.js';
import { getOwnProfile, getUserProfile, updateOwnProfile, updateOwnAccount, deleteOwnAccount } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', authMiddleware, getOwnProfile);
router.patch('/me', authMiddleware, updateOwnProfile);
router.patch('/me/account', authMiddleware, updateOwnAccount);
router.delete('/me', authMiddleware, deleteOwnAccount);
router.get('/:id', authMiddleware, requirePermission('user.read, user.write'), getUserProfile);

export default router;
