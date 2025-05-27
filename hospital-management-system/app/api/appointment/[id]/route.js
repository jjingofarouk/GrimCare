import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.appointment.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Appointment deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}