import { UserNote } from '../models/UserNote.model.js';
import { UserNote as Entity } from '../../../domain/entities/UserNote.entity.js';

function toEntity(doc) {
  if (!doc) return null;
  return new Entity({
    id: doc._id.toString(),
    userId: doc.user_id,
    nodeId: doc.node_id,
    title: doc.title,
    markdownContent: doc.markdown_content,
    tags: doc.tags,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  });
}

export async function findByUserAndNode(userId, nodeId) {
  const doc = await UserNote.findOne({ user_id: userId, node_id: nodeId }).lean();
  return toEntity(doc);
}

export async function upsert(userId, nodeId, data) {
  const doc = await UserNote.findOneAndUpdate(
    { user_id: userId, node_id: nodeId },
    {
      $set: {
        title: data.title || '',
        markdown_content: data.markdownContent || '',
        tags: data.tags || [],
      },
    },
    { upsert: true, new: true },
  ).lean();
  return toEntity(doc);
}

export async function remove(userId, nodeId) {
  await UserNote.deleteOne({ user_id: userId, node_id: nodeId });
}
