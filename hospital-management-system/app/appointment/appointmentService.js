import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAppointments({ status, type, dateFrom, dateTo, doctorId, patientId } = {}) {
  return prisma.appointment.findMany({
    where: {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(type && type !== 'ALL' ? { type } : {}),
      ...(dateFrom ? { date: { gte: new Date(dateFrom) } } : {}),
      ...(dateTo ? { date: { lte: new Date(dateTo) } } : {}),
      ...(doctorId ? { doctorId: parseInt(doctorId) } : {}),
      ...(patientId ? { patientId: parseInt(patientId) } : {}),
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
      department: true,
      queue: true,
    },
  });
}

export async function getAppointment(id) {
  return prisma.appointment.findUnique({
    where: { id: parseInt(id) },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
      department: true,
      queue: true,
    },
  });
}

export async function createAppointment(data) {
  const { patientId, doctorId, departmentId, date, type, reason, notes, bookedById } = data;
  const queueNumber = await prisma.queue.count({
    where: {
      appointment: {
        doctorId: parseInt(doctorId),
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lte: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
        },
      },
    },
  }) + 1;

  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        departmentId: departmentId ? parseInt(departmentId) : null,
        date: new Date(date),
        type: type || 'REGULAR',
        reason,
        notes,
        bookedById: bookedById ? parseInt(bookedById) : null,
        status: 'SCHEDULED',
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        department: true,
      },
    });

    await tx.queue.create({
      data: {
        appointmentId: appointment.id,
        queueNumber,
        status: 'WAITING',
      },
    });

    return appointment;
  });
}

export async function updateAppointment(id, data) {
  return prisma.appointment.update({
    where: { id: parseInt(id) },
    data: {
      patientId: data.patientId ? parseInt(data.patientId) : undefined,
      doctorId: data.doctorId ? parseInt(data.doctorId) : undefined,
      departmentId: data.departmentId ? parseInt(data.departmentId) : null,
      date: data.date ? new Date(data.date) : undefined,
      type: data.type,
      reason: data.reason,
      notes: data.notes,
      status: data.status,
      checkInTime: data.checkInTime ? new Date(data.checkInTime) : undefined,
      checkOutTime: data.checkOutTime ? new Date(data.checkOutTime) : undefined,
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
      department: true,
      queue: true,
    },
  });
}

export async function getPatients() {
  return prisma.patient.findMany({
    include: { user: true },
  });
}

export async function getDoctors() {
  return prisma.doctor.findMany({
    include: { user: true },
  });
}

export async function getDepartments() {
  return prisma.department.findMany();
}

export async function createDepartment(data) {
  return prisma.department.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
}

export async function getAvailability({ doctorId }) {
  return prisma.doctorAvailability.findMany({
    where: { doctorId: parseInt(doctorId) },
    orderBy: { startTime: 'asc' },
  });
}

export async function createAvailability(data) {
  return prisma.doctorAvailability.create({
    data: {
      doctorId: parseInt(data.doctorId),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      status: data.status || 'AVAILABLE',
    },
  });
}

export async function getQueue({ doctorId }) {
  return prisma.queue.findMany({
    where: {
      appointment: { doctorId: parseInt(doctorId) },
      status: { in: ['WAITING', 'IN_PROGRESS'] },
    },
    include: {
      appointment: {
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
        },
      },
    },
  });
}

export async function updateQueue(id, data) {
  return prisma.queue.update({
    where: { id: parseInt(id) },
    data: { status: data.status },
    include: {
      appointment: {
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
        },
      },
    },
  });
}