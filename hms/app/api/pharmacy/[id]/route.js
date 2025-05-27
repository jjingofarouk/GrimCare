import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const pharmacyRecord = await prisma.pharmacyRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!pharmacyRecord) {
      return NextResponse.json({ error: 'Pharmacy record not found' }, { status: 404 });
    }
    return NextResponse.json(pharmacyRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pharmacy record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const pharmacyRecord = await prisma.pharmacyRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(pharmacyRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update pharmacy record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.pharmacyRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Pharmacy record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete pharmacy record' }, { status: 500 });
  }
}