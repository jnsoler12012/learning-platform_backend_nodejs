import jwt from 'jsonwebtoken';

let JWT_SECRET;
let JWT_EXPIRES_IN;

// Initializes JWT configuration with secret and expiration from env
export function configureJwt(secret, expiresIn) {
  JWT_SECRET = secret;
  JWT_EXPIRES_IN = expiresIn;
}

// Creates a signed JWT token with the given payload
export function signToken(payload) {
  if (!JWT_SECRET) throw new Error('JWT not configured');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verifies and decodes a JWT token, throwing on invalid/expired tokens
export function verifyToken(token) {
  if (!JWT_SECRET) throw new Error('JWT not configured');
  return jwt.verify(token, JWT_SECRET);
}
