import { enrollUser } from '../../application/use-cases/learning-path/enrollUser.usecase.js';
import { updateProgress } from '../../application/use-cases/learning-path/updateProgress.usecase.js';
import { getUserPaths } from '../../application/use-cases/learning-path/getUserPaths.usecase.js';
import { listAllLearningPaths } from '../../application/use-cases/learning-path/listAllLearningPaths.usecase.js';
import { createLearningPath } from '../../application/use-cases/learning-path/createLearningPath.usecase.js';
import { updateLearningPath } from '../../application/use-cases/learning-path/updateLearningPath.usecase.js';
import { deleteLearningPath } from '../../application/use-cases/learning-path/deleteLearningPath.usecase.js';
import { toggleEnrollmentActive } from '../../application/use-cases/learning-path/toggleEnrollmentActive.usecase.js';
import { setEnrollmentActive } from '../../application/use-cases/learning-path/setEnrollmentActive.usecase.js';

// GET /learning-paths - lists all learning paths
export async function listAll(req, res, next) {
  try {
    const result = await listAllLearningPaths();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /learning-paths - creates a new learning path
export async function create(req, res, next) {
  try {
    const result = await createLearningPath({
      code: req.body.code,
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// PATCH /learning-paths/:id - updates a learning path
export async function update(req, res, next) {
  try {
    const result = await updateLearningPath(req.params.id, {
      code: req.body.code,
      title: req.body.title,
      description: req.body.description,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /learning-paths/:id - soft-deletes a learning path
export async function remove(req, res, next) {
  try {
    const result = await deleteLearningPath(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /learning-paths/enroll - enrolls the authenticated user in a learning path
export async function enroll(req, res, next) {
  try {
    const result = await enrollUser({
      userId: req.user.userId,
      learningPathId: req.body.learningPathId,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// PATCH /learning-paths/progress - updates the authenticated user's progress on a learning path
export async function progress(req, res, next) {
  try {
    const result = await updateProgress({
      userId: req.user.userId,
      learningPathId: req.body.learningPathId,
      progressPercent: req.body.progressPercent,
      status: req.body.status,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /learning-paths/me - lists the authenticated user's enrolled paths
export async function listMyPaths(req, res, next) {
  try {
    const result = await getUserPaths(req.user.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// PATCH /learning-paths/enrollment - toggles enrollment active status
export async function setActive(req, res, next) {
  try {
    const result = await toggleEnrollmentActive({
      userId: req.user.userId,
      learningPathId: req.body.learningPathId,
      isActive: req.body.isActive,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// PUT /learning-paths/enrollment - sets enrollment active status (creates if not exists)
export async function setEnrollment(req, res, next) {
  try {
    const result = await setEnrollmentActive({
      userId: req.user.userId,
      learningPathId: req.body.learningPathId,
      isActive: req.body.isActive,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
