import * as learningPathRepo from '../../../infrastructure/persistence/repositories/learningPath.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Soft-deletes a learning path by id, throws if not found
export async function deleteLearningPath(id) {
  const existing = await learningPathRepo.findById(id);
  if (!existing || existing.isDeleted()) {
    throw new AppError('Learning path not found', 404, ERROR_CODES.NOT_FOUND);
  }

  await learningPathRepo.softDelete(id);
  return { message: 'Learning path deleted successfully' };
}
