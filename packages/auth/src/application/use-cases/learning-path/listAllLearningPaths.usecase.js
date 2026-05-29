import * as learningPathRepo from '../../../infrastructure/persistence/repositories/learningPath.repository.js';

// Returns all non-deleted learning paths
export async function listAllLearningPaths() {
  return learningPathRepo.findAll();
}
