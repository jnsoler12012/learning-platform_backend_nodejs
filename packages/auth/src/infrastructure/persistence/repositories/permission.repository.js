import { prisma } from '../../../config/prisma.js';
import { Permission } from '../../../domain/entities/Permission.entity.js';

// Maps raw database row to Permission domain entity
function toEntity(data) {
  if (!data) return null;
  return new Permission({
    id: data.id,
    slug: data.slug,
    description: data.description,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  });
}

// Finds a permission by its unique slug
export async function findBySlug(slug) {
  const data = await prisma.permission.findUnique({ where: { slug } });
  return toEntity(data);
}

// Assigns a permission to a role via the join table
export async function assignToRole(roleId, permissionId) {
  const data = await prisma.rolePermission.create({
    data: { roleId, permissionId },
  });
  return data;
}
