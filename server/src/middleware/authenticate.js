// ============================================
// Authentication Middleware
// ============================================
// Verifies the JWT token from cookies or Authorization header.
// Attaches the authenticated user's ID to the request object.

import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';

const authenticate = (req, res, next) => {
  try {
    // Try to get token from HTTP-only cookie first, then Authorization header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new ApiError(401, 'Authentication required. Please log in.');
    }

    // Verify the token and extract the payload
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Attach user info to the request — this is the ONLY source of user identity
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Session expired. Please log in again.'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid token. Please log in again.'));
    }
    next(error);
  }
};

export default authenticate;
