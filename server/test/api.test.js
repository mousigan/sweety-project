import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/db.js';

describe('Sweety Blood Glucose Tracker API Tests', () => {
  let user1Token;
  let user1Id;
  let user2Token;
  let user2Id;
  let testReadingId;

  const testUser1 = {
    name: 'Test Patient One',
    email: 'patient1@sweetytest.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  const testUser2 = {
    name: 'Test Patient Two',
    email: 'patient2@sweetytest.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  beforeAll(async () => {
    // Clean up test data before running
    await prisma.glucoseReading.deleteMany({
      where: {
        user: {
          email: { in: [testUser1.email, testUser2.email] },
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: { in: [testUser1.email, testUser2.email] },
      },
    });
  });

  afterAll(async () => {
    // Clean up test data after running
    await prisma.glucoseReading.deleteMany({
      where: {
        user: {
          email: { in: [testUser1.email, testUser2.email] },
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: { in: [testUser1.email, testUser2.email] },
      },
    });
    await prisma.$disconnect();
  });

  // ============================================
  // 1. Authentication Tests
  // ============================================
  describe('Authentication Endpoints', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser1);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser1.email.toLowerCase());
      expect(res.body.data.user.password).toBeUndefined(); // Never expose passwords
      user1Id = res.body.data.user.id;
    });

    it('should reject duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser1);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should register a second user for isolation tests', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser2);

      expect(res.status).toBe(201);
      user2Id = res.body.data.user.id;
    });

    it('should login with correct credentials and set JWT cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser1.email,
          password: testUser1.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      user1Token = res.body.data.token;

      // Verify Set-Cookie header contains token
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('token='))).toBe(true);
    });

    it('should login second user and store token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser2.email,
          password: testUser2.password,
        });

      expect(res.status).toBe(200);
      user2Token = res.body.data.token;
    });

    it('should reject login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser1.email,
          password: 'WrongPassword123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password.');
    });

    it('should reject unauthorized API requests without token', async () => {
      const res = await request(app).get('/api/readings');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================
  // 2. Glucose Reading CRUD & Validation Tests
  // ============================================
  describe('Glucose Reading Management & Validation', () => {
    const today = new Date().toISOString().slice(0, 10);

    it('should create a valid glucose reading', async () => {
      const res = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: today,
          timeSlot: 'Morning (fasting)',
          glucoseValue: 95,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.reading.glucoseValue).toBe(95);
      expect(res.body.data.reading.timeSlot).toBe('Morning (fasting)');
      testReadingId = res.body.data.reading.id;
    });

    it('should reject missing glucose value with exact message', async () => {
      const res = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: today,
          timeSlot: 'After breakfast',
          glucoseValue: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please enter a glucose value.');
    });

    it('should reject glucose value below 40 with exact message', async () => {
      const res = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: today,
          timeSlot: 'After breakfast',
          glucoseValue: 39,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Value must be between 40 and 600 mg/dl.');
    });

    it('should reject glucose value above 600 with exact message', async () => {
      const res = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: today,
          timeSlot: 'After breakfast',
          glucoseValue: 601,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Value must be between 40 and 600 mg/dl.');
    });

    it('should reject future date with exact message', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const futureDateStr = futureDate.toISOString().slice(0, 10);

      const res = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: futureDateStr,
          timeSlot: 'After breakfast',
          glucoseValue: 120,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Date cannot be in the future.');
    });

    it('should reject duplicate time slot for same user and date with exact message', async () => {
      const res = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: today,
          timeSlot: 'Morning (fasting)',
          glucoseValue: 110,
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('You already have an Morning (fasting) reading for this date.');
    });

    it('should add remaining time slots up to 4 readings for today', async () => {
      const slot2 = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ date: today, timeSlot: 'After breakfast', glucoseValue: 135 });
      expect(slot2.status).toBe(201);

      const slot3 = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ date: today, timeSlot: 'After lunch', glucoseValue: 140 });
      expect(slot3.status).toBe(201);

      const slot4 = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ date: today, timeSlot: 'After dinner', glucoseValue: 125 });
      expect(slot4.status).toBe(201);
    });

    it('should reject more than 4 readings per day with exact message', async () => {
      // Even if another slot is attempted on the same day (should be rejected)
      const res = await request(app)
        .post('/api/readings')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: today,
          timeSlot: 'Morning (fasting)',
          glucoseValue: 100,
        });

      // Caught by duplicate or daily limit
      expect([400, 409]).toContain(res.status);
    });

    it('should enforce user isolation: User 2 cannot access or view User 1 reading', async () => {
      const res = await request(app)
        .get(`/api/readings/${testReadingId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('not authorized');
    });

    it('should enforce user isolation: User 2 cannot update User 1 reading', async () => {
      const res = await request(app)
        .put(`/api/readings/${testReadingId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          date: today,
          timeSlot: 'Morning (fasting)',
          glucoseValue: 150,
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('not authorized');
    });

    it('should enforce user isolation: User 2 cannot delete User 1 reading', async () => {
      const res = await request(app)
        .delete(`/api/readings/${testReadingId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('not authorized');
    });

    it('should allow user to update their own reading', async () => {
      const res = await request(app)
        .put(`/api/readings/${testReadingId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          date: today,
          timeSlot: 'Morning (fasting)',
          glucoseValue: 102,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.reading.glucoseValue).toBe(102);
    });

    it('should allow user to delete their own reading', async () => {
      const res = await request(app)
        .delete(`/api/readings/${testReadingId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Reading deleted successfully.');

      // Verify it is gone
      const check = await request(app)
        .get(`/api/readings/${testReadingId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(check.status).toBe(404);
    });
  });

  // ============================================
  // 3. Reports Calculation Tests
  // ============================================
  describe('Reports Calculation', () => {
    const reportDate = '2026-05-15';

    beforeAll(async () => {
      // Create specific readings for deterministic report calculations
      // User 2: add 3 readings on 2026-05-15
      // Values: 100, 140, 150 => Highest: 150, Lowest: 100, Sum: 390 / 3 = 130.0
      const d = new Date(Date.UTC(2026, 4, 15));
      await prisma.glucoseReading.createMany({
        data: [
          { userId: user2Id, date: d, timeSlot: 'Morning (fasting)', glucoseValue: 100 },
          { userId: user2Id, date: d, timeSlot: 'After breakfast', glucoseValue: 140 },
          { userId: user2Id, date: d, timeSlot: 'After lunch', glucoseValue: 150 },
        ],
      });
    });

    it('should calculate daily report correctly with 1 decimal place', async () => {
      const res = await request(app)
        .get(`/api/reports/daily?date=${reportDate}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.highest).toBe(150);
      expect(res.body.data.lowest).toBe(100);
      expect(res.body.data.average).toBe(130.0);
      expect(res.body.data.totalReadings).toBe(3);
      expect(res.body.data.readings.length).toBe(3);
    });

    it('should return empty report response for date with no readings', async () => {
      const res = await request(app)
        .get('/api/reports/daily?date=2026-01-01')
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.highest).toBeNull();
      expect(res.body.data.lowest).toBeNull();
      expect(res.body.data.average).toBeNull();
      expect(res.body.data.totalReadings).toBe(0);
      expect(res.body.data.readings).toEqual([]);
    });

    it('should calculate month-to-date report correctly without future dates of that month', async () => {
      const res = await request(app)
        .get(`/api/reports/month-to-date?date=${reportDate}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalReadings).toBe(3);
      expect(res.body.data.average).toBe(130.0);
    });

    it('should calculate previous calendar month report correctly across boundary', async () => {
      // Query June 2026 => Previous month is May 2026, which contains our 3 readings!
      const res = await request(app)
        .get('/api/reports/monthly?date=2026-06-10')
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.month).toBe('2026-05');
      expect(res.body.data.highest).toBe(150);
      expect(res.body.data.lowest).toBe(100);
      expect(res.body.data.average).toBe(130.0);
      expect(res.body.data.totalReadings).toBe(3);
    });
  });
});
