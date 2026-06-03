import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { storageConfig } from './storage.config.js';

// basic boilerplate for saving files in AWS S3 service
// TO-DO: implement according to S3 configurations
let client;

function getClient() {
  if (!client) {
    client = new S3Client({ region: storageConfig.S3_REGION });
  }
  return client;
}

export async function saveToS3({ buffer, originalname, mimetype, size, service }) {
  const ext = extname(originalname);
  const filename = `${randomUUID()}${ext}`;
  const key = `${service || 'misc'}/${filename}`;

  await getClient().send(new PutObjectCommand({
    Bucket: storageConfig.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  }));

  const base = storageConfig.UPLOAD_BASE_URL || `https://${storageConfig.S3_BUCKET}.s3.${storageConfig.S3_REGION}.amazonaws.com`;
  const url = `${base}/${key}`;

  return { url, file_size: size, mime_type: mimetype, filename };
}
