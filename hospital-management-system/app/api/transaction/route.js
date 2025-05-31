// app/api/transaction/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { patient: true, costCenter: true },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('GET /api/transaction error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}