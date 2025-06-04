import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to Supabase PostgreSQL');
    return { success: true };
  } catch (error) {
    console.error('Connection failed:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}
