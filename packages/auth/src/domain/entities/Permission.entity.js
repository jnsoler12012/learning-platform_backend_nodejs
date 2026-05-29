// Permission domain entity representing an action that can be authorized
export class Permission {
  constructor({ id, slug, description, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.slug = slug;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
