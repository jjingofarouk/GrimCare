import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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

export async function GET(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const medication = await prisma.medication.findUnique({
      where: { id: parseInt(id) },
      include: { supplier: true, formulary: true },
    });
    if (medication) return NextResponse.json(medication);

    const prescription = await prisma.prescription.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: { include: { user: { select: { id: true, name: true, email: true } } } },
        doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
        items: { include: { medication: true } },
        dispensingRecords: { include: { medication: true, dispensedBy: { select: { id: true, name: true } } } },
      },
    });
    if (prescription) return NextResponse.json(prescription);

    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  } catch (error) {
    console.error('GET /api/pharmacy/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch resource', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const data = await request.json();
    const { action, payload } = data;

    switch (action) {
      case 'updateMedication': {
        const { name, genericName, category, batchNumber, barcode, rfid, stockQuantity, minStockThreshold, price, expiryDate, supplierId, formularyId, narcotic } = payload;
        if (!name || !category || !batchNumber || !stockQuantity || !price || !expiryDate) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const medication = await prisma.medication.update({
          where: { id: parseInt(id) },
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
            supplier: supplierId ? { connect: { id: parseInt(supplierId) } } : { disconnect: true },
            formulary: formularyId ? { connect: { id: parseInt(formularyId) } } : { disconnect: true },
            narcotic: narcotic || false,
          },
          include: { supplier: true, formulary: true },
        });
        return NextResponse.json(medication);
      }

      case 'updatePrescription': {
        const { status, notes } = payload;
        if (!status) {
          return NextResponse.json({ error: 'Missing required field: status' }, { status: 400 });
        }
        const prescription = await prisma.prescription.update({
          where: { id: parseInt(id) },
          data: {
            status,
            notes,
          },
          include: {
            patient: { include: { user: { select: { id: true, name: true, email: true } } } },
            doctor: { include: { user: { select: { id: true, name: true, email: true } } } },
            items: { include: { medication: true } },
          },
        });
        return NextResponse.json(prescription);
      }

      case 'updatePharmacist': {
        const { name, email, licenseNumber, phone, specialty } = payload;
        if (!name || !email || !licenseNumber) {
          return NextResponse.json({ error: 'Missing required fields: name, email, licenseNumber' }, { status: 400 });
        }
        const pharmacist = await prisma.user.update({
          where: { id: parseInt(id) },
          data: {
            name,
            email,
            doctor: {
              update: {
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
          id: pharmacist.id,
          user: { name: pharmacist.name, email: pharmacist.email },
          licenseNumber: pharmacist.doctor?.licenseNumber || '',
          phone: pharmacist.doctor?.phone || '',
          specialty: pharmacist.doctor?.specialty || '',
        });
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