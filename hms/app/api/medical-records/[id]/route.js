import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!medicalRecord) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }
    return NextResponse.json(medicalRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medical record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const medicalRecord = await prisma.medicalRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(medicalRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update medical record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.medicalRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Medical record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete medical record' }, { status: 500 });
  }
}