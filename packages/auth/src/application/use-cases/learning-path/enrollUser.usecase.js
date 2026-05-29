import * as learningPathRepo from '../../../infrastructure/persistence/repositories/learningPath.repository.js';
import * as userLearningPathRepo from '../../../infrastructure/persistence/repositories/userLearningPath.repository.js';
import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Enrolls a user in a learning path, validating both exist and not already enrolled
export async function enrollUser({ userId, learningPathId }) {
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
    throw new AppError('Already enrolled in this learning path', 409, ERROR_CODES.CONFLICT);
  }

  const enrollment = await userLearningPathRepo.create({
    userId,
    learningPathId,
    isActive: true,
    startedAt: new Date(),
    progressPercent: 0,
    status: 'in_progress',
  });

  return enrollment;
}
