import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import './database/database.js'; // assumes this module establishes DB connection on import
import rateLimit from './middleware/rateLimit.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express();

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit);

// Simple request logger using the custom logger utility
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Public routes
app.use('/api/users', userRoutes);

// Protected routes – apply auth middleware
app.use('/api/todos', authMiddleware, todoRoutes);
app.use('/api/tags', authMiddleware, tagRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling – must be after all route definitions
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
