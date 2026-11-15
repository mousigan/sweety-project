// ============================================
// Glucose Reading Service
// ============================================
// Business logic for CRUD operations on glucose readings.
// Enforces validation rules like max 4 readings per day,
// unique time slot per date, and user ownership.

import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

// Valid time slots
const VALID_TIME_SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner',
];

/**
 * Helper: Parse a date string to a Date object at midnight UTC.
 * This ensures consistent date handling with no timezone issues.
 */
const parseDate = (dateStr) => {
  // dateStr expected as 'YYYY-MM-DD'
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

/**
 * Create a new glucose reading.
 * Uses a transaction to safely enforce the 4-readings-per-day rule.
 */
export const createReading = async (userId, data) => {
  const { date, timeSlot, glucoseValue } = data;
  const readingDate = parseDate(date);

  // Use a Prisma interactive transaction for atomicity
  return await prisma.$transaction(async (tx) => {
    // Check for duplicate time slot on this date
    const existingSlot = await tx.glucoseReading.findUnique({
      where: {
        userId_date_timeSlot: {
          userId,
          date: readingDate,
          timeSlot,
        },
      },
    });

    if (existingSlot) {
      throw new ApiError(
        409,
        `You already have an ${timeSlot} reading for this date.`
      );
    }

    // Count readings for this date (max 4 rule)
    const dailyCount = await tx.glucoseReading.count({
      where: {
        userId,
        date: readingDate,
      },
    });

    if (dailyCount >= 4) {
      throw new ApiError(400, 'You can add only 4 readings per day.');
    }

    // Create the reading
    const reading = await tx.glucoseReading.create({
      data: {
        userId,
        date: readingDate,
        timeSlot,
        glucoseValue: parseInt(glucoseValue, 10),
      },
    });

    return reading;
  });
};

/**
 * Get all readings for a user with optional pagination and date filtering.
 */
export const getReadings = async (userId, query = {}) => {
  const {
    page = 1,
    limit = 20,
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'desc',
  } = query;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const take = parseInt(limit, 10);

  // Build the where clause
  const where = { userId };

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = parseDate(startDate);
    if (endDate) where.date.lte = parseDate(endDate);
  }

  // Determine sort order
  const orderBy = [];
  if (sortBy === 'date') {
    orderBy.push({ date: sortOrder });
    orderBy.push({
      createdAt: sortOrder,
    });
  } else {
    orderBy.push({ [sortBy]: sortOrder });
  }

  const [readings, total] = await Promise.all([
    prisma.glucoseReading.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.glucoseReading.count({ where }),
  ]);

  return {
    readings,
    pagination: {
      page: parseInt(page, 10),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
  };
};

/**
 * Get a single reading by ID (only if it belongs to the user).
 */
export const getReadingById = async (userId, readingId) => {
  const reading = await prisma.glucoseReading.findUnique({
    where: { id: parseInt(readingId, 10) },
  });

  if (!reading) {
    throw new ApiError(404, 'Reading not found.');
  }

  if (reading.userId !== userId) {
    throw new ApiError(403, 'You are not authorized to access this reading.');
  }

  return reading;
};

/**
 * Update a glucose reading.
 * Enforces ownership, duplicate, and daily limit rules.
 */
export const updateReading = async (userId, readingId, data) => {
  const { date, timeSlot, glucoseValue } = data;
  const id = parseInt(readingId, 10);
  const readingDate = parseDate(date);

  return await prisma.$transaction(async (tx) => {
    // Verify the reading exists and belongs to this user
    const existing = await tx.glucoseReading.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new ApiError(404, 'Reading not found.');
    }

    if (existing.userId !== userId) {
      throw new ApiError(403, 'You are not authorized to update this reading.');
    }

    // Check for duplicate time slot (excluding the current reading)
    const duplicate = await tx.glucoseReading.findFirst({
      where: {
        userId,
        date: readingDate,
        timeSlot,
        id: { not: id },
      },
    });

    if (duplicate) {
      throw new ApiError(
        409,
        `You already have an ${timeSlot} reading for this date.`
      );
    }

    // Check daily limit (excluding the current reading)
    const dateChanged =
      existing.date.toISOString().slice(0, 10) !==
      readingDate.toISOString().slice(0, 10);

    if (dateChanged) {
      const dailyCount = await tx.glucoseReading.count({
        where: {
          userId,
          date: readingDate,
        },
      });

      if (dailyCount >= 4) {
        throw new ApiError(400, 'You can add only 4 readings per day.');
      }
    }

    // Update the reading
    const updated = await tx.glucoseReading.update({
      where: { id },
      data: {
        date: readingDate,
        timeSlot,
        glucoseValue: parseInt(glucoseValue, 10),
      },
    });

    return updated;
  });
};

/**
 * Delete a glucose reading (only if it belongs to the user).
 */
export const deleteReading = async (userId, readingId) => {
  const id = parseInt(readingId, 10);

  const reading = await prisma.glucoseReading.findUnique({
    where: { id },
  });

  if (!reading) {
    throw new ApiError(404, 'Reading not found.');
  }

  if (reading.userId !== userId) {
    throw new ApiError(403, 'You are not authorized to delete this reading.');
  }

  await prisma.glucoseReading.delete({
    where: { id },
  });

  return { message: 'Reading deleted successfully.' };
};
