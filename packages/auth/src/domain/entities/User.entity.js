// User domain entity representing a registered user account
export class User {
  constructor({ id, email, passwordHash, isActive, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.isActive = isActive ?? true;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  // Checks if the user has been soft-deleted
  isDeleted() {
    return !!this.deletedAt;
  }
}
