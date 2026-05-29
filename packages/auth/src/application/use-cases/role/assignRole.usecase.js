import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import * as roleRepo from '../../../infrastructure/persistence/repositories/role.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Assigns a role to a user, validating both exist and are not deleted
export async function assignRole({ userId, roleId }) {
  const user = await userRepo.findById(userId);
  if (!user || user.isDeleted()) {
    throw new AppError('User not found', 404, ERROR_CODES.NOT_FOUND);
  }

  const role = await roleRepo.findById(roleId);
  if (!role || role.isDeleted()) {
    throw new AppError('Role not found', 404, ERROR_CODES.NOT_FOUND);
  }

  await roleRepo.assignToUser(userId, roleId);
  return { message: 'Role assigned successfully' };
}
