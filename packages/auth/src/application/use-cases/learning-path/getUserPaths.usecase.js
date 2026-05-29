import * as userLearningPathRepo from '../../../infrastructure/persistence/repositories/userLearningPath.repository.js';

// Retrieves all learning path enrollments for a given user
export async function getUserPaths(userId) {
  const enrollments = await userLearningPathRepo.findByUserId(userId);
  return enrollments;
}
