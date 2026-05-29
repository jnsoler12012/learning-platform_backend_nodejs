import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Finds the shortest REQUIRES_TO path between two concepts, throws if no path exists
export async function getConceptPath(fromId, toId) {
  if (!fromId || !toId) {
    throw new AppError('Both from and to concept IDs are required', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const path = await conceptRepo.getConceptPath(fromId, toId);
  if (!path || path.nodes.length === 0) {
    throw new AppError('No path found between the specified concepts', 404, ERROR_CODES.NOT_FOUND);
  }

  return path;
}
