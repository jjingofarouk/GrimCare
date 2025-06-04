import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const authenticate = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export async function GET(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  try {
    switch (resource) {
      case 'prescriptions':
        const prescriptionData = await prisma.prescription.findMany({
          include: {
            patient: { include: { user: { select: { id: true, name: true, email: true } } } },
            doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
            items: { include: { medication: true } },
            dispensingRecords: { include: { medication: true, dispensedBy: { select: { id: true, name: true } } } },
          },
        });
        return NextResponse.json({ prescriptions: prescriptionData });

      case 'inventory':
        const inventoryData = await prisma.medication.findMany({
          include: { supplier: true, formulary: true },
        });
        return NextResponse.json({ inventory: inventoryData });

      case 'suppliers':
        const supplierData = await prisma.supplier.findMany();
        return NextResponse.json({ suppliers: supplierData });

      case 'formularies':
        const formularyData = await prisma.formulary.findMany();
        return NextResponse.json({ formularies: formularyData });

      case 'pharmacists':
        const pharmacistData = await prisma.user.findMany({
          where: { role: 'PHARMACIST' },
          include: {
            doctor: { select: { licenseNumber: true, phone: true, specialty: true } },
          },
        });
        return NextResponse.json({
          pharmacists: pharmacistData.map(u => ({
            id: u.id,
            user: { name: u.name, email: u.email },
            licenseNumber: u.doctor?.licenseNumber || '',
            phone: u.doctor?.phone || '',
            specialty: u.doctor?.specialty || '',
          })),
        });

      default:
        const [prescriptionData, inventoryData, supplierData, formularyData, pharmacistData] = await Promise.all([
          prisma.prescription.findMany({
            include: {
              patient: { include: { user: { select: { id: true, name: true, email: true } } } },
              doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
              items: { include: { medication: true } },
              dispensingRecords: { include: { medication: true, dispensedBy: { select: { id: true, name: true } } } },
            },
          }),
          prisma.medication.findMany({
            include: { supplier: true, formulary: true },
          }),
          prisma.supplier.findMany(),
          prisma.formulary.findMany(),
          prisma.user.findMany({
            where: { role: 'PHARMACIST' },
            include: {
              doctor: { select: { licenseNumber: true, phone: true, specialty: true } },
            },
          }),
        ]);
        return NextResponse.json({
          prescriptions: prescriptionData,
          inventory: inventoryData,
          suppliers: supplierData,
          formularies: formularyData,
          pharmacists: pharmacistData.map(u => ({
            id: u.id,
            user: { name: u.name, email: u.email },
            licenseNumber: u.doctor?.licenseNumber || '',
            phone: u.doctor?.phone || '',
            specialty: u.doctor?.specialty || '',
          })),
        });
    }
  } catch (error) {
    console.error('GET /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to fetch pharmacy data', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { action, payload } = data;

    switch (action) {
      case 'createPrescription': {
        const { patientId, doctorId, notes, items } = payload;
        if (!patientId || !doctorId || !items || !items.length) {
          return NextResponse.json({ error: 'Missing required fields: patientId, doctorId, or items' }, { status: 400 });
        }
        const prescriptionData = await prisma.prescription.create({
          data: {
            patient: { connect: { id: parseInt(patientId) } },
            doctor: { connect: { id: parseInt(doctorId) } },
            notes,
            status: 'PENDING',
            prescriptionDate: new Date(),
            items: {
              create: items.map(item => ({
                medication: { connect: { id: parseInt(item.medicationId) } },
                quantity: parseInt(item.quantity),
                dosage: item.dosage,
                frequency: item.frequency,
                duration: item.duration,
              })),
            },
          },
          include: {
            patient: { include: { user: { select: { id: true, name: true, email: true } } } },
            doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
            items: { include: { medication: true } },
          },
        });
        await prisma.invoice.create({
          data: {
            prescription: { connect: { id: prescriptionData.id } },
            totalAmount: prescriptionData.items.reduce((sum, item) => sum + (item.quantity * item.medication.price), 0),
            status: 'PENDING',
          },
        });
        return NextResponse.json(prescriptionData, { status: 201 });
      }

      case 'dispenseMedication': {
        const { prescriptionId, medicationId, quantity, patientType, dispensedById } = payload;
        if (!prescriptionId || !medicationId || !quantity || !patientType || !dispensedById) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const medicationData = await prisma.medication.findUnique({
          where: { id: parseInt(medicationId) },
        });
        if (!medicationData) {
          return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
        }
        if (medicationData.stockQuantity < quantity) {
          return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }
        const prescriptionData = await prisma.prescription.findUnique({
          where: { id: parseInt(prescriptionId) },
          include: { items: { include: { medication: true } } },
        });
        if (!prescriptionData) {
          return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
        }
        const item = prescriptionData.items.find(i => i.medicationId === parseInt(medicationId));
        if (!item || item.quantity < quantity) {
          return NextResponse.json({ error: 'Invalid quantity for prescription item' }, { status: 400 });
        }
        const dispensingRecord = await prisma.dispensingRecord.create({
          data: {
            prescription: { connect: { id: parseInt(prescriptionId) } },
            medication: { connect: { id: parseInt(medicationId) } },
            quantity: parseInt(quantity),
            patientType,
            dispensedBy: { connect: { id: parseInt(dispensedById) } },
            dispensedDate: new Date(),
            invoice: { connect: { prescriptionId: parseInt(prescriptionId) } },
          },
          include: {
            medication: true,
            dispensedBy: { select: { id: true, name: true } },
            prescription: { include: { patient: { include: { user: { select: { id: true, name: true } } } } } },
          },
        });
        await prisma.medication.update({
          where: { id: parseInt(medicationId) },
          data: { stockQuantity: { decrement: parseInt(quantity) } },
        });
        const totalDispensed = await prisma.dispensingRecord.aggregate({
          _sum: { quantity: true },
          where: { prescriptionId: parseInt(prescriptionId), medicationId: parseInt(medicationId) },
        });
        const allItemsDispensed = prescriptionData.items.every(i => {
          const dispensed = totalDispensed._sum.quantity || 0;
          return dispensed >= i.quantity;
        });
        if (allItemsDispensed) {
          await prisma.prescription.update({
            where: { id: parseInt(prescriptionId) },
            data: { status: 'DISPENSED' },
          });
        }
        return NextResponse.json(dispensingRecord, { status: 201 });
      }

      case 'addMedication': {
        const { name, genericName, category, batchNumber, barcode, rfid, stockQuantity, minStockThreshold, price, expiryDate, supplierId, formularyId, narcotic } = payload;
        if (!name || !category || !batchNumber || !stockQuantity || !price || !expiryDate) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const medicationData = await prisma.medication.create({
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
        return NextResponse.json(medicationData, { status: 201 });
      }

      case 'addFormulary': {
        const { name, description } = payload;
        if (!name) {
          return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
        }
        const formularyData = await prisma.formulary.create({
          data: { name, description },
          include: { medications: true },
        });
        return NextResponse.json(formularyData, { status: 201 });
      }

      case 'addSupplier': {
        const { name, contact, email, address } = payload;
        if (!name || !email) {
          return NextResponse.json({ error: 'Missing required fields: name or email' }, { status: 400 });
        }
        const supplierData = await prisma.supplier.create({
          data: { name, contact, email, address },
        });
        return NextResponse.json(supplierData, { status: 201 });
      }

      case 'addPharmacist': {
        const { name, email, password, licenseNumber, phone, specialty } = payload;
        if (!name || !email || !password || !licenseNumber) {
          return NextResponse.json({ error: 'Missing required fields: name, email, password, or licenseNumber' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const pharmacistData = await prisma.user.create({
          data: {
            name,
            email,
            role: 'PHARMACIST',
            password: hashedPassword,
            doctor: {
              create: {
                doctorId: `PHARM-${Date.now()}`,
                licenseNumber,
                phone,
                specialty: specialty || 'Pharmacy',
              },
            },
          },
          include: {
            doctor: { select: { licenseNumber: true, phone: true, specialty: true } },
          },
        });
        return NextResponse.json({
          id: pharmacistData.id,
          user: { name: pharmacistData.name, email: pharmacistData.email },
          licenseNumber: pharmacistData.doctor?.licenseNumber || '',
          phone: pharmacistData.doctor?.phone || '',
          specialty: pharmacistData.doctor?.specialty || '',
        }, { status: 201 });
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