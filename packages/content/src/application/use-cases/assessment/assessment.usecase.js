import * as assessmentRepo from '../../../infrastructure/persistence/repositories/assessment.repository.js';
import * as questionRepo from '../../../infrastructure/persistence/repositories/question.repository.js';
import { connectDb } from '../../../infrastructure/persistence/mongoose.js';
import { AppError } from '@platform/shared/errors/AppError.js';
import { ERROR_CODES } from '@platform/shared/errors/errorCodes.js';

// Retrieves all assessments from the database
export async function listAssessments() {
  await connectDb();
  return assessmentRepo.findAll();
}

// Retrieves a single assessment by ID, including its questions
export async function getAssessment(id) {
  await connectDb();
  const assessment = await assessmentRepo.findById(id);
  if (!assessment) {
    throw new AppError('Assessment not found', 404, ERROR_CODES.NOT_FOUND);
  }
  const questions = await questionRepo.findByEvaluationId(id);
  return { ...assessment, questions };
}

// Creates a new assessment with the provided metadata
export async function createAssessment({ contextType, title, state, targetNodes, difficultyLevel, timeLimitMinutes, passingScore, maxAttempts }) {
  await connectDb();
  if (!contextType || !title) {
    throw new AppError('contextType and title are required', 400, ERROR_CODES.VALIDATION_ERROR);
  }
  return assessmentRepo.create({
    contextType,
    title,
    state: state || 'active',
    targetNodes: targetNodes || [],
    difficultyLevel: difficultyLevel || 1,
    timeLimitMinutes: timeLimitMinutes || 30,
    passingScore: passingScore || 70,
    maxAttempts: maxAttempts || 3,
  });
}

// Retrieves all questions belonging to a given evaluation (assessment)
export async function getQuestions(evaluationId) {
  await connectDb();
  return questionRepo.findByEvaluationId(evaluationId);
}

// Adds a new question to an existing assessment
export async function addQuestion({ evaluationId, state, relatedNodeId, bloomLevel, questionType, data }) {
  await connectDb();
  if (!evaluationId || !questionType) {
    throw new AppError('evaluationId and questionType are required', 400, ERROR_CODES.VALIDATION_ERROR);
  }
  return questionRepo.create({
    evaluationId,
    state: state || 'active',
    relatedNodeId: relatedNodeId || null,
    bloomLevel: bloomLevel || 'APPLY',
    questionType,
    data: data || {},
  });
}
