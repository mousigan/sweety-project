// ============================================
// Authentication Controller
// ============================================
// Handles HTTP requests for registration, login, logout, and profile.
// Delegates business logic to the auth service.

import * as authService from '../services/auth.service.js';
import config from '../config/index.js';

// Cookie options for JWT
const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

/**
 * POST /api/auth/register
 * Register a new user.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Log in an existing user.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    // Set token in HTTP-only cookie
    res.cookie('token', token, getCookieOptions());

    res.json({
      success: true,
      message: 'Login successful.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Clear the authentication cookie.
 */
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * GET /api/auth/me
 * Get the authenticated user's profile.
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.userId);

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
