import { Assessment } from '../models/Assessment.model.js';
import { Assessment as Entity } from '../../../domain/entities/Assessment.entity.js';

function toEntity(doc) {
  if (!doc) return null;
  return new Entity({
    id: doc._id.toString(),
    contextType: doc.context_type,
    title: doc.title,
    state: doc.state,
    targetNodes: doc.target_nodes,
    difficultyLevel: doc.difficulty_level,
    timeLimitMinutes: doc.time_limit_minutes,
    passingScore: doc.passing_score,
    maxAttempts: doc.max_attempts,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  });
}

export async function findAll() {
  const docs = await Assessment.find().sort({ created_at: -1 }).lean();
  return docs.map(toEntity);
}

export async function findById(id) {
  const doc = await Assessment.findById(id).lean();
  return toEntity(doc);
}

export async function create(data) {
  const doc = await Assessment.create({
    context_type: data.contextType,
    title: data.title,
    state: data.state || 'active',
    target_nodes: data.targetNodes || [],
    difficulty_level: data.difficultyLevel || 1,
    time_limit_minutes: data.timeLimitMinutes || 30,
    passing_score: data.passingScore || 70,
    max_attempts: data.maxAttempts || 3,
  });
  return toEntity(doc.toObject());
}
