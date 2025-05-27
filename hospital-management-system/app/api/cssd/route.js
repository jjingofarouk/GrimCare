import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cssdRecords = await prisma.cssdRecord.findMany();
    return NextResponse.json(cssdRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch CSSD records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const cssdRecord = await prisma.cssdRecord.create({ data });
    return NextResponse.json(cssdRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create CSSD record' }, { status: 500 });
  }
}