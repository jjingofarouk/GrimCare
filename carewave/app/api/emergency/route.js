import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const emergencyRecords = await prisma.emergencyRecord.findMany();
    return NextResponse.json(emergencyRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch emergency records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const emergencyRecord = await prisma.emergencyRecord.create({ data });
    return NextResponse.json(emergencyRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create emergency record' }, { status: 500 });
  }
}