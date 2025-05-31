import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, name, role } = await req.json();
  const userId = await prisma.user.count() + 1;

  const user = await prisma.user.create({
    data: {
      id: userId,
      email,
      name,
      role: role || 'USER',
    },
  });

  if (role === 'DOCTOR') {
    await prisma.doctor.create({
      data: {
        userId: userId,
        specialty: 'General',
        department: 'General',
        hospital: 'Default Hospital',
        designation: 'Doctor',
        availabilityStatus: 'AVAILABLE',
      },
    });
  }

  if (role === 'USER') {
    await prisma.patient.create({
      data: {
        userId: userId,
        type: 'Outpatient',
        recordId: `P${userId}${Date.now()}`,
      },
    });
  }

  return Response.json({ user });
}