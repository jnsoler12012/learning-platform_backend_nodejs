import { env } from '../config/env.js';

// Maps logical service names to their base URLs
const SERVICE_MAP = {
  auth: env.AUTH_URL,
  knowledge: env.KNOWLEDGE_URL,
  content: env.CONTENT_URL,
};

// Extracts the Bearer Authorization header from the incoming request, if present
function authHeader(req) {
  return req.headers?.authorization ? { Authorization: req.headers.authorization } : {};
}

// Forwards an incoming request to the target backend service and returns its response
export async function forwardTo(serviceName, req, pathOverride) {
  const baseUrl = SERVICE_MAP[serviceName];
  if (!baseUrl) throw new Error(`Unknown service: ${serviceName}`);

  const path = pathOverride || req.originalUrl.replace('/api/student', '');
  const url = `${baseUrl}${path}`;

  const headers = { 'Content-Type': 'application/json', ...authHeader(req) };

  const options = { method: req.method, headers };
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length) {
    options.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(url, options);
    let data;
    try { data = await response.json(); } catch { data = null; }
    return { status: response.status, data };
  } catch (err) {
    throw err;
  }
}

export { authHeader };
