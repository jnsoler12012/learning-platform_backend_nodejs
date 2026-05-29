import { config } from 'dotenv';
import { configureJwt } from '@platform/shared/security/jwt.service.js';
config();

// Loads and exports environment variables with defaults for the knowledge service
export const env = {
  PORT: parseInt(process.env.PORT, 10) || 8081,
  NEO4J_URI: process.env.NEO4J_URI || 'bolt://localhost:7687',
  NEO4J_USER: process.env.NEO4J_USER || 'neo4j',
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || '123456789',
  NEO4J_DB_NAME: process.env.NEO4J_DB_NAME || 'testtwo',
  JWT_SECRET: process.env.JWT_SECRET || 'testing',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Initializes the shared JWT service with configured secret and expiration
configureJwt(env.JWT_SECRET, env.JWT_EXPIRES_IN);
