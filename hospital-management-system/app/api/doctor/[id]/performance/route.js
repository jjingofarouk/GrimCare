import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';

    const startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: parseInt(params.id),
        createdAt: { gte: startDate },
      },
    });

    const patientsToday = await prisma.appointment.count({
      where: {
        doctorId: parseInt(params.id),
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    const admissions = await prisma.appointment.count({
      where: {
        doctorId: parseInt(params.id),
        createdAt: { gte: startDate },
        patient: { type: 'Inpatient' },
      },
    });

    const avgConsultTime = appointments.length
      ? appointments.reduce((sum, appt) => sum + (appt.status === 'Seen' ? 15 : 0), 0) / appointments.length
      : 0;

    return NextResponse.json({
      patientsToday,
      admissions,
      avgConsultTime: Math.round(avgConsultTime),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch performance summary' }, { status: 500 });
  }
}
