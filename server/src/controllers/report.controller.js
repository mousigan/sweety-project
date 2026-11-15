// ============================================
// Report Controller
// ============================================
// Handles HTTP requests for daily, month-to-date,
// and monthly reports.

import * as reportService from '../services/report.service.js';
import ApiError from '../utils/ApiError.js';

/**
 * Validates and extracts the 'date' query parameter.
 */
const getDateParam = (req) => {
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ApiError(400, 'Please provide a valid date in YYYY-MM-DD format.');
  }
  return date;
};

/**
 * GET /api/reports/daily?date=YYYY-MM-DD
 */
export const getDailyReport = async (req, res, next) => {
  try {
    const date = getDateParam(req);
    const report = await reportService.getDailyReport(req.userId, date);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/month-to-date?date=YYYY-MM-DD
 */
export const getMonthToDateReport = async (req, res, next) => {
  try {
    const date = getDateParam(req);
    const report = await reportService.getMonthToDateReport(req.userId, date);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/monthly?date=YYYY-MM-DD
 */
export const getMonthlyReport = async (req, res, next) => {
  try {
    const date = getDateParam(req);
    const report = await reportService.getMonthlyReport(req.userId, date);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
