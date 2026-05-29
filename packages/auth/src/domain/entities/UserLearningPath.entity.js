// User-learning-path enrollment domain entity
export class UserLearningPath {
  constructor({ userId, learningPathId, isActive, startedAt, progressPercent, completedAt, status }) {
    this.userId = userId;
    this.learningPathId = learningPathId;
    this.isActive = isActive ?? true;
    this.startedAt = startedAt;
    this.progressPercent = progressPercent !== null && progressPercent !== undefined
      ? Number(progressPercent)
      : null;
    this.completedAt = completedAt;
    this.status = status;
  }

  // Checks if the learning path has been completed
  isCompleted() {
    return !!this.completedAt;
  }
}
