import * as conceptRepo from '../../../infrastructure/persistence/repositories/concept.repository.js';

// Returns the complete knowledge graph with all nodes and edges
export async function getFullGraph() {
  return conceptRepo.getFullGraph();
}
