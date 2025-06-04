import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace('/api/pharmacy/', '').split('/')[0] || pathname.split('/').pop();
  try {
    switch (path) {
      case 'inventory':
        const inventory = await prisma.medication.findMany({
          include: { supplier: true, formulary: true },
        });
        return NextResponse.json(inventory);

      case 'prescriptions':
        const prescriptions = await prisma.prescription.findMany({
          include: { patient: true, doctor: true, items: { include: { medication: true } } },
        });
        return NextResponse.json(prescriptions);

      case 'orders':
        const orders = await prisma.purchaseOrder.findMany({
          include: { supplier: true, items: { include: { medication: true } } },
        });
        return NextResponse.json(orders);

      case 'suppliers':
        const suppliers = await prisma.supplier.findMany();
        return NextResponse.json(suppliers);

      case 'formularies':
        const formularies = await prisma.formulary.findMany({
          include: { medications: true },
        });
        return NextResponse.json(formularies);

      case 'stock-alerts':
        const stockAlerts = await prisma.medication.findMany({
          where: { stockQuantity: { lte: prisma.medication.fields.minStockThreshold } },
        });
        return NextResponse.json(stockAlerts);

      case 'barcode':
        const barcode = searchParams.get('barcode');
        const medication = await prisma.medication.findFirst({
          where: { barcode },
          include: { supplier: true, formulary: true },
        });
        return NextResponse.json(medication);

      case 'narcotics':
        const medicationId = parseInt(pathname.split('/').pop());
        const narcotic = await prisma.medication.findFirst({
          where: { id: medicationId, narcotic: true },
          include: { dispensingRecords: true, stockAdjustments: true },
        });
        return NextResponse.json(narcotic);

      case 'reports':
        const reportType = pathname.split('/')[3];
        const timeRange = searchParams.get('timeRange');
        const dateFilter = {
          gte: new Date(new Date().setMonth(new Date().getMonth() - (timeRange === 'monthly' ? 1 : timeRange === 'weekly' ? 0.25 : 12))),
        };
        if (reportType === 'stock') {
          const report = await prisma.medication.findMany({
            where: { updatedAt: dateFilter },
            select: { name: true, stockQuantity: true, expiryDate: true },
          });
          return NextResponse.json(report);
        } else if (reportType === 'sales') {
          const report = await prisma.dispensingRecord.findMany({
            where: { dispensedDate: dateFilter },
            include: { medication: true },
          });
          return NextResponse.json(report);
        }
        throw new Error('Invalid report type');

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api/pharmacy/', '').split('/')[0] || pathname.split('/').pop();
  try {
    const data = await request.json();
    switch (path) {
      case 'medications':
        const medication = await prisma.medication.create({ data });
        return NextResponse.json(medication);

      case 'prescriptions':
        const prescription = await prisma.prescription.create({
          data: {
            ...data,
            items: { create: data.items },
          },
          include: { items: true },
        });
        return NextResponse.json(prescription);

      case 'orders':
        const order = await prisma.purchaseOrder.create({
          data: {
            ...data,
            items: { create: data.items },
          },
          include: { items: true },
        });
        return NextResponse.json(order);

      case 'suppliers':
        const supplier = await prisma.supplier.create({ data });
        return NextResponse.json(supplier);

      case 'dispense':
        const { prescriptionId, medicationId, quantity, patientType, dispensedById } = data;
        const medicationDispense = await prisma.medication.findUnique({ where: { id: medicationId } });
        if (medicationDispense.stockQuantity < quantity) throw new Error('Insufficient stock');
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
          data: { stockQuantity: medicationDispense.stockQuantity - quantity },
        });
        return NextResponse.json(dispensingRecord);

      case 'refunds':
        const refund = await prisma.refund.create({ data });
        return NextResponse.json(refund);

      case 'invoices':
        const invoice = await prisma.invoice.create({
          data: {
            prescriptionId: data.prescriptionId,
            totalAmount: data.totalAmount,
            status: data.status || 'PENDING',
            paymentMethod: data.paymentMethod,
            transaction: data.transactionId ? { connect: { id: data.transactionId } } : undefined,
          },
        });
        return NextResponse.json(invoice);

      case 'stock-adjustments':
        const { medicationId, quantity, reason, adjustedById } = data;
        const medicationAdjust = await prisma.medication.findUnique({ where: { id: medicationId } });
        const adjustment = await prisma.stockAdjustment.create({
          data: {
            medicationId,
            quantity,
            reason,
            adjustedById,
          },
        });
        await prisma.medication.update({
          where: { id: medicationId },
          data: { stockQuantity: medicationAdjust.stockQuantity + quantity },
        });
        return NextResponse.json(adjustment);

      case 'formularies':
        const formulary = await prisma.formulary.create({ data });
        return NextResponse.json(formulary);

      case 'drug-interactions':
        const { medicationIds } = data;
        const interactions = await prisma.drugInteraction.findMany({
          where: {
            OR: [
              { medicationId1: { in: medicationIds } },
              { medicationId2: { in: medicationIds } },
            ],
          },
          include: { medication1: true, medication2: true },
        });
        return NextResponse.json(interactions);

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  const { pathname } = new URL(request.url);
  const segments = pathname.replace('/api/pharmacy/', '').split('/');
  const path = segments[0];
  const id = parseInt(segments[1]);
  try {
    const data = await request.json();
    switch (path) {
      case 'medications':
        if (segments[2] === 'stock') {
          const medication = await prisma.medication.update({
            where: { id },
            data: { stockQuantity: data.stockQuantity },
          });
          return NextResponse.json(medication);
        }
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });

      case 'prescriptions':
        if (segments[2] === 'status') {
          const prescription = await prisma.prescription.update({
            where: { id },
            data: { status: data.status },
          });
          return NextResponse.json(prescription);
        }
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });

      case 'orders':
        if (segments[2] === 'status') {
          const order = await prisma.purchaseOrder.update({
            where: { id },
            data: { status: data.status },
          });
          return NextResponse.json(order);
        }
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });

      case 'suppliers':
        const supplier = await prisma.supplier.update({
          where: { id },
          data,
        });
        return NextResponse.json(supplier);

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  const { pathname } = new URL(request.url);
  const segments = pathname.replace('/api/pharmacy/', '').split('/');
  const path = segments[0];
  const id = parseInt(segments[1]);
  try {
    switch (path) {
      case 'medications':
        const medication = await prisma.medication.delete({
          where: { id },
        });
        return NextResponse.json(medication);

      case 'suppliers':
        const supplier = await prisma.supplier.delete({
          where: { id },
        });
        return NextResponse.json(supplier);

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}