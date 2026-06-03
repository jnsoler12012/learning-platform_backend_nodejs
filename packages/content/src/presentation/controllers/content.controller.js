import { getNodeContent } from '../../application/use-cases/content/getNodeContent.usecase.js';
import { createNodeContent } from '../../application/use-cases/content/createNodeContent.usecase.js';
import { updateNodeContent } from '../../application/use-cases/content/updateNodeContent.usecase.js';
import { deleteNodeContent } from '../../application/use-cases/content/deleteNodeContent.usecase.js';

// GET /content/nodes/:nodeId — retrieves content blocks for a knowledge node
export async function getByNodeId(req, res, next) {
  try {
    const result = await getNodeContent(req.params.nodeId);
    if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Content not found for this node' } });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// POST /content/nodes — creates new content for a knowledge node
export async function create(req, res, next) {
  try {
    const result = await createNodeContent(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// PATCH /content/nodes/:nodeId — partially updates existing node content
export async function update(req, res, next) {
  try {
    const result = await updateNodeContent(req.params.nodeId, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /content/nodes/:nodeId — removes content for a knowledge node
export async function remove(req, res, next) {
  try {
    const result = await deleteNodeContent(req.params.nodeId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
