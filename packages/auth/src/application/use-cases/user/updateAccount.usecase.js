import { Email } from '../../../domain/value-objects/Email.js';
import { hashPassword, comparePassword } from '../../../infrastructure/security/password.service.js';
import { signToken } from '@platform/shared/security/jwt.service.js';
import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import * as roleRepo from '../../../infrastructure/persistence/repositories/role.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Updates user account credentials (email/password) after validating current password, returns a new JWT if email changed
export async function updateAccount({ userId, currentPassword, newEmail, newPassword }) {
  const user = await userRepo.findById(userId);
  if (!user || user.isDeleted()) {
    throw new AppError('User not found', 404, ERROR_CODES.NOT_FOUND);
  }

  if (!currentPassword) {
    throw new AppError('Current password is required', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) {
    throw new AppError('Current password is incorrect', 403, ERROR_CODES.FORBIDDEN);
  }

  const updateData = {};
  let emailChanged = false;

  if (newEmail !== undefined && newEmail !== null) {
    const emailVO = new Email(newEmail);
    const normalizedEmail = emailVO.getValue();

    if (normalizedEmail !== user.email) {
      const existing = await userRepo.findByEmail(normalizedEmail);
      if (existing) {
        throw new AppError('Email already in use', 409, ERROR_CODES.CONFLICT);
      }
      updateData.email = normalizedEmail;
      emailChanged = true;
    }
  }

  if (newPassword !== undefined && newPassword !== null) {
    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400, ERROR_CODES.VALIDATION_ERROR);
    }
    updateData.passwordHash = await hashPassword(newPassword);
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError('No changes requested', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  await userRepo.update(user.id, updateData);

  const result = { message: 'Account updated successfully' };

  if (emailChanged) {
    const roles = await roleRepo.findRolesByUserId(user.id);
    const roleNames = roles.map((r) => r.name);
    const roleIds = roles.map((r) => r.id);
    const permissions = await roleRepo.findPermissionsByRoleIds(roleIds);
    const permissionSlugs = permissions.map((p) => p.slug);
    const token = signToken({ userId: user.id, email: updateData.email, roles: roleNames, permissions: permissionSlugs });
    result.token = token;
    result.email = updateData.email;
  }

  return result;
}
