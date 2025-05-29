import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Assume a JWT verification utility

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doctors = await prisma.doctor.findMany({
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { email, name, password, ...doctorData } = data;

    // Create User with DOCTOR role
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password, // Ensure password is hashed in production
        role: 'DOCTOR',
      },
    });

    // Create Doctor profile
    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        ...doctorData,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
