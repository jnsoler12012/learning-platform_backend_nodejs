import * as contentRepo from '../../../infrastructure/persistence/repositories/contentNode.repository.js';
import { connectDb } from '../../../infrastructure/persistence/mongoose.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Partially updates node content; bumps version on every change
export async function updateNodeContent(nodeId, data) {
  await connectDb();

  const existing = await contentRepo.findByNodeId(nodeId);
  if (!existing) {
    throw new AppError(`Content for node '${nodeId}' not found`, 404, ERROR_CODES.NOT_FOUND);
  }

  const update = {};
  if (data.estimatedDurationMinutes !== undefined) update.estimatedDurationMinutes = data.estimatedDurationMinutes;
  if (data.searchText !== undefined) update.searchText = data.searchText;
  if (data.blocks !== undefined) update.blocks = data.blocks;
  if (data.versionStatus !== undefined) update.versionStatus = data.versionStatus;
  update.version = (existing.version || 1) + 1;

  return contentRepo.updateByNodeId(nodeId, update);
}
