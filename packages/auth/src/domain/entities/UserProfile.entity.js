// User profile domain entity containing optional personal information
export class UserProfile {
  constructor({ userId, firstName, lastName, displayName, avatarUrl, city, preferredLanguage, createdAt, updatedAt, deletedAt }) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayName = displayName;
    this.avatarUrl = avatarUrl;
    this.city = city;
    this.preferredLanguage = preferredLanguage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
