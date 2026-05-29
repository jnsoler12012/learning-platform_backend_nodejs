import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';

// Lists all concepts, optionally filtered by track and/or subtrack
export async function listConcepts({ track, subtrack } = {}) {
  return conceptRepo.findAll({ track, subtrack });
}
