import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: { user: true },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error('GET /api/patient error:', error);
    return NextResponse.json({ error: 'Failed to fetch patients', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.email || !data.name) {
      return NextResponse.json({ error: 'Missing required fields: email, name' }, { status: 400 });
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;

    const patient = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          role: 'PATIENT',
          password: hashedPassword,
        },
      });

      return await prisma.patient.create({
        data: {
          patientId: data.patientId || `P-${uuidv4().slice(0, 8)}`,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender || null,
          phone: data.phone || null,
          address: data.address || null,
          emergencyContact: data.emergencyContact || null,
          emergencyContactPhone: data.emergencyContactPhone || null,
          insuranceProvider: data.insuranceProvider || null,
          insurancePolicy: data.insurancePolicy || null,
          bloodType: data.bloodType || null,
          allergies: data.allergies || null,
          medicalHistory: data.medicalHistory || null,
          user: { connect: { id: user.id } },
        },
        include: { user: true },
      });
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('POST /api/patient error:', error);
    return NextResponse.json({ error: 'Failed to create patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}