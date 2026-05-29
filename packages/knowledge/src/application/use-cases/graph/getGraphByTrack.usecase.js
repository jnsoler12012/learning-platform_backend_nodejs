import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Returns a filtered knowledge graph containing only concepts in the given track
export async function getGraphByTrack(track) {
  if (!track) {
    throw new AppError('Track parameter is required', 400, ERROR_CODES.VALIDATION_ERROR);
  }
  return conceptRepo.getGraphByTrack(track);
}
