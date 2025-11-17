import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octodock';

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Database connected');
  } catch (error) {
    logger.error('Database connection error: ' + error.message);
    process.exit(1);
  }
};

export default connectDB;
