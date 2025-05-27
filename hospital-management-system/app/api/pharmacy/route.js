import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pharmacyRecords = await prisma.pharmacyRecord.findMany();
    return NextResponse.json(pharmacyRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pharmacy records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const pharmacyRecord = await prisma.pharmacyRecord.create({ data });
    return NextResponse.json(pharmacyRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pharmacy record' }, { status: 500 });
  }
}