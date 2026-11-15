// ============================================
// Dashboard Service
// ============================================
// Computes summary statistics, chart data, and recent readings
// for the authenticated user's dashboard.

import prisma from '../config/db.js';

/**
 * Get dashboard data for a user.
 * Returns summary stats, chart data, and recent readings.
 */
export const getDashboardData = async (userId, query = {}) => {
  const { days = 30 } = query;

  // Calculate the date range for the dashboard
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days, 10));
  startDate.setHours(0, 0, 0, 0);

  // Fetch readings within the date range
  const readings = await prisma.glucoseReading.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
  });

  // Calculate summary statistics
  let summary = {
    averageGlucose: null,
    highestReading: null,
    lowestReading: null,
    totalReadings: 0,
  };

  if (readings.length > 0) {
    const values = readings.map((r) => r.glucoseValue);
    const sum = values.reduce((a, b) => a + b, 0);

    summary = {
      averageGlucose: parseFloat((sum / values.length).toFixed(1)),
      highestReading: Math.max(...values),
      lowestReading: Math.min(...values),
      totalReadings: values.length,
    };
  }

  // Chart data: group readings by date for the trend chart
  const chartData = readings.map((r) => ({
    date: r.date.toISOString().slice(0, 10),
    timeSlot: r.timeSlot,
    glucoseValue: r.glucoseValue,
  }));

  // Recent readings (last 10)
  const recentReadings = await prisma.glucoseReading.findMany({
    where: { userId },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    take: 10,
  });

  return {
    summary,
    chartData,
    recentReadings,
    period: {
      days: parseInt(days, 10),
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    },
  };
};
