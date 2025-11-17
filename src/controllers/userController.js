import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtUtils.js';
import logger from '../utils/logger.js';

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      const err = new Error('Username, email and password are required');
      err.status = 400;
      throw err;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error('User with this email already exists');
      err.status = 409;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);
    const userData = user.toObject();
    delete userData.password;

    logger.info(`User registered: ${user.id}`);
    res.status(201).json({ success: true, data: userData, token });
  } catch (error) {
    logger.error('Error in register controller:', error);
    next(error);
  }
};

// Login existing user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.status = 400;
      throw err;
    }

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    const token = generateToken(user);
    const userData = user.toObject();
    delete userData.password;

    logger.info(`User logged in: ${user.id}`);
    res.status(200).json({ success: true, data: userData, token });
  } catch (error) {
    logger.error('Error in login controller:', error);
    next(error);
  }
};

// Get current authenticated user's profile
export const getProfile = async (req, res, next) => {
  try {
    // Assuming auth middleware adds userId to req.user
    const userId = req.user?.id;
    if (!userId) {
      const err = new Error('User not authenticated');
      err.status = 401;
      throw err;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error('Error in getProfile controller:', error);
    next(error);
  }
};

// Update current user's profile
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      const err = new Error('User not authenticated');
      err.status = 401;
      throw err;
    }

    const { username, email, password } = req.body;
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updatedUser) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    logger.info(`User profile updated: ${userId}`);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    logger.error('Error in updateProfile controller:', error);
    next(error);
  }
};

// Delete current user
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      const err = new Error('User not authenticated');
      err.status = 401;
      throw err;
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    logger.info(`User deleted: ${userId}`);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error in deleteUser controller:', error);
    next(error);
  }
};
