import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Updates a concept's fields, throwing if the concept does not exist or no changes provided
export async function updateConcept(id, data) {
  const existing = await conceptRepo.findById(id);
  if (!existing) {
    throw new AppError('Concept not found', 404, ERROR_CODES.NOT_FOUND);
  }

  const safe = {};
  if (data.name !== undefined) safe.name = data.name;
  if (data.description !== undefined) safe.description = data.description;
  if (data.subtrack !== undefined) safe.subtrack = data.subtrack;
  if (data.track !== undefined) safe.track = data.track;
  if (data.difficulty !== undefined) safe.difficulty = Number(data.difficulty);

  if (Object.keys(safe).length === 0) {
    throw new AppError('No changes provided', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  return conceptRepo.update(id, safe);
}
