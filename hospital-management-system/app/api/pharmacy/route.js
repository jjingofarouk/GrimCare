// app/api/pharmacy/route.js
// API routes for pharmacy module

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const medications = await prisma.medication.findMany({
      include: { supplier: true, formulary: true },
    });
    return NextResponse.json(medications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medications' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const medication = await prisma.medication.create({ data });
    return NextResponse.json(medication, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create medication' }, { status: 500 });
  }
}