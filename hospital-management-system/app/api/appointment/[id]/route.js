import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
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

    if (!appointment.patient?.user || !appointment.doctor?.user) {
      console.warn('Appointment with missing user data:', JSON.stringify(appointment, null, 2));
      return NextResponse.json(
        { error: 'Invalid appointment: missing patient or doctor user data' },
        { status: 400 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error(`GET /api/appointment/${id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment', details: error.message },
      { status: 500 }
    );
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

    // Validate patient and doctor if provided
    if (data.patientId || data.doctorId) {
      const patient = data.patientId
        ? await prisma.patient.findUnique({
            where: { id: parseInt(data.patientId) },
            include: { user: true },
          })
        : null;
      const doctor = data.doctorId
        ? await prisma.doctor.findUnique({
            where: { id: parseInt(data.doctorId) },
            include: { user: true },
          })
        : null;

      if ((data.patientId && !patient?.user) || (data.doctorId && !doctor?.user)) {
        console.error('Invalid patient or doctor:', {
          patientId: data.patientId,
          doctorId: data.doctorId,
        });
        return NextResponse.json(
          { error: 'Invalid patient or doctor: missing user data' },
          { status: 400 }
        );
      }
    }

    // Check for conflicting appointments
    if (data.doctorId && data.date) {
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId: parseInt(data.doctorId),
          date: new Date(data.date),
          status: { not: 'CANCELLED' },
          NOT: { id },
        },
      });

      if (existingAppointment) {
        return NextResponse.json(
          { error: 'Doctor already booked at this time' },
          { status: 409 }
        );
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        patient: data.patientId ? { connect: { id: parseInt(data.patientId) } } : undefined,
        doctor: data.doctorId ? { connect: { id: parseInt(data.doctorId) } } : undefined,
        department: data.departmentId
          ? { connect: { id: parseInt(data.departmentId) } }
          : undefined,
        bookedBy: data.bookedById ? { connect: { id: parseInt(data.bookedById) } } : undefined,
        date: data.date ? new Date(data.date) : undefined,
        status: data.status || undefined,
        type: data.type || undefined,
        reason: data.reason || undefined,
        notes: data.notes || undefined,
        checkInTime: data.checkInTime ? new Date(data.checkInTime) : undefined,
        checkOutTime: data.checkOutTime ? data.checkOutTime ? new Date(data.checkOutTime) : null : undefined,
        reminderSent: data.reminderSent !== undefined ? data.reminderSent : undefined,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        department: true,
        bookedBy: true,
        queue: true,
      },
    });

    if (!updatedAppointment.patient?.user || !updatedAppointment.doctor?.user) {
      console.warn('Updated appointment with missing user data:', JSON.stringify(updatedAppointment, null, 2));
    }

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error(`PUT /api/appointment/${id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update appointment', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/appointment/${id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete appointment', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}