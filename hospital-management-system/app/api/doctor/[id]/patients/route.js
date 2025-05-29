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

    const patients = await prisma.patient.findMany({
      where: {
        appointments: { some: { doctorId: parseInt(params.id) } },
      },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}
