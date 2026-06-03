import { Router } from 'express';
import { authMiddleware } from '@platform/shared/security/auth.middleware.js';
import { requirePermission } from '@platform/shared/security/rbac.middleware.js';
import { getByNodeId, create, update, remove } from '../controllers/content.controller.js';
import { get, upsert, remove as deleteNote } from '../controllers/note.controller.js';
import { list, getById, create as createAssessment, listQuestions, addQuestionToAssessment } from '../controllers/assessment.controller.js';
import { handleUpload } from '../controllers/upload.controller.js';

const router = Router();

// All routes require authentication + specific permission

router.post('/upload', authMiddleware, requirePermission('content.write'), handleUpload);

router.get('/nodes/:nodeId', authMiddleware, requirePermission('content.read'), getByNodeId);
router.post('/nodes', authMiddleware, requirePermission('content.write'), create);
router.patch('/nodes/:nodeId', authMiddleware, requirePermission('content.write'), update);
router.delete('/nodes/:nodeId', authMiddleware, requirePermission('content.write'), remove);

router.get('/notes/:nodeId', authMiddleware, requirePermission('notes.read'), get);
router.put('/notes/:nodeId', authMiddleware, requirePermission('notes.write'), upsert);
router.delete('/notes/:nodeId', authMiddleware, requirePermission('notes.write'), deleteNote);

router.get('/assessments', authMiddleware, requirePermission('assessment.read'), list);
router.get('/assessments/:id', authMiddleware, requirePermission('assessment.read'), getById);
router.post('/assessments', authMiddleware, requirePermission('assessment.write'), createAssessment);
router.get('/assessments/:id/questions', authMiddleware, requirePermission('assessment.read'), listQuestions);
router.post('/assessments/:id/questions', authMiddleware, requirePermission('assessment.write'), addQuestionToAssessment);

export default router;
