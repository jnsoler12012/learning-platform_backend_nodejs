import { Email } from '../../../domain/value-objects/Email.js';
import { comparePassword } from '../../../infrastructure/security/password.service.js';
import { signToken } from '@platform/shared/security/jwt.service.js';
import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import * as roleRepo from '../../../infrastructure/persistence/repositories/role.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Authenticates a user with email/password and returns a signed JWT with roles and permissions
export async function loginUser({ email, password }) {
  const emailVO = new Email(email);
  const user = await userRepo.findByEmail(emailVO.getValue());
  if (!user || user.isDeleted()) {
    throw new AppError('Invalid email or password', 401, ERROR_CODES.UNAUTHORIZED);
  }

  if (!user.isActive) {
    throw new AppError('Account is inactive', 403, ERROR_CODES.FORBIDDEN);
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401, ERROR_CODES.UNAUTHORIZED);
  }

  const roles = await roleRepo.findRolesByUserId(user.id);
  const roleNames = roles.map((r) => r.name);
  const roleIds = roles.map((r) => r.id);
  const permissions = await roleRepo.findPermissionsByRoleIds(roleIds);
  const permissionSlugs = permissions.map((p) => p.slug);

  const token = signToken({ userId: user.id, email: user.email, roles: roleNames, permissions: permissionSlugs });

  return {
    token,
    user: { id: user.id, email: user.email, isActive: user.isActive },
    roles: roleNames,
  };
}
