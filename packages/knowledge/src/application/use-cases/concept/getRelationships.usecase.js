import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Retrieves all prerequisite concepts for a given concept id
export async function getPrerequisites(id) {
  const concept = await conceptRepo.findById(id);
  if (!concept) {
    throw new AppError('Concept not found', 404, ERROR_CODES.NOT_FOUND);
  }
  return conceptRepo.getPrerequisites(id);
}

// Retrieves all dependent concepts that require the given concept
export async function getDependents(id) {
  const concept = await conceptRepo.findById(id);
  if (!concept) {
    throw new AppError('Concept not found', 404, ERROR_CODES.NOT_FOUND);
  }
  return conceptRepo.getDependents(id);
}

// Retrieves all concepts related to the given concept via RELATES_TO
export async function getRelated(id) {
  const concept = await conceptRepo.findById(id);
  if (!concept) {
    throw new AppError('Concept not found', 404, ERROR_CODES.NOT_FOUND);
  }
  return conceptRepo.getRelated(id);
}
