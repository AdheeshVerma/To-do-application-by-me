import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  // Log the full error stack for debugging purposes
  logger.error(err.stack || err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Ensure that the response is sent only once
  if (!res.headersSent) {
    res.status(status).json({ error: message });
  } else {
    // If headers are already sent, delegate to the default Express error handler
    next(err);
  }
};

export default errorHandler;
