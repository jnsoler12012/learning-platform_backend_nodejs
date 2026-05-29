import { prisma } from '../../../config/prisma.js';
import { Role } from '../../../domain/entities/Role.entity.js';

// Maps raw database row to Role domain entity
function toEntity(data) {
  if (!data) return null;
  return new Role({
    id: data.id,
    name: data.name,
    description: data.description,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  });
}

// Finds a role by its unique name
export async function findByName(name) {
  const data = await prisma.role.findUnique({ where: { name } });
  return toEntity(data);
}

// Finds a role by its id
export async function findById(id) {
  const data = await prisma.role.findUnique({ where: { id } });
  return toEntity(data);
}

// Returns all non-deleted roles
export async function findAll() {
  const data = await prisma.role.findMany({ where: { deletedAt: null } });
  return data.map(toEntity);
}

// Creates a new role record
export async function create(roleData) {
  const data = await prisma.role.create({
    data: { name: roleData.name, description: roleData.description },
  });
  return toEntity(data);
}

// Assigns a role to a user via the user-role join table
export async function assignToUser(userId, roleId) {
  const data = await prisma.userRole.create({
    data: { userId, roleId },
  });
  return data;
}

// Retrieves all roles assigned to a specific user
export async function findRolesByUserId(userId) {
  const data = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return data.map((ur) => toEntity(ur.role)).filter(Boolean);
}

// Retrieves all permissions associated with a set of role ids
export async function findPermissionsByRoleIds(roleIds) {
  const data = await prisma.rolePermission.findMany({
    where: { roleId: { in: roleIds } },
    include: { permission: true },
  });
  return data.map((rp) => rp.permission);
}

// Retrieves raw role-permission join rows with permission data for a set of role ids
export async function findRolePermissionsByRoleIds(roleIds) {
  const data = await prisma.rolePermission.findMany({
    where: { roleId: { in: roleIds } },
    include: { permission: true },
  });
  return data;
}
