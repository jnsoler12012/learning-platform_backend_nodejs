import { config } from 'dotenv';
import { configureJwt } from '@platform/shared/security/jwt.service.js';
config();

export const env = {
  PORT: parseInt(process.env.PORT, 10) || 3003,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/learning_content',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
  STORAGE_BACKEND: process.env.STORAGE_BACKEND || 'local',
  STORAGE_PATH: process.env.STORAGE_PATH || './uploads',
  UPLOAD_BASE_URL: process.env.UPLOAD_BASE_URL || '',
};

configureJwt(env.JWT_SECRET, env.JWT_EXPIRES_IN);
