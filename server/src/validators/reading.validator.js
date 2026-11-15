// ============================================
// Glucose Reading Validators
// ============================================
// Validation rules for creating and updating glucose readings.

import { body, param } from 'express-validator';

// The four valid time slots
const VALID_TIME_SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner',
];

export const createReadingValidator = [
  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Please enter a valid date.')
    .custom((value) => {
      // Strip time portion — compare date only
      const inputDate = new Date(value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate > today) {
        throw new Error('Date cannot be in the future.');
      }
      return true;
    }),

  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required.')
    .isIn(VALID_TIME_SLOTS)
    .withMessage(
      `Time slot must be one of: ${VALID_TIME_SLOTS.join(', ')}.`
    ),

  body('glucoseValue')
    .notEmpty()
    .withMessage('Please enter a glucose value.')
    .isInt({ min: 40, max: 600 })
    .withMessage('Value must be between 40 and 600 mg/dl.'),
];

export const updateReadingValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid reading ID.'),

  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Please enter a valid date.')
    .custom((value) => {
      const inputDate = new Date(value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate > today) {
        throw new Error('Date cannot be in the future.');
      }
      return true;
    }),

  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required.')
    .isIn(VALID_TIME_SLOTS)
    .withMessage(
      `Time slot must be one of: ${VALID_TIME_SLOTS.join(', ')}.`
    ),

  body('glucoseValue')
    .notEmpty()
    .withMessage('Please enter a glucose value.')
    .isInt({ min: 40, max: 600 })
    .withMessage('Value must be between 40 and 600 mg/dl.'),
];

export const readingIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid reading ID.'),
];
