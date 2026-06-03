import { getUserNote } from '../../application/use-cases/notes/getUserNote.usecase.js';
import { upsertNote } from '../../application/use-cases/notes/upsertNote.usecase.js';
import { deleteNote } from '../../application/use-cases/notes/deleteNote.usecase.js';

// GET /content/notes/:nodeId — returns the authenticated user's note for a node
export async function get(req, res, next) {
  try {
    const result = await getUserNote(req.user.userId, req.params.nodeId);
    if (!result) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found for this user and node' } });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// PUT /content/notes/:nodeId — creates or updates the authenticated user's note for a node
export async function upsert(req, res, next) {
  try {
    const result = await upsertNote({
      userId: req.user.userId,
      nodeId: req.params.nodeId,
      title: req.body.title,
      markdownContent: req.body.markdownContent,
      tags: req.body.tags,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /content/notes/:nodeId — deletes the authenticated user's note for a node
export async function remove(req, res, next) {
  try {
    const result = await deleteNote(req.user.userId, req.params.nodeId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
