// Role domain entity representing a user role with specific permissions
export class Role {
  constructor({ id, name, description, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  // Checks if the role has been soft-deleted
  isDeleted() {
    return !!this.deletedAt;
  }
}
