import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorCodes.js';
import { verifyToken } from './jwt.service.js';

// Express middleware that validates Bearer token and attaches user info to request
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401, ERROR_CODES.UNAUTHORIZED));
  }

  const token = header.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
    };
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token', 401, ERROR_CODES.UNAUTHORIZED));
  }
}
