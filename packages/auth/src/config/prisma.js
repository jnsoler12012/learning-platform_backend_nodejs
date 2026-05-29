import './env.js';
import { PrismaClient } from '@prisma/client';

// Singleton Prisma client instance for database access
export const prisma = new PrismaClient();
