import * as contentRepo from '../../../infrastructure/persistence/repositories/contentNode.repository.js';
import { connectDb } from '../../../infrastructure/persistence/mongoose.js';

// Retrieves content for a given knowledge node by nodeId
export async function getNodeContent(nodeId) {
  await connectDb();
  return contentRepo.findByNodeId(nodeId);
}
