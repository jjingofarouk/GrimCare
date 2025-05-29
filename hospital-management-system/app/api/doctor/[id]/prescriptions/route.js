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

    const prescriptions = await prisma.prescription.findMany({
      where: { doctorId: parseInt(params.id) },
      include: { patient: { include: { user: { select: { name: true } } } } },
    });
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const prescription = await prisma.prescription.create({
      data: {
        doctorId: parseInt(params.id),
        ...data,
      },
    });
    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
}
