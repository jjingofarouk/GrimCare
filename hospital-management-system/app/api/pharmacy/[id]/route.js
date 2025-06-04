import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const prescription = await prisma.prescription.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        pharmacist: { include: { user: true } },
        items: { include: { medication: true } },
        invoice: { include: { transaction: true } },
        dispensingRecords: { include: { medication: true, dispensedBy: true, pharmacist: true } },
      },
    });

    if (prescription) {
      return NextResponse.json(prescription);
    }

    const medication = await prisma.medication.findUnique({
      where: { id: parseInt(id) },
      include: { supplier: true, formulary: true, dispensingRecords: true, stockAdjustments: true },
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

    const pharmacist = await prisma.pharmacist.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (pharmacist) {
      return NextResponse.json(pharmacist);
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
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const prescription = await prisma.prescription.update({
          where: { id: parseInt(id) },
          data: { status },
          include: {
            patient: { include: { user: true } },
            doctor: { include: { user: true } },
            pharmacist: { include: { user: true } },
            items: { include: { medication: true } },
          },
        });
        return NextResponse.json(prescription);
      }

      case 'updateStock': {
        const { stockQuantity } = payload;
        if (stockQuantity === undefined) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const medication = await prisma.medication.update({
          where: { id: parseInt(id) },
          data: { stockQuantity },
          include: { supplier: true, formulary: true },
        });
        await prisma.stockAdjustment.create({
          data: {
            medication: { connect: { id: parseInt(id) } },
            quantity: stockQuantity,
            reason: 'Manual stock update',
            adjustedBy: { connect: { id: 1 } },
          },
        });
        return NextResponse.json(medication);
      }

      case 'updateOrderStatus': {
        const { status } = payload;
        if (!status) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const supplier = await prisma.supplier.update({
          where: { id: parseInt(id) },
          data: { name, contact, email, address },
        });
        return NextResponse.json(supplier);
      }

      case 'updatePharmacist': {
        const { name, licenseNumber, phone, specialty } = payload;
        if (!name || !licenseNumber) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const pharmacist = await prisma.pharmacist.update({
          where: { id: parseInt(id) },
          data: { 
            user: { update: { name } },
            licenseNumber,
            phone,
            specialty,
          },
          include: { user: true },
        });
        return NextResponse.json(pharmacist);
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

    const pharmacist = await prisma.pharmacist.findUnique({
      where: { id: parseInt(id) },
    });
    if (pharmacist) {
      await prisma.pharmacist.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json({ message: 'Pharmacist deleted' });
    }

    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  } catch (error) {
    console.error('DELETE /api/pharmacy/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete resource', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}