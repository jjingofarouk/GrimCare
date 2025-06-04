// app/api/pharmacy/inventory/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventory = await prisma.medication.findMany({
      include: { supplier: true, formulary: true },
    });
    return Response.json(inventory);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
