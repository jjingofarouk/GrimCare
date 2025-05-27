import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const admissions = await prisma.admission.findMany();
    return NextResponse.json(admissions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admissions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const admission = await prisma.admission.create({ data });
    return NextResponse.json(admission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admission' }, { status: 500 });
  }
}