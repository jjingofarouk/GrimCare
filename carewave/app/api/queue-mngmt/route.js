import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const queueRecords = await prisma.queueRecord.findMany();
    return NextResponse.json(queueRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch queue records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const queueRecord = await prisma.queueRecord.create({ data });
    return NextResponse.json(queueRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create queue record' }, { status: 500 });
  }
}