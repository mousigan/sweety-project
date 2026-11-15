// ============================================
// Custom API Error Class
// ============================================
// A custom error class that carries an HTTP status code.
// This allows us to throw errors with specific status codes
// and handle them in one central error handler.

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Marks this as an expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
