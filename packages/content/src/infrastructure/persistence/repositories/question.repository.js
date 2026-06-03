import { Question } from '../models/Question.model.js';
import { Question as Entity } from '../../../domain/entities/Question.entity.js';

function toEntity(doc) {
  if (!doc) return null;
  return new Entity({
    id: doc._id.toString(),
    evaluationId: doc.evaluation_id,
    state: doc.state,
    relatedNodeId: doc.related_node_id,
    bloomLevel: doc.bloom_level,
    questionType: doc.question_type,
    data: doc.data,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  });
}

export async function findByEvaluationId(evaluationId) {
  const docs = await Question.find({ evaluation_id: evaluationId }).sort({ created_at: 1 }).lean();
  return docs.map(toEntity);
}

export async function create(data) {
  const doc = await Question.create({
    evaluation_id: data.evaluationId,
    state: data.state || 'active',
    related_node_id: data.relatedNodeId || null,
    bloom_level: data.bloomLevel || 'APPLY',
    question_type: data.questionType,
    data: data.data || {},
  });
  return toEntity(doc.toObject());
}
