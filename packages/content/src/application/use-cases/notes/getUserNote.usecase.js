import * as noteRepo from '../../../infrastructure/persistence/repositories/userNote.repository.js';
import { connectDb } from '../../../infrastructure/persistence/mongoose.js';

// Retrieves a user's note for a specific node
export async function getUserNote(userId, nodeId) {
  await connectDb();
  return noteRepo.findByUserAndNode(userId, nodeId);
}
