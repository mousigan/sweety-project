// ============================================
// Dashboard Controller
// ============================================
// Returns calculated dashboard data for the authenticated user.

import * as dashboardService from '../services/dashboard.service.js';

/**
 * GET /api/dashboard
 */
export const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData(
      req.userId,
      req.query
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
