import multer from 'multer';

const ALLOWED_MIMES = [
  'image/png', 'image/jpeg', 'image/gif',
  'image/webp', 'image/svg+xml',
];

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
  }
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('file');
