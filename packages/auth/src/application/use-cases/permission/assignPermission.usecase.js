import * as roleRepo from '../../../infrastructure/persistence/repositories/role.repository.js';
import * as permissionRepo from '../../../infrastructure/persistence/repositories/permission.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Assigns a permission to a role, checking for duplicates and validating the role exists
export async function assignPermission({ roleId, permissionId }) {
  const role = await roleRepo.findById(roleId);
  if (!role || role.isDeleted()) {
    throw new AppError('Role not found', 404, ERROR_CODES.NOT_FOUND);
  }

  const permission = await permissionRepo.findBySlug(permissionId);
  const permId = permission ? permission.id : permissionId;

  const rolePermissions = await roleRepo.findPermissionsByRoleIds([roleId]);
  const alreadyAssigned = rolePermissions.some((p) => p.id === permId);
  if (alreadyAssigned) {
    throw new AppError('Permission already assigned to this role', 409, ERROR_CODES.CONFLICT);
  }

  await permissionRepo.assignToRole(roleId, permId);
  return { message: 'Permission assigned successfully' };
}
