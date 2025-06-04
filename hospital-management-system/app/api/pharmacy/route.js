import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        items: { include: { medication: true } },
        invoice: { include: { transaction: true } },
        dispensingRecords: { include: { medication: true, dispensedBy: true } },
      },
    });
    const inventory = await prisma.medication.findMany({
      include: { supplier: true, formulary: true, dispensingRecords: true, stockAdjustments: true },
    });
    const orders = await prisma.purchaseOrder.findMany({
      include: { supplier: true, items: { include: { medication: true } } },
    });
    const suppliers = await prisma.supplier.findMany();
    const formularies = await prisma.formulary.findMany({
      include: { medications: true },
    });
    return NextResponse.json({
      prescriptions,
      inventory,
      orders,
      suppliers,
      formularies,
    });
  } catch (error) {
    console.error('GET /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to fetch pharmacy data', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { action, payload } = data;

    switch (action) {
      case 'createPrescription': {
        const { patientId, doctorId, items, notes } = payload;
        if (!patientId || !doctorId || !items) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const prescription = await prisma.prescription.create({
          data: {
            patient: { connect: { id: patientId } },
            doctor: { connect: { id: doctorId } },
            notes,
            items: {
              create: items.map(item => ({
                medication: { connect: { id: item.medicationId } },
                dosage: item.dosage,
                quantity: item.quantity,
                frequency: item.frequency,
                duration: item.duration,
              })),
            },
          },
          include: {
            patient: { include: { user: true } },
            doctor: { include: { user: true } },
            items: { include: { medication: true } },
          },
        });
        return NextResponse.json(prescription, { status: 201 });
      }

      case 'createInvoice': {
        const { prescriptionId, totalAmount, paymentMethod } = payload;
        if (!prescriptionId || !totalAmount) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const invoice = await prisma.invoice.create({
          data: {
            prescription: { connect: { id: prescriptionId } },
            totalAmount,
            paymentMethod,
            status: 'PENDING',
          },
          include: { prescription: true, transaction: true },
        });
        return NextResponse.json(invoice, { status: 201 });
      }

      case 'processRefund': {
        const { invoiceId, reason, amount, processedById } = payload;
        if (!invoiceId || !reason || !amount || !processedById) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const refund = await prisma.refund.create({
          data: {
            invoice: { connect: { id: invoiceId } },
            reason,
            amount,
            processedBy: { connect: { id: processedById } },
          },
        });
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'REFUNDED' },
        });
        return NextResponse.json(refund, { status: 201 });
      }

      case 'dispenseMedication': {
        const { prescriptionId, medicationId, quantity, patientType, dispensedById } = payload;
        if (!prescriptionId || !medicationId || !quantity || !patientType || !dispensedById) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const dispensingRecord = await prisma.dispensingRecord.create({
          data: {
            prescription: { connect: { id: prescriptionId } },
            medication: { connect: { id: medicationId } },
            quantity,
            patientType,
            dispensedBy: { connect: { id: dispensedById } },
          },
          include: { medication: true, dispensedBy: true },
        });
        await prisma.medication.update({
          where: { id: medicationId },
          data: { stockQuantity: { decrement: quantity } },
        });
        await prisma.prescription.update({
          where: { id: prescriptionId },
          data: { status: 'DISPENSED' },
        });
        return NextResponse.json(dispensingRecord, { status: 201 });
      }

      case 'addMedication': {
        const { name, genericName, category, batchNumber, barcode, rfid, stockQuantity, minStockThreshold, price, expiryDate, supplierId, formularyId, narcotic } = payload;
        if (!name || !category || !batchNumber || !stockQuantity || !price || !expiryDate) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const medication = await prisma.medication.create({
          data: {
            name,
            genericName,
            category,
            batchNumber,
            barcode,
            rfid,
            stockQuantity,
            minStockThreshold,
            price,
            expiryDate: new Date(expiryDate),
            supplier: supplierId ? { connect: { id: supplierId } } : undefined,
            formulary: formularyId ? { connect: { id: formularyId } } : undefined,
            narcotic,
          },
          include: { supplier: true, formulary: true },
        });
        return NextResponse.json(medication, { status: 201 });
      }

      case 'addFormulary': {
        const { name, description } = payload;
        if (!name) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const formulary = await prisma.formulary.create({
          data: { name, description },
          include: { medications: true },
        });
        return NextResponse.json(formulary, { status: 201 });
      }

      case 'createOrder': {
        const { supplierId, items } = payload;
        if (!supplierId || !items) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const order = await prisma.purchaseOrder.create({
          data: {
            supplier: { connect: { id: supplierId } },
            totalAmount,
            items: {
              create: items.map(item => ({
                medication: { connect: { id: item.medicationId } },
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              })),
            },
          },
          include: { supplier: true, items: { include: { medication: true } } },
        });
        return NextResponse.json(order, { status: 201 });
      }

      case 'addSupplier': {
        const { name, contact, email, address } = payload;
        if (!name || !email) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const supplier = await prisma.supplier.create({
          data: { name, contact, email, address },
        });
        return NextResponse.json(supplier, { status: 201 });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('POST /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}