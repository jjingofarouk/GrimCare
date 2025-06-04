import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: { patient: true, doctor: true, items: { include: { medication: true } } },
    });
    return Response.json(prescriptions);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const prescription = await prisma.prescription.create({
      data: {
        ...data,
        items: { create: data.items },
      },
      include: { items: true },
    });
    return Response.json(prescription);
  } catch (error) {
    return Response.json({ error: 'Failed to create prescription' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
