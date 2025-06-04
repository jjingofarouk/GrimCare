// app/api/payroll/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: { user: true },
    });
    return NextResponse.json(payrolls);
  } catch (error) {
    console.error('GET /api/payroll error:', error);
    return NextResponse.json({ error: 'Failed to fetch payrolls', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}