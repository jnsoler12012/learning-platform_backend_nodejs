export class UserNote {
  constructor({ id, userId, nodeId, title, markdownContent, tags, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.nodeId = nodeId;
    this.title = title;
    this.markdownContent = markdownContent;
    this.tags = tags || [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
