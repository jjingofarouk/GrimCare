import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const queueRecord = await prisma.queueRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!queueRecord) {
      return NextResponse.json({ error: 'Queue record not found' }, { status: 404 });
    }
    return NextResponse.json(queueRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch queue record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const queueRecord = await prisma.queueRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(queueRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update queue record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.queueRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Queue record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete queue record' }, { status: 500 });
  }
}