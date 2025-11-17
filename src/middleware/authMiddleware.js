import { verifyToken } from '../utils/jwtUtils.js';
import logger from '../utils/logger.js';
import User from '../models/User.js';

/**
 * Authentication middleware that validates JWT access tokens.
 * If the token is valid, the corresponding user record is attached to the
 * request object as `req.user`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function authMiddleware (req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    // verifyToken should throw if token is invalid/expired
    const payload = verifyToken(token);

    // Expect payload to contain a user identifier (e.g., id)
    if (!payload || !payload.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    logger.error('Authentication error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Role‑based authorization helper. Accepts a list of permitted roles and
 * returns an Express middleware that ensures the authenticated user has one
 * of the allowed roles.
 *
 * @param {...string} allowedRoles
 * @returns {import('express').RequestHandler}
 */
export function authorizeRoles (...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    }
    next();
  };
}
