'use strict';

import logger from '../utils/logger.js';

const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100;
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000;

const ipRecords = new Map();

const cleanup = () => {
  const now = Date.now();
  for (const [ip, record] of ipRecords) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      ipRecords.delete(ip);
    }
  }
};

// Run cleanup periodically to free memory
setInterval(cleanup, RATE_LIMIT_WINDOW_MS).unref();

const rateLimit = (req, res, next) => {
  try {
    const ip = req.ip || (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : undefined) || req.socket?.remoteAddress;
    if (!ip) {
      // If we cannot determine IP, allow request
      return next();
    }
    const now = Date.now();
    let record = ipRecords.get(ip);
    if (!record) {
      record = { count: 1, startTime: now };
      ipRecords.set(ip, record);
    } else {
      if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
        // Reset window
        record.count = 1;
        record.startTime = now;
      } else {
        record.count++;
      }
    }
    if (record.count > RATE_LIMIT_MAX) {
      logger.warn(`Rate limit exceeded for IP ${ip}`);
      res.status(429).json({ error: 'Too many requests, please try again later.' });
    } else {
      next();
    }
  } catch (err) {
    logger.error('Error in rateLimit middleware', err);
    next(err);
  }
};

export default rateLimit;
