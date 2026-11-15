// ============================================
// Centralized Error-Handling Middleware
// ============================================
// This middleware catches all errors thrown in routes or other middleware.
// It formats a consistent JSON error response.

const errorHandler = (err, req, res, next) => {
  // Default to 500 (Internal Server Error) if no status code is set
  const statusCode = err.statusCode || 500;

  // In development, show the full error stack; in production, hide it
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV === 'development' && !err.isOperational) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development for unexpected errors
    ...(process.env.NODE_ENV === 'development' &&
      !err.isOperational && { stack: err.stack }),
  });
};

export default errorHandler;
