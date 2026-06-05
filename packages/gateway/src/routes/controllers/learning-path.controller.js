import { env } from '../../config/env.js';
import { authHeader } from '../../services/proxy.js';

// PUT /api/student/learning-paths — batch-enables or disables enrollment for the given path codes
export async function batchUpdateEnrollments(req, res, next) {
  try {
    const { codes } = req.body;
    if (!Array.isArray(codes)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'codes must be an array' } });
    }

    const h = { 'Content-Type': 'application/json', ...authHeader(req) };

    // Fetch all available paths and the user's current enrollments
    const [pathsRes, enrolledRes] = await Promise.all([
      fetch(`${env.AUTH_URL}/learning-paths`, { headers: h }),
      fetch(`${env.AUTH_URL}/learning-paths/me`, { headers: h }),
    ]);

    const allPaths = await pathsRes.json();
    const enrolledData = await enrolledRes.json();

    // Build a lookup map from path code to path object
    const pathByCode = {};
    for (const p of allPaths) pathByCode[p.code] = p;

    // Map currently active enrollments by path code
    const currentActive = {};
    if (Array.isArray(enrolledData)) {
      for (const e of enrolledData) {
        const code = e.learningPath?.code;
        if (e.enrollment?.isActive) currentActive[code] = e.learningPath?.id;
      }
    }

    const promises = [];

    // Activate enrollments for codes in the array that are not yet active
    for (const code of codes) {
      const path = pathByCode[code];
      if (!path) continue;
      if (currentActive[code]) continue;
      promises.push(
        fetch(`${env.AUTH_URL}/learning-paths/enrollment`, {
          method: 'PUT', headers: h,
          body: JSON.stringify({ learningPathId: path.id, isActive: true }),
        }),
      );
    }

    // Deactivate enrollments for codes not in the array but currently active
    for (const [code, id] of Object.entries(currentActive)) {
      if (!codes.includes(code)) {
        promises.push(
          fetch(`${env.AUTH_URL}/learning-paths/enrollment`, {
            method: 'PUT', headers: h,
            body: JSON.stringify({ learningPathId: id, isActive: false }),
          }),
        );
      }
    }

    await Promise.all(promises);

    // Return the updated list of enrolled paths
    const updatedRes = await fetch(`${env.AUTH_URL}/learning-paths/me`, { headers: h });
    const updatedData = await updatedRes.json();
    const enrolledPaths = Array.isArray(updatedData)
      ? updatedData.map((e) => ({ id: e.learningPath?.id, code: e.learningPath?.code, title: e.learningPath?.title, progress: e.enrollment?.progressPercent, isActive: e.enrollment?.isActive }))
      : [];

    res.status(200).json({ enrolledPaths });
  } catch (err) { next(err); }
}
