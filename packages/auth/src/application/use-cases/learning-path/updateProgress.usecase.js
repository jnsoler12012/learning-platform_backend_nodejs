import * as userLearningPathRepo from '../../../infrastructure/persistence/repositories/userLearningPath.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Updates a user's progress on a learning path enrollment, preventing updates on completed paths
export async function updateProgress({ userId, learningPathId, progressPercent, status }) {
  const enrollment = await userLearningPathRepo.findByUserAndPath(userId, learningPathId);
  if (!enrollment) {
    throw new AppError('Enrollment not found', 404, ERROR_CODES.NOT_FOUND);
  }

  if (enrollment.isCompleted()) {
    throw new AppError('Learning path already completed', 409, ERROR_CODES.CONFLICT);
  }

  const updated = await userLearningPathRepo.updateProgress(userId, learningPathId, {
    progressPercent,
    status,
  });

  return updated;
}
