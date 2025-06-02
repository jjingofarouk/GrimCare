import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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
    if (!data.email || !data.name || !data.specialty || !data.licenseNumber || !data.password) {
      return NextResponse.json({ error: 'Missing required fields: email, name, specialty, licenseNumber, password' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const doctor = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          role: 'DOCTOR',
          password: hashedPassword,
        },
      });

      return await prisma.doctor.create({
        data: {
          doctorId: data.doctorId || `D-${uuidv4().slice(0, 8)}`,
          specialty: data.specialty,
          licenseNumber: data.licenseNumber,
          phone: data.phone || null,
          office: data.office || null,
          user: { connect: { id: user.id } },
        },
        include: { user: true },
      });
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error('POST /api/doctor error:', error);
    return NextResponse.json({ error: 'Failed to create doctor', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}