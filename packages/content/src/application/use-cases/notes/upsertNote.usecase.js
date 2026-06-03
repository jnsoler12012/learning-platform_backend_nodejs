import * as noteRepo from '../../../infrastructure/persistence/repositories/userNote.repository.js';
import { connectDb } from '../../../infrastructure/persistence/mongoose.js';

// Creates or updates a user's note for a given node
export async function upsertNote({ userId, nodeId, title, markdownContent, tags }) {
  await connectDb();
  return noteRepo.upsert(userId, nodeId, { title, markdownContent, tags });
}
