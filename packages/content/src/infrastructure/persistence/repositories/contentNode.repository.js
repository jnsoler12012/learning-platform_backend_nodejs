import { ContentNode } from '../models/ContentNode.model.js';
import { ContentNode as Entity } from '../../../domain/entities/ContentNode.entity.js';

function toEntity(doc) {
  if (!doc) return null;
  return new Entity({
    id: doc._id.toString(),
    nodeId: doc.node_id,
    estimatedDurationMinutes: doc.estimated_duration_minutes,
    version: doc.version,
    versionStatus: doc.version_status,
    searchText: doc.search_text,
    blocks: doc.blocks,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  });
}

export async function findByNodeId(nodeId) {
  const doc = await ContentNode.findOne({ node_id: nodeId }).lean();
  return toEntity(doc);
}

export async function create(data) {
  const doc = await ContentNode.create({
    node_id: data.nodeId,
    estimated_duration_minutes: data.estimatedDurationMinutes,
    version: data.version || 1,
    version_status: data.versionStatus || 'PUBLISHED',
    search_text: data.searchText || '',
    blocks: data.blocks || [],
  });
  return toEntity(doc.toObject());
}

export async function updateByNodeId(nodeId, data) {
  const update = {};
  if (data.estimatedDurationMinutes !== undefined) update.estimated_duration_minutes = data.estimatedDurationMinutes;
  if (data.version !== undefined) update.version = data.version;
  if (data.versionStatus !== undefined) update.version_status = data.versionStatus;
  if (data.searchText !== undefined) update.search_text = data.searchText;
  if (data.blocks !== undefined) update.blocks = data.blocks;
  const doc = await ContentNode.findOneAndUpdate(
    { node_id: nodeId },
    { $set: update },
    { new: true },
  ).lean();
  return toEntity(doc);
}

export async function removeByNodeId(nodeId) {
  await ContentNode.deleteOne({ node_id: nodeId });
}
