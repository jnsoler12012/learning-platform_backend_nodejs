import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';
import * as userLearningPathRepo from '../../../infrastructure/persistence/repositories/userLearningPath.repository.js';

// Toggles the active status of an existing enrollment, throws if not found
export async function toggleEnrollmentActive({ userId, learningPathId, isActive }) {
  const enrollment = await userLearningPathRepo.findByUserAndPath(userId, learningPathId);
  if (!enrollment) {
    throw new AppError('Enrollment not found', 404, ERROR_CODES.NOT_FOUND);
  }

  return await userLearningPathRepo.updateActiveStatus(userId, learningPathId, isActive);
}
