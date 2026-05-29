import { AppError } from '@platform/shared/errors/AppError.js';
import { env } from '../../config/env.js';

// Global Express error handler that distinguishes operational AppErrors from unexpected errors
export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    console.log(err);
    
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
}
