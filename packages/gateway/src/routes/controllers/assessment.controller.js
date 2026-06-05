import { env } from '../../config/env.js';
import { authHeader } from '../../services/proxy.js';

// GET /api/student/assessments/:id — aggregates assessment metadata and its questions (from Content service) into a single response
export async function getAssessmentDetail(req, res, next) {
  try {
    const h = { ...authHeader(req) };
    const [assessRes, questionsRes] = await Promise.all([
      fetch(`${env.CONTENT_URL}/content/assessments/${req.params.id}`, { headers: h }),
      fetch(`${env.CONTENT_URL}/content/assessments/${req.params.id}/questions`, { headers: h }),
    ]);

    const assessment = await assessRes.json();
    let questions;
    try { questions = await questionsRes.json(); } catch { questions = []; }

    res.status(200).json({ assessment, questions: Array.isArray(questions) ? questions : [] });
  } catch (err) { next(err); }
}
