// Learning path domain entity
export class LearningPath {
  constructor({ id, code, title, description, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  // Checks if the learning path has been soft-deleted
  isDeleted() {
    return !!this.deletedAt;
  }
}
