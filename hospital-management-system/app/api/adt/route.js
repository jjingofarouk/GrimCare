import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const admissions = await prisma.admission.findMany({
      include: {
        patient: true,
        doctor: true,
        ward: true,
      },
    });
    return NextResponse.json(admissions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admissions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const admission = await prisma.admission.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        wardId: data.wardId,
        admissionDate: new Date(data.admissionDate),
        triagePriority: data.triagePriority,
        triageNotes: data.triageNotes,
        status: data.status,
        dischargeNotes: data.dischargeNotes,
      },
      include: {
        patient: true,
        doctor: true,
        ward: true,
      },
    });
    if (data.wardId) {
      await prisma.ward.update({
        where: { id: data.wardId },
        data: { occupiedBeds: { increment: 1 } },
      });
    }
    return NextResponse.json(admission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admission' }, { status: 500 });
  }
}