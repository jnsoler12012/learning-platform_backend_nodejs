import { config } from 'dotenv';
import { configureJwt } from '@platform/shared/security/jwt.service.js';
config();

// Loads and exports environment variables with defaults
export const env = {
  PORT: parseInt(process.env.PORT, 10) || 8080,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'testing',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Initializes the shared JWT service with configured secret and expiration
configureJwt(env.JWT_SECRET, env.JWT_EXPIRES_IN);
