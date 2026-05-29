import * as learningPathRepo from '../../../infrastructure/persistence/repositories/learningPath.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Creates a new learning path after validating code
export async function createLearningPath({ code, title, description }) {
  if (!code || !title) {
    throw new AppError('Code and title are required', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const existing = await learningPathRepo.findByCode(code);
  if (existing) {
    throw new AppError('Learning path with this code already exists', 409, ERROR_CODES.CONFLICT);
  }

  return learningPathRepo.create({ code, title, description });
}
