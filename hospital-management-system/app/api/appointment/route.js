import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patient: { userId: { not: null } },
        doctor: { userId: { not: null } },
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        department: true,
        bookedBy: true,
        queue: true,
      },
    });
    const invalidAppointments = appointments.filter(
      (appt) => !appt.patient?.user || !appt.doctor?.user
    );
    if (invalidAppointments.length > 0) {
      console.warn('Appointments with missing user data:', JSON.stringify(invalidAppointments, null, 2));
    }
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('GET /api/appointment error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.patientId || !data.doctorId || !data.date || !data.reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(data.patientId) },
      include: { user: true },
    });
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(data.doctorId) },
      include: { user: true },
    });

    if (!patient?.user || !doctor?.user) {
      console.error('Invalid patient or doctor:', { patientId: data.patientId, doctorId: data.doctorId });
      return NextResponse.json({ error: 'Invalid patient or doctor: missing user data' }, { status: 400 });
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: parseInt(data.doctorId),
        date: new Date(data.date),
        status: { not: 'CANCELLED' },
      },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: 'Doctor already booked at this time' }, { status: 409 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patient: { connect: { id: parseInt(data.patientId) } },
        doctor: { connect: { id: parseInt(data.doctorId) } },
        department: data.departmentId ? { connect: { id: parseInt(data.departmentId) } } : undefined,
        bookedBy: data.bookedById ? { connect: { id: parseInt(data.bookedById) } } : undefined,
        date: new Date(data.date),
        status: data.status || 'SCHEDULED',
        type: data.type || 'REGULAR',
        reason: data.reason,
        notes: data.notes || null,
        reminderSent: data.reminderSent || false,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        department: true,
        bookedBy: true,
        queue: true,
      },
    });

    if (data.type === 'REGULAR' || data.type === 'EMERGENCY') {
      const lastQueue = await prisma.queue.findFirst({
        where: { appointment: { doctorId: parseInt(data.doctorId) } },
        orderBy: { queueNumber: 'desc' },
      });
      await prisma.queue.create({
        data: {
          appointment: { connect: { id: appointment.id } },
          queueNumber: lastQueue ? lastQueue.queueNumber + 1 : 1,
          status: 'WAITING',
        },
      });
    }

    const updatedAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        department: true,
        bookedBy: true,
        queue: true,
      },
    });

    return NextResponse.json(updatedAppointment, { status: 201 });
  } catch (error) {
    console.error('POST /api/appointment error:', error);
    return NextResponse.json({ error: 'Failed to create appointment', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}