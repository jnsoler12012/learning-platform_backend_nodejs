import { writeFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { storageConfig } from './storage.config.js';

// Simple implementation for uploading files on local or in cloud
function extFromMime(mimetype) {
  const map = {
    'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif',
    'image/webp': '.webp', 'image/svg+xml': '.svg',
  };
  return map[mimetype] || '.bin';
}

async function saveToDisk({ buffer, originalname, mimetype, size, service }) {
  const ext = extname(originalname) || extFromMime(mimetype);
  const filename = `${randomUUID()}${ext}`;
  const relativeDir = join(service || 'misc');
  const fullDir = join(storageConfig.STORAGE_PATH, relativeDir);

  await mkdir(fullDir, { recursive: true });
  await writeFile(join(fullDir, filename), buffer);

  const relativePath = `/uploads/${relativeDir}/${filename}`;
  const url = storageConfig.UPLOAD_BASE_URL
    ? `${storageConfig.UPLOAD_BASE_URL}${relativePath}`
    : relativePath;

  return { url, file_size: size, mime_type: mimetype, filename };
}

// TO-DO modify current save format files to mirror cloud configuration
export async function saveFile({ buffer, originalname, mimetype, size, service }) {
  if (storageConfig.STORAGE_BACKEND === 's3') {
    const { saveToS3 } = await import('./s3.service.js');
    return saveToS3({ buffer, originalname, mimetype, size, service });
  }

  return saveToDisk({ buffer, originalname, mimetype, size, service });
}
