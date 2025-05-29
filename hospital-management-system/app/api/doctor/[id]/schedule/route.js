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

    const schedules = await prisma.schedule.findMany({
      where: { doctorId: parseInt(params.id) },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const schedule = await prisma.schedule.create({
      data: {
        doctorId: parseInt(params.id),
        ...data,
      },
    });
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
