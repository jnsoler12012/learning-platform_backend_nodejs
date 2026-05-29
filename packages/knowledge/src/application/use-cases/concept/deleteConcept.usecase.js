import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Permanently removes a concept node, throws if not found
export async function deleteConcept(id) {
  const existing = await conceptRepo.findById(id);
  if (!existing) {
    throw new AppError('Concept not found', 404, ERROR_CODES.NOT_FOUND);
  }

  await conceptRepo.remove(id);
  return { message: 'Concept deleted successfully' };
}
