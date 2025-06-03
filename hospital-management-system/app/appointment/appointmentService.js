import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPatients() {
  return prisma.patient.findMany({
    include: { user: true },
  });
}

export async function getDoctors() {
  return prisma.doctor.findMany({
    include: { user: true, department: true },
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

export async function getAppointments(filters = {}) {
  const { status, type, dateFrom, dateTo, doctorId, patientId } = filters;
  return prisma.appointment.findMany({
    where: {
      status: status && status !== 'ALL' ? status : undefined,
      type: type && type !== 'ALL' ? type : undefined,
      date: {
        gte: dateFrom ? new Date(dateFrom) : undefined,
        lte: dateTo ? new Date(dateTo) : undefined,
      },
      doctorId: doctorId ? parseInt(doctorId) : undefined,
      patientId: patientId ? parseInt(patientId) : undefined,
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
      department: true,
      bookedBy: true,
    },
  });
}

export async function createAppointment(data) {
  const lastAppointment = await prisma.appointment.findFirst({
    where: { doctorId: data.doctorId, date: { gte: new Date(data.date).setHours(0, 0, 0, 0) } },
    orderBy: { queueNumber: 'desc' },
  });
  const queueNumber = lastAppointment ? (lastAppointment.queueNumber || 0) + 1 : 1;

  return prisma.appointment.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      departmentId: data.departmentId,
      bookedById: data.bookedById,
      date: new Date(data.date),
      type: data.type,
      reason: data.reason,
      notes: data.notes,
      queueNumber,
      queueStatus: 'WAITING',
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
      department: true,
    },
  });
}

export async function updateAppointment(id, data) {
  return prisma.appointment.update({
    where: { id: parseInt(id) },
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      departmentId: data.departmentId,
      date: data.date ? new Date(data.date) : undefined,
      type: data.type,
      reason: data.reason,
      notes: data.notes,
      status: data.status,
      checkInTime: data.checkInTime ? new Date(data.checkInTime) : undefined,
      checkOutTime: data.checkOutTime ? new Date(data.checkOutTime) : undefined,
      queueStatus: data.queueStatus,
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
      department: true,
    },
  });
}

export async function getAvailability({ doctorId, startDate, endDate }) {
  return prisma.doctorAvailability.findMany({
    where: {
      doctorId: parseInt(doctorId),
      status: 'AVAILABLE',
      startTime: startDate ? { gte: new Date(startDate) } : undefined,
      endTime: endDate ? { lte: new Date(endDate) } : undefined,
    },
  });
}

export async function createAvailability(data) {
  return prisma.doctorAvailability.create({
    data: {
      doctorId: parseInt(data.doctorId),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      status: data.status,
      dayOfWeek: data.dayOfWeek,
    },
  });
}

export async function getQueue({ doctorId }) {
  return prisma.appointment.findMany({
    where: {
      doctorId: parseInt(doctorId),
      date: {
        gte: new Date().setHours(0, 0, 0, 0),
        lte: new Date().setHours(23, 59, 59, 999),
      },
      queueStatus: { in: ['WAITING', 'IN_PROGRESS'] },
    },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
    },
    orderBy: { queueNumber: 'asc' },
  });
}

export async function updateQueue(id, data) {
  return prisma.appointment.update({
    where: { id: parseInt(id) },
    data: { queueStatus: data.status },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } },
    },
  });
}