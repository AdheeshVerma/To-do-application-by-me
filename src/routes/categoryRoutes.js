import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Category from '../models/Category.js';

const router = express.Router();

// GET /categories - Retrieve all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

// GET /categories/:id - Retrieve a single category by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

// POST /categories - Create a new category (protected)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const newCategory = new Category({ name, description });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
});

// PUT /categories/:id - Update an existing category (protected)
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// DELETE /categories/:id - Delete a category (protected)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

export default router;
