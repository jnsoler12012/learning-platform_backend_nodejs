import { getProfile, getUserById } from '../../application/use-cases/user/getProfile.usecase.js';
import { updateProfile } from '../../application/use-cases/user/updateProfile.usecase.js';
import { deleteUser } from '../../application/use-cases/user/deleteUser.usecase.js';
import { updateAccount } from '../../application/use-cases/user/updateAccount.usecase.js';

// GET /users/me - retrieves the authenticated user's own profile
export async function getOwnProfile(req, res, next) {
  try {
    const result = await getProfile(req.user.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /users/:id - retrieves a specific user's profile by id
export async function getUserProfile(req, res, next) {
  try {
    const result = await getUserById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// PATCH /users/me - updates the authenticated user's profile
export async function updateOwnProfile(req, res, next) {
  try {
    const result = await updateProfile(req.user.userId, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// PATCH /users/me/account - updates the authenticated user's email/password
export async function updateOwnAccount(req, res, next) {
  try {
    const result = await updateAccount({
      userId: req.user.userId,
      currentPassword: req.body.currentPassword,
      newEmail: req.body.newEmail,
      newPassword: req.body.newPassword,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /users/me - soft-deletes the authenticated user's account
export async function deleteOwnAccount(req, res, next) {
  try {
    const result = await deleteUser(req.user.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
