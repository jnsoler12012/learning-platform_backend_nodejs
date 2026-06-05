import { env } from '../../config/env.js';
import { forwardTo, authHeader } from '../../services/proxy.js';

// POST /api/student/auth/register — forwards registration to the auth service
export async function register(req, res, next) {
  try { const r = await forwardTo('auth', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
}

// POST /api/student/auth/login — forwards login to the auth service
export async function login(req, res, next) {
  try { const r = await forwardTo('auth', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
}

// GET /api/student/auth/me — aggregates user profile, enrolled paths, and available paths in a single response
export async function getMyProfile(req, res, next) {
  try {
    const h = { ...authHeader(req) };
    const [userRes, enrolledRes, pathsRes] = await Promise.all([
      fetch(`${env.AUTH_URL}/users/me`, { headers: h }),
      fetch(`${env.AUTH_URL}/learning-paths/me`, { headers: h }),
      fetch(`${env.AUTH_URL}/learning-paths`, { headers: h }),
    ]);

    const user = await userRes.json();
    const enrolledData = await enrolledRes.json();
    const pathsData = await pathsRes.json();

    const enrolledPaths = Array.isArray(enrolledData)
      ? enrolledData.map((e) => ({
          id: e.learningPath?.id, code: e.learningPath?.code,
          title: e.learningPath?.title, progress: e.enrollment?.progressPercent,
          isActive: e.enrollment?.isActive,
        }))
      : [];

    const availablePaths = Array.isArray(pathsData)
      ? pathsData.map((p) => ({ id: p.id, code: p.code, title: p.title }))
      : [];

    res.status(200).json({ user, enrolledPaths, availablePaths });
  } catch (err) { next(err); }
}

// PATCH /api/student/auth/me — forwards profile update to the auth service
export async function updateProfile(req, res, next) {
  try { const r = await forwardTo('auth', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
}

// PATCH /api/student/auth/me/account — forwards account credential update to the auth service
export async function updateAccount(req, res, next) {
  try { const r = await forwardTo('auth', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
}

// DELETE /api/student/auth/me — forwards account deletion to the auth service
export async function deleteAccount(req, res, next) {
  try { const r = await forwardTo('auth', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
}
