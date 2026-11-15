// ============================================
// Authentication Service
// ============================================
// Contains business logic for user registration and login.
// Keeps controllers thin and logic testable.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';

/**
 * Register a new user.
 * @param {string} name - Full name
 * @param {string} email - Email address
 * @param {string} password - Plain-text password
 * @returns {object} The created user (without password)
 */
export const registerUser = async (name, email, password) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  // Hash the password with bcrypt (10 salt rounds)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user in the database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * Authenticate a user and return a JWT.
 * @param {string} email - Email address
 * @param {string} password - Plain-text password
 * @returns {object} { user, token }
 */
export const loginUser = async (email, password) => {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Compare the provided password with the stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

/**
 * Get user profile by ID.
 * @param {number} userId
 * @returns {object} User data without password
 */
export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return user;
};

/**
 * Update user profile (name and/or password).
 * @param {number} userId
 * @param {object} data - { name, currentPassword, newPassword }
 * @returns {object} Updated user data without password
 */
export const updateUserProfile = async (userId, data) => {
  const { name, currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const updateData = {};

  if (name && name.trim()) {
    updateData.name = name.trim();
  }

  if (newPassword) {
    if (!currentPassword) {
      throw new ApiError(400, 'Current password is required to set a new password.');
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect.');
    }
    if (newPassword.length < 6) {
      throw new ApiError(400, 'New password must be at least 6 characters long.');
    }
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
