import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const doctor = await prisma.doctor.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.doctor.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Doctor deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}