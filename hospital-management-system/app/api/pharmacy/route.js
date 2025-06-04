import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        items: { include: { medication: true } },
        invoice: { include: { transaction: true } },
        dispensingRecords: { include: { medication: true, dispensedBy: { select: { name: true } } } },
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
        if (!patientId || !doctorId || !items || !items.length) {
          return NextResponse.json({ error: 'Missing required fields: patientId, doctorId, or items' }, { status: 400 });
        }
        const prescription = await prisma.prescription.create({
          data: {
            patient: { connect: { id: parseInt(patientId) } },
            doctor: { connect: { id: parseInt(doctorId) } },
            notes,
            status: 'PENDING',
            prescriptionDate: new Date(),
            items: {
              create: items.map(item => ({
                medication: { connect: { id: parseInt(item.medicationId) } },
                dosage: item.dosage,
                quantity: parseInt(item.quantity),
                frequency: item.frequency,
                duration: item.duration,
              })),
            },
          },
          include: {
            patient: { include: { user: { select: { name: true } } } },
            doctor: { include: { user: { select: { name: true } } } },
            items: { include: { medication: true } },
          },
        });
        return NextResponse.json(prescription, { status: 201 });
      }

      case 'createInvoice': {
        const { prescriptionId, totalAmount, paymentMethod } = payload;
        if (!prescriptionId || !totalAmount) {
          return NextResponse.json({ error: 'Missing required fields: prescriptionId or totalAmount' }, { status: 400 });
        }
        const invoice = await prisma.invoice.create({
          data: {
            prescription: { connect: { id: parseInt(prescriptionId) } },
            totalAmount: parseFloat(totalAmount),
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
          return NextResponse.json({ error: 'Missing required fields: invoiceId, reason, amount, or processedById' }, { status: 400 });
        }
        const refund = await prisma.refund.create({
          data: {
            invoice: { connect: { id: parseInt(invoiceId) } },
            reason,
            amount: parseFloat(amount),
            processedBy: { connect: { id: parseInt(processedById) } },
            refundDate: new Date(),
          },
        });
        await prisma.invoice.update({
          where: { id: parseInt(invoiceId) },
          data: { status: 'REFUNDED' },
        });
        return NextResponse.json(refund, { status: 201 });
      }

      case 'dispenseMedication': {
        const { prescriptionId, medicationId, quantity, patientType, dispensedById } = payload;
        if (!prescriptionId || !medicationId || !quantity || !patientType || !dispensedById) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const medication = await prisma.medication.findUnique({
          where: { id: parseInt(medicationId) },
        });
        if (!medication) {
          return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
        }
        if (medication.stockQuantity < quantity) {
          return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }
        const dispensingRecord = await prisma.dispensingRecord.create({
          data: {
            prescription: { connect: { id: parseInt(prescriptionId) } },
            medication: { connect: { id: parseInt(medicationId) } },
            quantity: parseInt(quantity),
            patientType,
            dispensedBy: { connect: { id: parseInt(dispensedById) } },
            dispensedDate: new Date(),
          },
          include: { 
            medication: true, 
            dispensedBy: { select: { name: true } },
            prescription: { include: { patient: { include: { user: { select: { name: true } } } } } },
          },
        });
        await prisma.medication.update({
          where: { id: parseInt(medicationId) },
          data: { stockQuantity: { decrement: parseInt(quantity) } },
        });
        await prisma.prescription.update({
          where: { id: parseInt(prescriptionId) },
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
            stockQuantity: parseInt(stockQuantity),
            minStockThreshold: parseInt(minStockThreshold) || 10,
            price: parseFloat(price),
            expiryDate: new Date(expiryDate),
            supplier: supplierId ? { connect: { id: parseInt(supplierId) } } : undefined,
            formulary: formularyId ? { connect: { id: parseInt(formularyId) } } : undefined,
            narcotic: narcotic || false,
          },
          include: { supplier: true, formulary: true },
        });
        return NextResponse.json(medication, { status: 201 });
      }

      case 'addFormulary': {
        const { name, description } = payload;
        if (!name) {
          return NextResponse.json({ error: 'Missing required fields: name' }, { status: 400 });
        }
        const formulary = await prisma.formulary.create({
          data: { name, description },
          include: { medications: true },
        });
        return NextResponse.json(formulary, { status: 201 });
      }

      case 'createOrder': {
        const { supplierId, items } = payload;
        if (!supplierId || !items || !items.length) {
          return NextResponse.json({ error: 'Missing required fields: supplierId or items' }, { status: 400 });
        }
        const totalAmount = items.reduce((sum, item) => sum + (parseInt(item.quantity) * parseFloat(item.unitPrice)), 0);
        const order = await prisma.purchaseOrder.create({
          data: {
            supplier: { connect: { id: parseInt(supplierId) } },
            totalAmount: parseFloat(totalAmount),
            orderDate: new Date(),
            status: 'PENDING',
            items: {
              create: items.map(item => ({
                medication: { connect: { id: parseInt(item.medicationId) } },
                quantity: parseInt(item.quantity),
                unitPrice: parseFloat(item.unitPrice),
              })),
            },
          },
          include: { 
            supplier: true, 
            items: { include: { medication: true } },
          },
        });
        return NextResponse.json(order, { status: 201 });
      }

      case 'addSupplier': {
        const { name, contact, email, address } = payload;
        if (!name || !email) {
          return NextResponse.json({ error: 'Missing required fields: name or email' }, { status: 400 });
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