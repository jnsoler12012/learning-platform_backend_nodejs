import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Soft-deletes a user account by id, throws if not found
export async function deleteUser(userId) {
  const user = await userRepo.findById(userId);
  if (!user || user.isDeleted()) {
    throw new AppError('User not found', 404, ERROR_CODES.NOT_FOUND);
  }

  await userRepo.softDelete(userId);
  return { message: 'User deleted successfully' };
}
