import { AppError } from '@platform/shared/errors/AppError.js';
import { env } from '../../config/env.js';

// Express error handler: returns structured JSON for AppError, generic 500 otherwise
export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
  }

  console.error('Content service error:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
}
