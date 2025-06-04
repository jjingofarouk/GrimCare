import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventory = await prisma.medication.findMany({
      include: { supplier: true, formulary: true },
    });
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('GET /api/pharmacy/inventory error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}