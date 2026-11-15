// ============================================
// Express Application Setup
// ============================================
// Configures middleware, routes, and error handling.
// Separated from server.js for testability.

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/index.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import readingRoutes from './routes/reading.routes.js';
import reportRoutes from './routes/report.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Import error handler
import errorHandler from './middleware/errorHandler.js';

const app = express();

// ---- Middleware ----

// Parse JSON request bodies
app.use(express.json());

// Parse cookies (needed for HTTP-only JWT cookies)
app.use(cookieParser());

// CORS configuration — allow the frontend to send cookies
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// ---- Routes ----

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Sweety API is running.' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ---- 404 Handler ----
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ---- Centralized Error Handler ----
app.use(errorHandler);

export default app;
