import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const doctorId = parseInt(searchParams.get('doctorId'), 10);
  const date = searchParams.get('date');

  try {
    const where = {
      appointment: {
        status: { notIn: ['CANCELLED', 'COMPLETED', 'NO_SHOW'] },
      },
    };
    if (doctorId) where.appointment = { ...where.appointment, doctorId };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.appointment = { ...where.appointment, date: { gte: startOfDay, lte: endOfDay } };
    }

    const queues = await prisma.queue.findMany({
      where,
      include: {
        appointment: {
          include: {
            patient: { include: { user: true } },
            doctor: { include: { user: true } },
          },
        },
      },
      orderBy: { queueNumber: 'asc' },
    });

    return NextResponse.json(queues);
  } catch (error) {
    console.error('GET /api/queue error:', error);
    return NextResponse.json({ error: 'Failed to fetch queue', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const queue = await prisma.queue.update({
      where: { id: parseInt(data.id) },
      data: {
        queueNumber: data.queueNumber || undefined,
        status: data.status || undefined,
      },
      include: {
        appointment: {
          include: {
            patient: { include: { user: true } },
            doctor: { include: { user: true } },
          },
        },
      },
    });

    return NextResponse.json(queue);
  } catch (error) {
    console.error('PUT /api/queue error:', error);
    return NextResponse.json({ error: 'Failed to update queue', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
