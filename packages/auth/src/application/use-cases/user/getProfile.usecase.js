import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Removes the passwordHash from the user object for safe responses
function sanitize(result) {
  const { passwordHash, ...safeUser } = result.user;
  return { user: safeUser, profile: result.profile, roles: result.roles };
}

// Retrieves the authenticated user's own profile with roles
export async function getProfile(userId) {
  const result = await userRepo.findByIdWithProfile(userId);
  if (!result || result.user.isDeleted()) {
    throw new AppError('User not found', 404, ERROR_CODES.NOT_FOUND);
  }
  return sanitize(result);
}

// Retrieves any user's profile by target id with roles
export async function getUserById(targetId) {
  const result = await userRepo.findByIdWithProfile(targetId);
  if (!result || result.user.isDeleted()) {
    throw new AppError('User not found', 404, ERROR_CODES.NOT_FOUND);
  }
  return sanitize(result);
}
