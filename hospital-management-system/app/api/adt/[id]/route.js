import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const admission = await prisma.admission.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        patient: true,
        doctor: true,
        ward: true,
      },
    });
    if (!admission) {
      return NextResponse.json({ error: 'Admission not found' }, { status: 404 });
    }
    return NextResponse.json(admission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admission' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const previousAdmission = await prisma.admission.findUnique({
      where: { id: parseInt(params.id) },
      include: { ward: true },
    });
    const admission = await prisma.admission.update({
      where: { id: parseInt(params.id) },
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        wardId: data.wardId,
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : undefined,
        triagePriority: data.triagePriority,
        triageNotes: data.triageNotes,
        status: data.status,
        dischargeNotes: data.dischargeNotes,
        dischargeDate: data.dischargeDate ? new Date(data.dischargeDate) : undefined,
      },
      include: {
        patient: true,
        doctor: true,
        ward: true,
      },
    });
    if (data.status === 'DISCHARGED' && previousAdmission.wardId) {
      await prisma.ward.update({
        where: { id: previousAdmission.wardId },
        data: { occupiedBeds: { decrement: 1 } },
      });
    }
    if (data.wardId && data.wardId !== previousAdmission.wardId) {
      if (previousAdmission.wardId) {
        await prisma.ward.update({
          where: { id: previousAdmission.wardId },
          data: { occupiedBeds: { decrement: 1 } },
        });
      }
      await prisma.ward.update({
        where: { id: data.wardId },
        data: { occupiedBeds: { increment: 1 } },
      });
    }
    return NextResponse.json(admission);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update admission' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admission = await prisma.admission.findUnique({
      where: { id: parseInt(params.id) },
      include: { ward: true },
    });
    if (admission.wardId) {
      await prisma.ward.update({
        where: { id: admission.wardId },
        data: { occupiedBeds: { decrement: 1 } },
      });
    }
    await prisma.admission.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Admission deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admission' }, { status: 500 });
  }
}