// ============================================
// Database Seed Script
// ============================================
// Creates a demo user and sample glucose readings
// for testing and demonstration purposes.
//
// Run with: npm run db:seed

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TIME_SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner',
];

/**
 * Generate a random glucose value within a realistic range.
 */
const randomGlucose = (min = 70, max = 200) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get a date string for N days ago in YYYY-MM-DD format.
 */
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

/**
 * Parse date string to UTC midnight Date object.
 */
const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

async function main() {
  console.log('🌱 Seeding database...\n');

  // Clean existing data
  await prisma.glucoseReading.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo@123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  });

  console.log('👤 Created demo user:');
  console.log(`   Email:    john@example.com`);
  console.log(`   Password: Demo@123\n`);

  // Create glucose readings for the past 45 days
  // This provides data for daily, month-to-date, and monthly reports
  const readings = [];

  for (let day = 0; day <= 45; day++) {
    const date = daysAgo(day);
    // Randomly add 1-4 readings per day (skip some days)
    if (day % 7 === 6) continue; // Skip some days for realistic data

    const slotsToday = TIME_SLOTS.slice(
      0,
      Math.floor(Math.random() * 4) + 1
    );

    for (const slot of slotsToday) {
      // Vary glucose ranges based on time slot for realism
      let min = 70, max = 180;
      if (slot === 'Morning (fasting)') { min = 70; max = 130; }
      if (slot === 'After breakfast') { min = 100; max = 180; }
      if (slot === 'After lunch') { min = 90; max = 200; }
      if (slot === 'After dinner') { min = 100; max = 190; }

      readings.push({
        userId: user.id,
        date: parseDate(date),
        timeSlot: slot,
        glucoseValue: randomGlucose(min, max),
      });
    }
  }

  await prisma.glucoseReading.createMany({
    data: readings,
  });

  console.log(`📊 Created ${readings.length} glucose readings across 45 days.`);
  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
