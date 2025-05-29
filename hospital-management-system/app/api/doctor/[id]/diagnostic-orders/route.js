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

    const diagnosticOrders = await prisma.diagnosticOrder.findMany({
      where: { doctorId: parseInt(params.id) },
      include: { patient: { include: { user: { select: { name: true } } } } },
    });
    return NextResponse.json(diagnosticOrders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch diagnostic orders' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const diagnosticOrder = await prisma.diagnosticOrder.create({
      data: {
        doctorId: parseInt(params.id),
        ...data,
      },
    });
    return NextResponse.json(diagnosticOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create diagnostic order' }, { status: 500 });
  }
}
