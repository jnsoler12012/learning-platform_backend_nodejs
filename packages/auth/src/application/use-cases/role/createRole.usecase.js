import * as roleRepo from '../../../infrastructure/persistence/repositories/role.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Creates a new role after validating the name is not empty and not a duplicate
export async function createRole({ name, description }) {
  if (!name || name.trim().length === 0) {
    throw new AppError('Role name is required', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const existing = await roleRepo.findByName(name);
  if (existing) {
    throw new AppError('Role already exists', 409, ERROR_CODES.CONFLICT);
  }

  const role = await roleRepo.create({ name, description });
  return role;
}
