import * as learningPathRepo from '../../../infrastructure/persistence/repositories/learningPath.repository.js';
import * as userLearningPathRepo from '../../../infrastructure/persistence/repositories/userLearningPath.repository.js';
import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Sets an enrollment's active status, creating the enrollment if it doesn't exist yet
export async function setEnrollmentActive({ userId, learningPathId, isActive }) {
  const user = await userRepo.findById(userId);
  if (!user || user.isDeleted()) {
    throw new AppError('User not found', 404, ERROR_CODES.NOT_FOUND);
  }

  const learningPath = await learningPathRepo.findById(learningPathId);
  if (!learningPath || learningPath.isDeleted()) {
    throw new AppError('Learning path not found', 404, ERROR_CODES.NOT_FOUND);
  }

  const existing = await userLearningPathRepo.findByUserAndPath(userId, learningPathId);

  if (existing) {
    return await userLearningPathRepo.updateActiveStatus(userId, learningPathId, isActive);
  }

  return await userLearningPathRepo.create({
    userId,
    learningPathId,
    isActive,
    startedAt: isActive ? new Date() : null,
    progressPercent: 0,
    status: isActive ? 'in_progress' : 'pending',
  });
}
