import { Email } from '../../../domain/value-objects/Email.js';
import { hashPassword } from '../../../infrastructure/security/password.service.js';
import { signToken } from '@platform/shared/security/jwt.service.js';
import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import * as roleRepo from '../../../infrastructure/persistence/repositories/role.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Registers a new user, creates a profile, assigns the student role, and returns a JWT
export async function registerUser({ email, password, firstName, lastName }) {
  const emailVO = new Email(email);
  const existing = await userRepo.findByEmail(emailVO.getValue());
  if (existing) {
    throw new AppError('Email already registered', 409, ERROR_CODES.CONFLICT);
  }

  if (!password || password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepo.create({ email: emailVO.getValue(), passwordHash });

  await userRepo.createProfile(user.id, { firstName, lastName, displayName: emailVO.getValue() });

  const studentRole = await roleRepo.findByName('student');
  
  if (studentRole) {
    await roleRepo.assignToUser(user.id, studentRole.id);
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
