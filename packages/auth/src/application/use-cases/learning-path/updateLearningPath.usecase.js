import * as learningPathRepo from '../../../infrastructure/persistence/repositories/learningPath.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Updates a learning path's fields, checking for code uniqueness if changed
export async function updateLearningPath(id, { code, title, description }) {
  const existing = await learningPathRepo.findById(id);
  if (!existing || existing.isDeleted()) {
    throw new AppError('Learning path not found', 404, ERROR_CODES.NOT_FOUND);
  }

  if (code) {
    const duplicate = await learningPathRepo.findByCode(code);
    if (duplicate && duplicate.id !== id) {
      throw new AppError('Learning path with this code already exists', 409, ERROR_CODES.CONFLICT);
    }
  }

  return learningPathRepo.update(id, { code, title, description });
}
