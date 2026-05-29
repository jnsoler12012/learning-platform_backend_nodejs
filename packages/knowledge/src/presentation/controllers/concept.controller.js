import { listConcepts } from '../../application/use-cases/concept/listConcepts.usecase.js';
import { getConcept } from '../../application/use-cases/concept/getConcept.usecase.js';
import { getPrerequisites, getDependents, getRelated } from '../../application/use-cases/concept/getRelationships.usecase.js';
import { createConcept } from '../../application/use-cases/concept/createConcept.usecase.js';
import { updateConcept } from '../../application/use-cases/concept/updateConcept.usecase.js';
import { deleteConcept } from '../../application/use-cases/concept/deleteConcept.usecase.js';
import { getFullGraph } from '../../application/use-cases/graph/getGraph.usecase.js';
import { getGraphByTrack } from '../../application/use-cases/graph/getGraphByTrack.usecase.js';
import { getConceptPath } from '../../application/use-cases/graph/getConceptPath.usecase.js';

// GET /concepts - lists all concepts, with optional track/subtrack query params
export async function listAll(req, res, next) {
  try {
    const result = await listConcepts({
      track: req.query.track,
      subtrack: req.query.subtrack,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /concepts/:id - retrieves a concept with its relationships expanded
export async function getById(req, res, next) {
  try {
    const result = await getConcept(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /concepts/:id/prerequisites - lists all prerequisites of a concept
export async function getPrereqs(req, res, next) {
  try {
    const result = await getPrerequisites(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /concepts/:id/dependents - lists all dependents of a concept
export async function getDeps(req, res, next) {
  try {
    const result = await getDependents(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /concepts/:id/related - lists all related concepts
export async function getRels(req, res, next) {
  try {
    const result = await getRelated(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /concepts - creates a new concept node
export async function create(req, res, next) {
  try {
    const result = await createConcept({
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      subtrack: req.body.subtrack,
      track: req.body.track,
      difficulty: req.body.difficulty,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// PATCH /concepts/:id - updates an existing concept's fields
export async function update(req, res, next) {
  try {
    const result = await updateConcept(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /concepts/:id - permanently deletes a concept
export async function remove(req, res, next) {
  try {
    const result = await deleteConcept(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /concepts/graph - returns the full knowledge graph with all nodes and edges
export async function showGraph(req, res, next) {
  try {
    const result = await getFullGraph();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /concepts/graph/track/:track - returns the knowledge graph filtered by track
export async function showGraphByTrack(req, res, next) {
  try {
    const result = await getGraphByTrack(req.params.track);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// GET /concepts/graph/path/:from/:to - finds the shortest REQUIRES_TO path between two concepts
export async function showConceptPath(req, res, next) {
  try {
    const result = await getConceptPath(req.params.from, req.params.to);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
