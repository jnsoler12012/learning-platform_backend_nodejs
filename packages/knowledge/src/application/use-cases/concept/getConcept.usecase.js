import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Retrieves a concept with all its prerequisites, dependents, and related concepts
export async function getConcept(id) {
  const concept = await conceptRepo.getFullConceptDetail(id);
  if (!concept) {
    throw new AppError('Concept not found', 404, ERROR_CODES.NOT_FOUND);
  }
  return concept;
}
