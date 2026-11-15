// ============================================
// Server Entry Point
// ============================================
// Starts the Express server and connects to the database.

import app from './app.js';
import config from './config/index.js';
import prisma from './config/db.js';

const start = async () => {
  try {
    // Test the database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database.');

    // Start listening
    app.listen(config.port, () => {
      console.log(`🚀 Sweety API server running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
