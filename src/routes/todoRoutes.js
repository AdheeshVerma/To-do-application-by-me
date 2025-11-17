import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import TodoItem from '../models/TodoItem.js';

const router = express.Router();

// Get all todo items for the authenticated user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todos = await TodoItem.find({ user: userId }).populate(['category', 'tags']);
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// Get a single todo item by ID
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todo = await TodoItem.findOne({ _id: req.params.id, user: userId }).populate(['category', 'tags']);
    if (!todo) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// Create a new todo item
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, dueDate, category, tags, completed } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const newTodo = new TodoItem({
      title,
      description,
      dueDate,
      category,
      tags,
      completed: completed ?? false,
      user: userId,
    });
    const savedTodo = await newTodo.save();
    const populatedTodo = await savedTodo.populate(['category', 'tags']).execPopulate();
    res.status(201).json(populatedTodo);
  } catch (err) {
    next(err);
  }
});

// Update an existing todo item
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updateFields = req.body;
    const updatedTodo = await TodoItem.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate(['category', 'tags']);
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.json(updatedTodo);
  } catch (err) {
    next(err);
  }
});

// Delete a todo item
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const deleted = await TodoItem.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Todo item not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
