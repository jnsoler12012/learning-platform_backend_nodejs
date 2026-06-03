export class ContentNode {
  constructor({ id, nodeId, estimatedDurationMinutes, version, versionStatus, searchText, blocks, createdAt, updatedAt }) {
    this.id = id;
    this.nodeId = nodeId;
    this.estimatedDurationMinutes = estimatedDurationMinutes;
    this.version = version;
    this.versionStatus = versionStatus;
    this.searchText = searchText;
    this.blocks = blocks || [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
