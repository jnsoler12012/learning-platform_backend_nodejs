import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorCodes.js';

// Middleware factory that checks if the authenticated user has a specific permission (admin bypasses this check)
export function requirePermission(permissionSlug) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401, ERROR_CODES.UNAUTHORIZED));
      }

      if (req.user.roles.includes('admin')) {
        return next();
      }

      if (!req.user.permissions || !req.user.permissions.includes(permissionSlug)) {
        return next(new AppError('Insufficient permissions', 403, ERROR_CODES.FORBIDDEN));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
