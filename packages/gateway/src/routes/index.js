import { Router } from 'express';
import { forwardTo } from '../services/proxy.js';

import { register, login, getMyProfile, updateProfile, updateAccount, deleteAccount } from './controllers/auth.controller.js';
import { getGraph, getGraphByTrack, getPath } from './controllers/graph.controller.js';
import { getNodeDetail } from './controllers/node.controller.js';
import { getAssessmentDetail } from './controllers/assessment.controller.js';
import { batchUpdateEnrollments } from './controllers/learning-path.controller.js';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gateway' });
});

// Auth — register and login (no auth required; the backend service handles it)
router.post('/auth/register', register);
router.post('/auth/login', login);

// Auth — profile management (forwards to auth service)
router.get('/auth/me', getMyProfile);
router.patch('/auth/me', async (req, res, next) => {
  try { const r = await forwardTo('auth', req, '/users/me'); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.patch('/auth/me/account', async (req, res, next) => {
  try { const r = await forwardTo('auth', req, '/users/me/account'); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.delete('/auth/me', async (req, res, next) => {
  try { const r = await forwardTo('auth', req, '/users/me'); res.status(r.status).json(r.data); } catch (err) { next(err); }
});

// Learning Paths
router.get('/learning-paths', async (req, res, next) => {
  try { const r = await forwardTo('auth', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.get('/learning-paths/enrolled', async (req, res, next) => {
  try { const r = await forwardTo('auth', req, '/learning-paths/me'); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.put('/learning-paths', batchUpdateEnrollments);

// Graph — knowledge graph with user enrollment context
router.get('/graph', getGraph);
router.get('/graph/track/:track', getGraphByTrack);
router.get('/graph/path/:from/:to', getPath);

// Concepts — knowledge base read endpoints (forwards to knowledge service)
router.get('/concepts', async (req, res, next) => {
  try { const r = await forwardTo('knowledge', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.get('/concepts/:id', async (req, res, next) => {
  try { const r = await forwardTo('knowledge', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.get('/concepts/:id/prerequisites', async (req, res, next) => {
  try { const r = await forwardTo('knowledge', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.get('/concepts/:id/dependents', async (req, res, next) => {
  try { const r = await forwardTo('knowledge', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.get('/concepts/:id/related', async (req, res, next) => {
  try { const r = await forwardTo('knowledge', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
});

// Nodes — composite endpoint that merges concept + content data
router.get('/nodes/:nodeId', getNodeDetail);

// Notes — CRUD for the authenticated user's personal notes (forwards to content service)
router.get('/nodes/:nodeId/note', async (req, res, next) => {
  try { const r = await forwardTo('content', req, `/content/notes/${req.params.nodeId}`); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.put('/nodes/:nodeId/note', async (req, res, next) => {
  try { const r = await forwardTo('content', req, `/content/notes/${req.params.nodeId}`); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.delete('/nodes/:nodeId/note', async (req, res, next) => {
  try { const r = await forwardTo('content', req, `/content/notes/${req.params.nodeId}`); res.status(r.status).json(r.data); } catch (err) { next(err); }
});

// Assessments
router.get('/assessments', async (req, res, next) => {
  try { const r = await forwardTo('content', req, '/content/assessments'); res.status(r.status).json(r.data); } catch (err) { next(err); }
});
router.get('/assessments/:id', getAssessmentDetail);

export default router;
