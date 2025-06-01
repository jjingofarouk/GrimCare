import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: true },
    });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    console.error('GET /api/doctor/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch doctor', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const doctor = await prisma.doctor.update({
      where: { id: parseInt(params.id) },
      data: {
        specialty: data.specialty || undefined,
        licenseNumber: data.licenseNumber || undefined,
        phone: data.phone || null,
        office: data.office || null,
        user: data.name || data.email ? {
          update: {
            name: data.name || undefined,
            email: data.email || undefined,
          },
        } : undefined,
      },
      include: { user: true },
    });
    return NextResponse.json(doctor);
  } catch (error) {
    console.error('PUT /api/doctor/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update doctor', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: true },
    });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    await prisma.$transaction([
      prisma.doctor.delete({ where: { id: parseInt(params.id) } }),
      prisma.user.delete({ where: { id: doctor.userId } }),
    ]);
    return NextResponse.json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error('DELETE /api/doctor/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete doctor', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}