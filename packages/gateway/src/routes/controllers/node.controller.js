import { env } from '../../config/env.js';
import { authHeader } from '../../services/proxy.js';

// GET /api/student/nodes/:nodeId — aggregates concept metadata (Knowledge) and content blocks (Content) into a single response
export async function getNodeDetail(req, res, next) {
  try {
    const h = { ...authHeader(req) };
    const [conceptRes, contentRes] = await Promise.all([
      fetch(`${env.KNOWLEDGE_URL}/concepts/${req.params.nodeId}`, { headers: h }),
      fetch(`${env.CONTENT_URL}/content/nodes/${req.params.nodeId}`, { headers: h }),
    ]);

    const concept = await conceptRes.json();
    const content = await contentRes.json();

    res.status(200).json({ concept, content });
  } catch (err) { next(err); }
}
