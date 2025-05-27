import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stats = {
      totalPatients: await prisma.patient.count(),
      totalAppointments: await prisma.appointment.count(),
      totalRevenue: await prisma.bill.aggregate({
        _sum: { amount: true },
      }),
    };
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}