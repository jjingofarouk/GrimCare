import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vaccinationRecords = await prisma.vaccinationRecord.findMany();
    return NextResponse.json(vaccinationRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vaccination records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const vaccinationRecord = await prisma.vaccinationRecord.create({ data });
    return NextResponse.json(vaccinationRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create vaccination record' }, { status: 500 });
  }
}