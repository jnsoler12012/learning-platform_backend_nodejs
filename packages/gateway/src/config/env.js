import { config } from 'dotenv';
config();

// Gateway configuration with defaults for local development
export const env = {
  PORT: parseInt(process.env.PORT, 10) || 8084,
  JWT_SECRET: process.env.JWT_SECRET || 'testing',
  AUTH_URL: process.env.AUTH_URL || 'http://localhost:8080/api/v1',
  KNOWLEDGE_URL: process.env.KNOWLEDGE_URL || 'http://localhost:8081/api/v1',
  CONTENT_URL: process.env.CONTENT_URL || 'http://localhost:8082/api/v1',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
