// ============================================
// Report Service
// ============================================
// Business logic for generating daily, month-to-date,
// and previous-month reports from glucose readings.

import prisma from '../config/db.js';

/**
 * Helper: Parse 'YYYY-MM-DD' to a UTC midnight Date.
 */
const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

/**
 * Helper: Calculate statistics from a list of readings.
 */
const calculateStats = (readings) => {
  if (readings.length === 0) {
    return {
      highest: null,
      lowest: null,
      average: null,
      totalReadings: 0,
    };
  }

  const values = readings.map((r) => r.glucoseValue);
  const sum = values.reduce((a, b) => a + b, 0);

  return {
    highest: Math.max(...values),
    lowest: Math.min(...values),
    average: parseFloat((sum / values.length).toFixed(1)),
    totalReadings: values.length,
  };
};

/**
 * Daily report: all readings for a specific date.
 */
export const getDailyReport = async (userId, dateStr) => {
  const date = parseDate(dateStr);

  const readings = await prisma.glucoseReading.findMany({
    where: {
      userId,
      date,
    },
    orderBy: { createdAt: 'asc' },
  });

  return {
    date: dateStr,
    ...calculateStats(readings),
    readings,
  };
};

/**
 * Month-to-date report: from the 1st of the month through the selected date.
 */
export const getMonthToDateReport = async (userId, dateStr) => {
  const selectedDate = parseDate(dateStr);
  const [year, month] = dateStr.split('-').map(Number);

  // First day of the selected month
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  // Include through the selected date
  const endDate = selectedDate;

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

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: dateStr,
    ...calculateStats(readings),
    readings,
  };
};

/**
 * Monthly report: entire previous calendar month.
 * If selected month is November 2026, the report covers October 1–31, 2026.
 */
export const getMonthlyReport = async (userId, dateStr) => {
  const [year, month] = dateStr.split('-').map(Number);

  // Previous month
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = year - 1;
  }

  // First day of previous month
  const startDate = new Date(Date.UTC(prevYear, prevMonth - 1, 1));
  // Last day of previous month (day 0 of current month = last day of prev month)
  const lastDay = new Date(Date.UTC(year, month - 1, 0));

  const readings = await prisma.glucoseReading.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: lastDay,
      },
    },
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
  });

  return {
    month: `${prevYear}-${String(prevMonth).padStart(2, '0')}`,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: lastDay.toISOString().slice(0, 10),
    ...calculateStats(readings),
    readings,
  };
};
