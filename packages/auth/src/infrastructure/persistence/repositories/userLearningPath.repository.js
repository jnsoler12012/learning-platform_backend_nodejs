import { prisma } from '../../../config/prisma.js';
import { UserLearningPath } from '../../../domain/entities/UserLearningPath.entity.js';
import { LearningPath } from '../../../domain/entities/LearningPath.entity.js';

// Maps raw database row to UserLearningPath domain entity
function toEntity(data) {
  if (!data) return null;
  return new UserLearningPath({
    userId: data.userId,
    learningPathId: data.learningPathId,
    isActive: data.isActive,
    startedAt: data.startedAt,
    progressPercent: data.progressPercent,
    completedAt: data.completedAt,
    status: data.status,
  });
}

// Finds an enrollment by composite key (userId + learningPathId)
export async function findByUserAndPath(userId, learningPathId) {
  const data = await prisma.userLearningPath.findUnique({
    where: { userId_learningPathId: { userId, learningPathId } },
  });
  return toEntity(data);
}

// Finds all enrollments for a user, including the associated learning path details
export async function findByUserId(userId) {
  const data = await prisma.userLearningPath.findMany({
    where: { userId },
    include: { learningPath: true },
  });
  return data.map((ulp) => ({
    enrollment: toEntity(ulp),
    learningPath: new LearningPath({
      id: ulp.learningPath.id,
      code: ulp.learningPath.code,
      title: ulp.learningPath.title,
      description: ulp.learningPath.description,
      createdAt: ulp.learningPath.createdAt,
      updatedAt: ulp.learningPath.updatedAt,
      deletedAt: ulp.learningPath.deletedAt,
    }),
  }));
}

// Creates a new enrollment record
export async function create(data) {
  const result = await prisma.userLearningPath.create({
    data: {
      userId: data.userId,
      learningPathId: data.learningPathId,
      isActive: data.isActive ?? true,
      startedAt: data.startedAt || new Date(),
      progressPercent: data.progressPercent ?? 0,
      status: data.status || 'pending',
    },
  });
  return toEntity(result);
}

// Updates the active status of an enrollment
export async function updateActiveStatus(userId, learningPathId, isActive) {
  const result = await prisma.userLearningPath.update({
    where: { userId_learningPathId: { userId, learningPathId } },
    data: { isActive },
  });
  return toEntity(result);
}

// Updates progress and status of an enrollment; auto-completes when progress reaches 100%
export async function updateProgress(userId, learningPathId, { progressPercent, status, completedAt }) {
  const data = {};
  if (progressPercent !== undefined) data.progressPercent = progressPercent;
  if (status !== undefined) data.status = status;
  if (completedAt !== undefined) data.completedAt = completedAt;
  if (progressPercent !== undefined && progressPercent >= 100) {
    data.status = 'completed';
    data.completedAt = new Date();
    data.isActive = false;
  }

  const result = await prisma.userLearningPath.update({
    where: { userId_learningPathId: { userId, learningPathId } },
    data,
  });
  return toEntity(result);
}
