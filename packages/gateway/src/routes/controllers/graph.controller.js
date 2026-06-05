import { env } from '../../config/env.js';
import { forwardTo, authHeader } from '../../services/proxy.js';

// GET /api/student/graph — returns the full knowledge graph enriched with the user's enrollment context
export async function getGraph(req, res, next) {
  try {
    const h = { ...authHeader(req) };
    const [graphRes, pathsRes] = await Promise.all([
      fetch(`${env.KNOWLEDGE_URL}/concepts/graph`, { headers: h }),
      fetch(`${env.AUTH_URL}/learning-paths/me`, { headers: h }),
    ]);

    const graph = await graphRes.json();
    const pathsData = await pathsRes.json();

    const enrolledPaths = Array.isArray(pathsData)
      ? pathsData.map((e) => ({ code: e.learningPath?.code, title: e.learningPath?.title, progress: e.enrollment?.progressPercent }))
      : [];

    res.status(200).json({
      nodes: graph.nodes || [], edges: graph.edges || [],
      userTracks: enrolledPaths.filter(e => e.code).map(e => e.code),
      learningPaths: enrolledPaths,
    });
  } catch (err) { next(err); }
}

// GET /api/student/graph/track/:track — same as getGraph but filtered to a single track
export async function getGraphByTrack(req, res, next) {
  try {
    const h = { ...authHeader(req) };
    const [graphRes, pathsRes] = await Promise.all([
      fetch(`${env.KNOWLEDGE_URL}/concepts/graph/track/${req.params.track}`, { headers: h }),
      fetch(`${env.AUTH_URL}/learning-paths/me`, { headers: h }),
    ]);

    const graph = await graphRes.json();
    const pathsData = await pathsRes.json();
    const enrolledPaths = Array.isArray(pathsData)
      ? pathsData.map((e) => ({ code: e.learningPath?.code, title: e.learningPath?.title, progress: e.enrollment?.progressPercent }))
      : [];

    res.status(200).json({
      nodes: graph.nodes || [], edges: graph.edges || [],
      userTracks: enrolledPaths.filter(e => e.code).map(e => e.code),
      learningPaths: enrolledPaths,
    });
  } catch (err) { next(err); }
}

// GET /api/student/graph/path/:from/:to — finds the shortest REQUIRES_TO path between two concepts (simple forward)
export async function getPath(req, res, next) {
  try { const r = await forwardTo('knowledge', req); res.status(r.status).json(r.data); } catch (err) { next(err); }
}
