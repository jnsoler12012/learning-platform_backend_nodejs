import * as contentRepo from '../../../infrastructure/persistence/repositories/contentNode.repository.js';
import { connectDb } from '../../../infrastructure/persistence/mongoose.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Deletes content associated with a knowledge node; throws if not found
export async function deleteNodeContent(nodeId) {
  await connectDb();

  const existing = await contentRepo.findByNodeId(nodeId);
  if (!existing) {
    throw new AppError(`Content for node '${nodeId}' not found`, 404, ERROR_CODES.NOT_FOUND);
  }

  await contentRepo.removeByNodeId(nodeId);
  return { message: 'Node content deleted successfully' };
}
