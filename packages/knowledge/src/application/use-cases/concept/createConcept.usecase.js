import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Creates a new concept node after validating required fields and checking for duplicate id
export async function createConcept({ id, name, description, subtrack, track, difficulty }) {
  if (!id || !name) {
    throw new AppError('Concept id and name are required', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const existing = await conceptRepo.findById(id);
  if (existing) {
    throw new AppError(`Concept with id '${id}' already exists`, 409, ERROR_CODES.CONFLICT);
  }

  return conceptRepo.create({
    id,
    name,
    description: description || '',
    subtrack: subtrack || null,
    track: track || null,
    difficulty: difficulty !== undefined ? Number(difficulty) : null,
  });
}
