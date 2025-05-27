import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const medicalRecords = await prisma.medicalRecord.findMany();
    return NextResponse.json(medicalRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medical records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const medicalRecord = await prisma.medicalRecord.create({ data });
    return NextResponse.json(medicalRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create medical record' }, { status: 500 });
  }
}