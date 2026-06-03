import * as contentRepo from '../../../infrastructure/persistence/repositories/contentNode.repository.js';
import { connectDb } from '../../../infrastructure/persistence/mongoose.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Creates content blocks for a knowledge node; rejects if content already exists
export async function createNodeContent({ nodeId, estimatedDurationMinutes, searchText, blocks }) {
  await connectDb();

  if (!nodeId) {
    throw new AppError('nodeId is required', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  const existing = await contentRepo.findByNodeId(nodeId);
  if (existing) {
    throw new AppError(`Content for node '${nodeId}' already exists`, 409, ERROR_CODES.CONFLICT);
  }

  return contentRepo.create({
    nodeId,
    estimatedDurationMinutes: estimatedDurationMinutes || 15,
    version: 1,
    versionStatus: 'PUBLISHED',
    searchText: searchText || '',
    blocks: blocks || [],
  });
}
