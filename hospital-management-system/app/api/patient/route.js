// app/api/patient/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

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
    if (!data.email || !data.name || !data.patientId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: 'PATIENT',
      },
    });
    const patient = await prisma.patient.create({
      data: {
        user: { connect: { id: user.id } },
        patientId: data.patientId,
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
      },
      include: { user: true },
    });
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('POST /api/patient error:', error);
    return NextResponse.json({ error: 'Failed to create patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}