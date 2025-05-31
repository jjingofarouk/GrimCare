// app/api/patient/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: true },
    });
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error('GET /api/patient/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const patient = await prisma.patient.update({
      where: { id: parseInt(params.id) },
      data: {
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender || null,
        phone: data.phone || null,
        address: data.address || null,
        emergencyContact: data.emergencyContact || null,
        insuranceProvider: data.insuranceProvider || null,
        insurancePolicy: data.insurancePolicy || null,
        user: data.name || data.email ? {
          update: {
            name: data.name || undefined,
            email: data.email || undefined,
          }
        } : undefined,
      },
      include: { user: true },
    });
    return NextResponse.json(patient);
  } catch (error) {
    console.error('PUT /api/patient/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: true },
    });
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    await prisma.$transaction([
      prisma.patient.delete({ where: { id: parseInt(params.id) } }),
      prisma.user.delete({ where: { id: patient.userId } }),
    ]);
    return NextResponse.json({ message: 'Patient deleted' });
  } catch (error) {
    console.error('DELETE /api/patient/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}