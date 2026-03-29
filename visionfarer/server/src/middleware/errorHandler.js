const { AppError } = require('../utils/customErrors');

const errorHandler = (err, req, res, next) => {
  // Console logging in dev, maybe minimal in prod
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(`[ERROR] ${err.name}: ${err.message}`);
  }

  // Handle derived application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  }

  // Handle Mongoose / DB specific errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Resource not found',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  }

  // Default to 500 for unhandled errors
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  res.status(statusCode).json({
    message,
    // NEVER leak stack trace in production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
