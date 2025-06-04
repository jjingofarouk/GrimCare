import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { prescriptionId, medicationId, quantity, patientType, dispensedById } = await request.json();
    const medication = await prisma.medication.findUnique({ where: { id: medicationId } });
    if (medication.stockQuantity < quantity) throw new Error('Insufficient stock');

    const dispensingRecord = await prisma.dispensingRecord.create({
      data: {
        prescriptionId,
        medicationId,
        quantity,
        patientType,
        dispensedById,
      },
    });

    await prisma.medication.update({
      where: { id: medicationId },
      data: { stockQuantity: medication.stockQuantity - quantity },
    });

    return Response.json(dispensingRecord);
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to dispense medication' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
