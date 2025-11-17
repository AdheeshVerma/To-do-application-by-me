import Category from '../models/Category.js';
import logger from '../utils/logger.js';

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    logger.error('Failed to fetch categories:', error);
    next(error);
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      throw err;
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    logger.error('Failed to fetch category:', error);
    next(error);
  }
};

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      const err = new Error('Category name is required');
      err.status = 400;
      throw err;
    }
    const newCategory = await Category.create({ name, description });
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    logger.error('Failed to create category:', error);
    next(error);
  }
};

// Update an existing category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedCategory) {
      const err = new Error('Category not found');
      err.status = 404;
      throw err;
    }
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    logger.error('Failed to update category:', error);
    next(error);
  }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      const err = new Error('Category not found');
      err.status = 404;
      throw err;
    }
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    logger.error('Failed to delete category:', error);
    next(error);
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};