import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
/**
 * Generates a JWT for a given user payload.
 * @param {Object} user - User object containing at least an `id` field.
 * @param {string} [expiresIn='1h'] - Expiration time string accepted by jsonwebtoken.
 * @returns {string} Signed JWT token.
 */
export function generateToken(user, expiresIn = '1h') {
  if (!user || !user.id) {
    throw new Error('User payload must contain an id');
  }
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
/**
 * Verifies a JWT and returns its decoded payload.
 * @param {string} token - JWT token to verify.
 * @returns {Object} Decoded token payload.
 * @throws Will throw an error if token is invalid or expired.
 */
export function verifyToken(token) {
  if (!token) {
    throw new Error('Token must be provided');
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // Normalize error messages for the rest of the app
    throw new Error('Invalid or expired token');
  }
}
