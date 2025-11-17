import Tag from '../models/Tag.js';
import logger from '../utils/logger.js';

/**
 * Get all tags
 */
export const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    logger.error('Failed to fetch tags:', error);
    next(error);
  }
};

/**
 * Get a single tag by its ID
 */
export const getTagById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    logger.error(`Failed to fetch tag ${id}:`, error);
    next(error);
  }
};

/**
 * Create a new tag
 */
export const createTag = async (req, res, next) => {
  const { name, color } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Tag name is required' });
  }
  try {
    const newTag = await Tag.create({ name, color });
    res.status(201).json({ success: true, data: newTag });
  } catch (error) {
    logger.error('Failed to create tag:', error);
    next(error);
  }
};

/**
 * Update an existing tag
 */
export const updateTag = async (req, res, next) => {
  const { id } = req.params;
  const { name, color } = req.body;
  try {
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }
    // Only update provided fields
    if (name !== undefined) tag.name = name;
    if (color !== undefined) tag.color = color;
    await tag.save();
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    logger.error(`Failed to update tag ${id}:`, error);
    next(error);
  }
};

/**
 * Delete a tag by its ID
 */
export const deleteTag = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }
    await tag.destroy();
    res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete tag ${id}:`, error);
    next(error);
  }
};
