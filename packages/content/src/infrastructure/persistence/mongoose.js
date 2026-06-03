import mongoose from 'mongoose';
import { env } from '../../config/env.js';

// Mongoose connection database
let connected = false;

export async function connectDb() {
  if (connected) return;
  await mongoose.connect(env.MONGO_URI);
  connected = true;
}

export async function disconnectDb() {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
}

export function getConnection() {
  return mongoose.connection;
}
