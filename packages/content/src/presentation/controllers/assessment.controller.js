import { listAssessments, getAssessment, createAssessment, getQuestions, addQuestion } from '../../application/use-cases/assessment/assessment.usecase.js';

// GET /content/assessments — returns all assessments
export async function list(req, res, next) {
  try {
    const result = await listAssessments();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /content/assessments/:id — returns a single assessment with its questions
export async function getById(req, res, next) {
  try {
    const result = await getAssessment(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /content/assessments — creates a new assessment
export async function create(req, res, next) {
  try {
    const result = await createAssessment(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /content/assessments/:id/questions — returns all questions for an assessment
export async function listQuestions(req, res, next) {
  try {
    const result = await getQuestions(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /content/assessments/:id/questions — adds a new question to an assessment
export async function addQuestionToAssessment(req, res, next) {
  try {
    const result = await addQuestion({
      evaluationId: req.params.id,
      ...req.body,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
