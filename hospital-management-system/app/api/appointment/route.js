import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany();
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const appointment = await prisma.appointment.create({ data });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}