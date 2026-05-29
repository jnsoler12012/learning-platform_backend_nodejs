import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

// Hashes a plain-text password using bcrypt
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Compares a plain-text password against a bcrypt hash
export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
