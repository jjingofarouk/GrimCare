import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const vaccinationRecord = await prisma.vaccinationRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!vaccinationRecord) {
      return NextResponse.json({ error: 'Vaccination record not found' }, { status: 404 });
    }
    return NextResponse.json(vaccinationRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vaccination record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const vaccinationRecord = await prisma.vaccinationRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(vaccinationRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vaccination record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.vaccinationRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Vaccination record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vaccination record' }, { status: 500 });
  }
}