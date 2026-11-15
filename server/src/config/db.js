// ============================================
// Prisma Client Singleton
// ============================================
// Ensures only one Prisma Client instance is created,
// which is important for connection pooling.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
