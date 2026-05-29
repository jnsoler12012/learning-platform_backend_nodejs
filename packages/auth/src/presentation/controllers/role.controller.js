import { createRole } from '../../application/use-cases/role/createRole.usecase.js';
import { assignRole } from '../../application/use-cases/role/assignRole.usecase.js';
import { listRoles } from '../../application/use-cases/role/listRoles.usecase.js';
import { assignPermission } from '../../application/use-cases/permission/assignPermission.usecase.js';

// POST /roles - creates a new role
export async function create(req, res, next) {
  try {
    const role = await createRole({ name: req.body.name, description: req.body.description });
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
}

// GET /roles - lists all roles with permissions
export async function list(req, res, next) {
  try {
    const roles = await listRoles();
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
}

// POST /roles/assign - assigns a role to a user
export async function assign(req, res, next) {
  try {
    const result = await assignRole({ userId: req.body.userId, roleId: req.body.roleId });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /roles/permissions - assigns a permission to a role
export async function assignPerm(req, res, next) {
  try {
    const result = await assignPermission({ roleId: req.body.roleId, permissionId: req.body.permissionId });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
