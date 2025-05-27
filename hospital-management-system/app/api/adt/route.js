import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const admission = await prisma.admission.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!admission) {
      return NextResponse.json({ error: 'Admission not found' }, { status: 404 });
    }
    return NextResponse.json(admission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admission' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const admission = await prisma.admission.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(admission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update admission' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.admission.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Admission deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admission' }, { status: 500 });
  }
}