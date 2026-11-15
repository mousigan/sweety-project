// ============================================
// Validation Error Handler Middleware
// ============================================
// Checks for validation errors from express-validator
// and returns them as a formatted JSON response.

import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Return the first validation error message
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: firstError.msg,
    });
  }

  next();
};

export default validate;
