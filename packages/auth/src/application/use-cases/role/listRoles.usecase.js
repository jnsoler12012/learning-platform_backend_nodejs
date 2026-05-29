import * as roleRepo from '../../../infrastructure/persistence/repositories/role.repository.js';

// Lists all roles with their associated permissions
export async function listRoles() {
  const roles = await roleRepo.findAll();
  const roleIds = roles.map((r) => r.id);

  if (roleIds.length === 0) return [];

  const rpRows = await roleRepo.findRolePermissionsByRoleIds(roleIds);

  return roles.map((role) => {
    const perms = rpRows
      .filter((rp) => rp.roleId === role.id)
      .map((rp) => ({
        id: rp.permission.id,
        slug: rp.permission.slug,
        description: rp.permission.description,
      }));
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: perms,
    };
  });
}
