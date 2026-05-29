import * as userRepo from '../../../infrastructure/persistence/repositories/user.repository.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Updates the user's profile information, throws if user not found
export async function updateProfile(userId, profileData) {
  const user = await userRepo.findById(userId);
  if (!user || user.isDeleted()) {
    throw new AppError('User not found', 404, ERROR_CODES.NOT_FOUND);
  }

  const profile = await userRepo.updateProfile(userId, {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    displayName: profileData.displayName,
    avatarUrl: profileData.avatarUrl,
    city: profileData.city,
    preferredLanguage: profileData.preferredLanguage,
  });

  return profile;
}
