export class Question {
  constructor({ id, evaluationId, state, relatedNodeId, bloomLevel, questionType, data, createdAt, updatedAt }) {
    this.id = id;
    this.evaluationId = evaluationId;
    this.state = state;
    this.relatedNodeId = relatedNodeId;
    this.bloomLevel = bloomLevel;
    this.questionType = questionType;
    this.data = data;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
