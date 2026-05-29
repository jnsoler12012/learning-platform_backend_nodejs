import { prisma } from '../../../config/prisma.js';
import { LearningPath } from '../../../domain/entities/LearningPath.entity.js';

// Maps raw database row to LearningPath domain entity
function toEntity(data) {
  if (!data) return null;
  return new LearningPath({
    id: data.id,
    code: data.code,
    title: data.title,
    description: data.description,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  });
}

// Finds a learning path by its unique code
export async function findByCode(code) {
  const data = await prisma.learningPath.findUnique({ where: { code } });
  return toEntity(data);
}

// Finds a learning path by its id
export async function findById(id) {
  const data = await prisma.learningPath.findUnique({ where: { id } });
  return toEntity(data);
}

// Returns all non-deleted learning paths
export async function findAll() {
  const data = await prisma.learningPath.findMany({ where: { deletedAt: null } });
  return data.map(toEntity);
}

// Creates a new learning path record
export async function create(data) {
  const result = await prisma.learningPath.create({
    data: { code: data.code, title: data.title, description: data.description },
  });
  return toEntity(result);
}

// Updates an existing learning path by id
export async function update(id, data) {
  const result = await prisma.learningPath.update({
    where: { id },
    data: { code: data.code, title: data.title, description: data.description },
  });
  return toEntity(result);
}

// Soft-deletes a learning path by setting the deletedAt timestamp
export async function softDelete(id) {
  const result = await prisma.learningPath.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return toEntity(result);
}
