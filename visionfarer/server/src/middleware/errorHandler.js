const { AppError } = require('../utils/customErrors');

const errorHandler = (err, req, res, next) => {
  // Console logging in dev, minimal in prod
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(`[ERROR] ${err.name}: ${err.message}`);
  }

  // Handle derived application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.name
      }
    });
  }

  // Handle Mongoose / DB specific errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message,
        code: 'ValidationError'
      }
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Resource not found',
        code: 'CastError'
      }
    });
  }

  // Default to 500 for unhandled errors
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: 'InternalError'
    }
  });
};

module.exports = errorHandler;
