import TodoItem from '../models/TodoItem.js';
import logger from '../utils/logger.js';

/**
 * Create a new todo item.
 * Expected body: { title, description, dueDate, category, tags }
 */
export const createTodo = async (req, res, next) => {
  try {
    const { title, description, dueDate, category, tags } = req.body;
    const userId = req.user?.id;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const todo = await TodoItem.create({
      title,
      description,
      dueDate,
      category,
      tags,
      user: userId,
    });
    logger.info(`Todo created: ${todo.id}`);
    res.status(201).json(todo);
  } catch (err) {
    logger.error('Error creating todo', err);
    next(err);
  }
};

/** Retrieve all todos for the authenticated user */
export const getTodos = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const todos = await TodoItem.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (err) {
    logger.error('Error fetching todos', err);
    next(err);
  }
};

/** Retrieve a single todo by its ID */
export const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const todo = await TodoItem.findOne({ _id: id, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    logger.error('Error fetching todo by id', err);
    next(err);
  }
};

/** Update an existing todo */
export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updateFields = req.body;
    const updatedTodo = await TodoItem.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }
    logger.info(`Todo updated: ${updatedTodo.id}`);
    res.status(200).json(updatedTodo);
  } catch (err) {
    logger.error('Error updating todo', err);
    next(err);
  }
};

/** Delete a todo */
export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const deleted = await TodoItem.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Todo not found or not authorized' });
    }
    logger.info(`Todo deleted: ${deleted.id}`);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (err) {
    logger.error('Error deleting todo', err);
    next(err);
  }
};
