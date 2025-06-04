import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const emergencyRecord = await prisma.emergencyRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!emergencyRecord) {
      return NextResponse.json({ error: 'Emergency record not found' }, { status: 404 });
    }
    return NextResponse.json(emergencyRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch emergency record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const emergencyRecord = await prisma.emergencyRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(emergencyRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update emergency record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.emergencyRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Emergency record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete emergency record' }, { status: 500 });
  }
}