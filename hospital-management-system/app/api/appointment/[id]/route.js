import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_request, { params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        department: true,
        bookedBy: true,
        queue: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('GET /api/appointment/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
  }

  try {
    const data = await request.json();
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId || undefined,
        date: data.date ? new Date(data.date) : undefined,
        status: { not: 'CANCELLED' },
        NOT: { id },
      },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: 'Doctor already booked at this time' }, { status: 409 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        patient: data.patientId ? { connect: { id: parseInt(data.patientId) } } : undefined,
        doctor: data.doctorId ? { connect: { id: parseInt(data.doctorId) } } : undefined,
        department: data.departmentId ? { connect: { id: parseInt(data.departmentId) } } : undefined,
        bookedBy: data.bookedById ? { connect: { id: parseInt(data.bookedById) } } : undefined,
        date: data.date ? new Date(data.date) : undefined,
        status: data.status || undefined,
        type: data.type || undefined,
        reason: data.reason || undefined,
        notes: data.notes || undefined,
        checkInTime: data.checkInTime ? new Date(data.checkInTime) : undefined,
        checkOutTime: data.checkOutTime ? new Date(data.checkOutTime) : undefined,
        reminderSent: data.reminderSent !== undefined ? data.reminderSent : undefined,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        department: true,
        bookedBy: true,
      },
    });

    if (data.status === 'CHECKED_IN' && !updatedAppointment.queue) {
      const lastQueue = await prisma.queue.findFirst({
        where: { appointment: { doctorId: updatedAppointment.doctorId } },
        orderBy: { queueNumber: 'desc' },
      });
      await prisma.queue.create({
        data: {
          appointment: { connect: { id: updatedAppointment.id } },
          queueNumber: lastQueue ? lastQueue.queueNumber + 1 : 1,
          status: 'WAITING',
        },
      });
    }

    if (data.status === 'COMPLETED' || data.status === 'CANCELLED' || data.status === 'NO_SHOW') {
      await prisma.queue.update({
        where: { appointmentId: id },
        data: { status: 'COMPLETED' },
      });
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('PUT /api/appointment/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update appointment', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(_request, { params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
  }

  try {
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/appointment/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete appointment', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
