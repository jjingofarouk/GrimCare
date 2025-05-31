import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { user: true },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('GET /api/doctor error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.email || !data.name || !data.password || !data.specialty || !data.licenseNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: 'DOCTOR',
      },
    });
    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialty: data.specialty,
        licenseNumber: data.licenseNumber,
      },
      include: { user: true },
    });
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error('POST /api/doctor error:', error);
    return NextResponse.json({ error: 'Failed to create doctor', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}