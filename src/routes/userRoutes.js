import express from 'express';
import { register, login, getProfile, updateProfile, deleteAccount } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

// Public routes
router.post('/register', rateLimit, async (req, res, next) => {
  try {
    await register(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/login', rateLimit, async (req, res, next) => {
  try {
    await login(req, res);
  } catch (err) {
    next(err);
  }
});

// Protected routes
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    await getProfile(req, res);
  } catch (err) {
    next(err);
  }
});

router.put('/me', authMiddleware, async (req, res, next) => {
  try {
    await updateProfile(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete('/me', authMiddleware, async (req, res, next) => {
  try {
    await deleteAccount(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
