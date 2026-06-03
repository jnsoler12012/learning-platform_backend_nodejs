export class Assessment {
  constructor({ id, contextType, title, state, targetNodes, difficultyLevel, timeLimitMinutes, passingScore, maxAttempts, createdAt, updatedAt }) {
    this.id = id;
    this.contextType = contextType;
    this.title = title;
    this.state = state;
    this.targetNodes = targetNodes || [];
    this.difficultyLevel = difficultyLevel;
    this.timeLimitMinutes = timeLimitMinutes;
    this.passingScore = passingScore;
    this.maxAttempts = maxAttempts;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
