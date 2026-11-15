// ============================================
// Glucose Reading Controller
// ============================================
// Handles HTTP requests for CRUD operations on glucose readings.
// User ID always comes from the authenticated JWT, never from the client.

import * as readingService from '../services/reading.service.js';

/**
 * POST /api/readings
 * Create a new glucose reading.
 */
export const createReading = async (req, res, next) => {
  try {
    const reading = await readingService.createReading(req.userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Reading added successfully.',
      data: { reading },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/readings
 * Get all readings for the authenticated user.
 */
export const getReadings = async (req, res, next) => {
  try {
    const result = await readingService.getReadings(req.userId, req.query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/readings/:id
 * Get a single reading by ID.
 */
export const getReadingById = async (req, res, next) => {
  try {
    const reading = await readingService.getReadingById(
      req.userId,
      req.params.id
    );

    res.json({
      success: true,
      data: { reading },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/readings/:id
 * Update a glucose reading.
 */
export const updateReading = async (req, res, next) => {
  try {
    const reading = await readingService.updateReading(
      req.userId,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: 'Reading updated successfully.',
      data: { reading },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/readings/:id
 * Delete a glucose reading.
 */
export const deleteReading = async (req, res, next) => {
  try {
    const result = await readingService.deleteReading(
      req.userId,
      req.params.id
    );

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
