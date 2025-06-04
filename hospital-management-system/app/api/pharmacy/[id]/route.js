import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const prescription = await prisma.prescription.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        items: { include: { medication: true } },
        invoice: { include: { transaction: true } },
        dispensingRecords: { include: { medication: true, dispensedBy: { select: { name: true } } } },
      },
    });
    if (prescription) {
      return NextResponse.json(prescription);
    }

    const medication = await prisma.medication.findUnique({
      where: { id: parseInt(id) },
      include: { 
        supplier: true, 
        formulary: true, 
        dispensingRecords: { include: { dispensedBy: { select: { name: true } } } }, 
        stockAdjustments: true,
        drugInteractions1: { include: { medication2: { select: { name: true } } } },
        drugInteractions2: { include: { medication1: { select: { name: true } } } },
      },
    });
    if (medication) {
      return NextResponse.json(medication);
    }

    const order = await prisma.purchaseOrder.findUnique({
      where: { id: parseInt(id) },
      include: { supplier: true, items: { include: { medication: true } } },
    });
    if (order) {
      return NextResponse.json(order);
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });
    if (supplier) {
      return NextResponse.json(supplier);
    }

    const formulary = await prisma.formulary.findUnique({
      where: { id: parseInt(id) },
      include: { medications: true },
    });
    if (formulary) {
      return NextResponse.json(formulary);
    }

    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  } catch (error) {
    console.error('GET /api/pharmacy/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch resource', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { action, payload } = data;

    switch (action) {
      case 'updatePrescriptionStatus': {
        const { status } = payload;
        if (!status) {
          return NextResponse.json({ error: 'Missing required field: status' }, { status: 400 });
        }
        const prescription = await prisma.prescription.update({
          where: { id: parseInt(id) },
          data: { status },
          include: {
            patient: { include: { user: { select: { name: true } } } },
            doctor: { include: { user: { select: { name: true } } } },
            items: { include: { medication: true } },
          },
        });
        return NextResponse.json(prescription);
      }

      case 'updateStock': {
        const { stockQuantity, adjustedById } = payload;
        if (stockQuantity === undefined || !adjustedById) {
          return NextResponse.json({ error: 'Missing required fields: stockQuantity or adjustedById' }, { status: 400 });
        }
        const medication = await prisma.medication.findUnique({
          where: { id: parseInt(id) },
        });
        if (!medication) {
          return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
        }
        const updatedMedication = await prisma.medication.update({
          where: { id: parseInt(id) },
          data: { stockQuantity: parseInt(stockQuantity) },
          include: { supplier: true, formulary: true },
        });
        await prisma.stockAdjustment.create({
          data: {
            medication: { connect: { id: parseInt(id) } },
            quantity: parseInt(stockQuantity) - medication.stockQuantity,
            reason: 'Manual stock update',
            adjustedBy: { connect: { id: parseInt(adjustedById) } },
            adjustmentDate: new Date(),
          },
        });
        return NextResponse.json(updatedMedication);
      }

      case 'updateOrderStatus': {
        const { status } = payload;
        if (!status) {
          return NextResponse.json({ error: 'Missing required field: status' }, { status: 400 });
        }
        const order = await prisma.purchaseOrder.update({
          where: { id: parseInt(id) },
          data: { status },
          include: { supplier: true, items: { include: { medication: true } } },
        });
        return NextResponse.json(order);
      }

      case 'updateSupplier': {
        const { name, contact, email, address } = payload;
        if (!name || !email) {
          return NextResponse.json({ error: 'Missing required fields: name or email' }, { status: 400 });
        }
        const supplier = await prisma.supplier.update({
          where: { id: parseInt(id) },
          data: { name, contact, email, address },
        });
        return NextResponse.json(supplier);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('PUT /api/pharmacy/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update resource', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const medication = await prisma.medication.findUnique({
      where: { id: parseInt(id) },
    });
    if (medication) {
      await prisma.medication.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json({ message: 'Medication deleted' });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });
    if (supplier) {
      await prisma.supplier.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json({ message: 'Supplier deleted' });
    }

    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  } catch (error) {
    console.error('DELETE /api/pharmacy/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete resource', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}