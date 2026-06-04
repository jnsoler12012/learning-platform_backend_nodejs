import { prisma } from '../../../config/prisma.js';
import { User } from '../../../domain/entities/User.entity.js';
import { UserProfile } from '../../../domain/entities/UserProfile.entity.js';

// Maps raw database row to User domain entity
function toUserEntity(data) {
  if (!data) return null;
  return new User({
    id: data.id,
    email: data.email,
    passwordHash: data.passwordHash,
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  });
}

// Maps raw database row to UserProfile domain entity
function toProfileEntity(data) {
  if (!data) return null;
  return new UserProfile({
    userId: data.userId,
    firstName: data.firstName,
    lastName: data.lastName,
    displayName: data.displayName,
    avatarUrl: data.avatarUrl,
    city: data.city,
    preferredLanguage: data.preferredLanguage,
  });
}

// Finds a user by their unique email
export async function findByEmail(email) {
  const data = await prisma.user.findUnique({ where: { email } });
  return toUserEntity(data);
}

// Finds a user by their id
export async function findById(id) {
  const data = await prisma.user.findUnique({ where: { id } });
  return toUserEntity(data);
}

// Finds a user with their profile and roles by id
export async function findByIdWithProfile(id) {
  const data = await prisma.user.findUnique({
    where: { id },
    include: { profile: true, userRoles: { include: { role: true } } },
  });
  if (!data) return null;
  return {
    user: toUserEntity(data),
    profile: toProfileEntity(data.profile),
    roles: data.userRoles.map((ur) => ur.role),
  };
}

// Creates a new user record
export async function create(userData) {
  const data = await prisma.user.create({
    data: {
      email: userData.email,
      passwordHash: userData.passwordHash,
      isActive: userData.isActive ?? true,
    },
  });
  return toUserEntity(data);
}

// Updates a user record by id with the given fields
export async function update(id, data) {
  const updated = await prisma.user.update({ where: { id }, data });
  return toUserEntity(updated);
}

// Soft-deletes a user by setting deletedAt and deactivating the account
export async function softDelete(id) {

  // delete user
  const deleted = await prisma.user.delete({
    where: { id },
  })

  console.log(deleted)

  // const updated = await prisma.user.update({
  //   where: { id },
  //   data: { deletedAt: new Date(), isActive: false },
  // });

  return toUserEntity(deleted);
}

// Creates a user profile record for a given user
export async function createProfile(userId, profileData) {
  const data = await prisma.userProfile.create({
    data: {
      userId,
      firstName: profileData.firstName || null,
      lastName: profileData.lastName || null,
      displayName: profileData.displayName || null,
      avatarUrl: profileData.avatarUrl || null,
      city: profileData.city || null,
      preferredLanguage: profileData.preferredLanguage || null,
    },
  });
  return toProfileEntity(data);
}

// Updates a user profile record by userId
export async function updateProfile(userId, profileData) {
  const data = await prisma.userProfile.update({
    where: { userId },
    data: {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      displayName: profileData.displayName,
      avatarUrl: profileData.avatarUrl,
      city: profileData.city,
      preferredLanguage: profileData.preferredLanguage,
    },
  });
  return toProfileEntity(data);
}
