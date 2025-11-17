import express from 'express';
import { createTag, getAllTags, getTagById, updateTag, deleteTag } from '../controllers/tagController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import rateLimit from '../middleware/rateLimit.js';

const router = express.Router();

// Apply rate limiting to all tag routes
router.use(rateLimit);

// Public routes
router.get('/', getAllTags);
router.get('/:id', getTagById);

// Protected routes
router.post('/', authMiddleware, createTag);
router.put('/:id', authMiddleware, updateTag);
router.delete('/:id', authMiddleware, deleteTag);

export default router;
