import * as noteRepo from '../../../infrastructure/persistence/repositories/userNote.repository.js';
import { connectDb } from '../../../infrastructure/persistence/mongoose.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Deletes a user's note for a given node; throws if no note exists
export async function deleteNote(userId, nodeId) {
  await connectDb();

  const existing = await noteRepo.findByUserAndNode(userId, nodeId);
  if (!existing) {
    throw new AppError('Note not found for this user and node', 404, ERROR_CODES.NOT_FOUND);
  }

  await noteRepo.remove(userId, nodeId);
  return { message: 'Note deleted successfully' };
}
