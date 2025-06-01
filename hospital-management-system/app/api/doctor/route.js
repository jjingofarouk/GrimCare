import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

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
    if (!data.email || !data.name || !data.specialty || !data.licenseNumber || !data.doctorId) {
      return NextResponse.json({ error: 'Missing required fields: email, name, specialty, licenseNumber, doctorId' }, { status: 400 });
    }

    const doctor = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          role: 'DOCTOR',
        },
      });

      return await prisma.doctor.create({
        data: {
          userId: user.id,
          doctorId: data.doctorId,
          specialty: data.specialty,
          licenseNumber: data.licenseNumber,
          phone: data.phone || null,
          office: data.office || null,
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