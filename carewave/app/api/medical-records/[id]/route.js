import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id: parseInt(params.id) },
      include: { patient: { include: { user: true } } },
    });
    if (!medicalRecord) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }
    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error('GET /api/medical-records/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch medical record', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const medicalRecord = await prisma.medicalRecord.update({
      where: { id: parseInt(params.id) },
      data: {
        patient: data.patientId ? { connect: { patientId: data.patientId } } : undefined,
        recordId: data.recordId,
        diagnosis: data.diagnosis,
        presentingComplaint: data.presentingComplaint || null,
        familyHistory: data.familyHistory || null,
        socialHistory: data.socialHistory || null,
        pastMedicalHistory: data.pastMedicalHistory || null,
        allergies: data.allergies || null,
        medications: data.medications || null,
        date: data.date ? new Date(data.date) : undefined,
        doctorName: data.doctorName,
      },
      include: { patient: { include: { user: true } } },
    });
    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error('PUT /api/medical-records/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update medical record', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.medicalRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Medical record deleted' });
  } catch (error) {
    console.error('DELETE /api/medical-records/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete medical record', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}