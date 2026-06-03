import { uploadMiddleware } from '@platform/shared/storage/upload.middleware.js';
import { saveFile } from '@platform/shared/storage/upload.service.js';

// POST /content/upload — accepts a multipart file, saves it, and returns file metadata
export function handleUpload(req, res, next) {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: { code: 'UPLOAD_ERROR', message: err.message },
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'No file provided' },
      });
    }

    try {
      const result = await saveFile({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        service: 'content',
      });

      res.status(200).json(result);
    } catch (saveErr) {
      next(saveErr);
    }
  });
}
