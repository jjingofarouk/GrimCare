import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      where: { role: { in: ['PHARMACIST', 'ADMIN'] } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function getPrescriptions() {
  try {
    return await prisma.prescription.findMany({
      where: { status: 'PENDING' },
      include: {
        patient: {
          include: { user: { select: { name: true } } },
        },
        doctor: {
          include: { user: { select: { name: true } } },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw new Error('Failed to fetch prescriptions');
  }
}

export async function createPrescription(data) {
  try {
    return await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        notes: data.notes,
        status: 'PENDING',
        prescriptionDate: new Date(),
      },
      include: {
        patient: {
          include: { user: { select: { name: true } } },
        },
      },
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw new Error('Failed to create prescription');
  }
}

export async function createUser(data) {
  try {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role || 'PHARMACIST',
        password: data.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function dispenseMedication(data) {
  try {
    const medication = await prisma.medication.findUnique({
      where: { id: data.medicationId },
    });

    if (!medication) {
      throw new Error('Medication not found');
    }

    if (medication.stockQuantity < data.quantity) {
      throw new Error('Insufficient stock');
    }

    const dispensingRecord = await prisma.dispensingRecord.create({
      data: {
        prescriptionId: data.prescriptionId,
        medicationId: data.medicationId,
        quantity: data.quantity,
        patientType: data.patientType,
        dispensedById: data.dispensedById,
        dispensedDate: new Date(),
      },
    });

    await prisma.medication.update({
      where: { id: data.medicationId },
      data: { stockQuantity: { decrement: data.quantity } },
    });

    await prisma.prescription.update({
      where: { id: data.prescriptionId },
      data: { status: 'DISPENSED' },
    });

    return dispensingRecord;
  } catch (error) {
    console.error('Error dispensing medication:', error);
    throw new Error(`Failed to dispense medication: ${error.message}`);
  }
}

export async function getInventory() {
  try {
    return await prisma.medication.findMany({
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        minStockThreshold: true,
        price: true,
        expiryDate: true,
        batchNumber: true,
        barcode: true,
        narcotic: true,
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw new Error('Failed to fetch inventory');
  }
}

export async function checkDrugInteractions(medicationIds) {
  try {
    return await prisma.drugInteraction.findMany({
      where: {
        OR: [
          { medicationId1: { in: medicationIds } },
          { medicationId2: { in: medicationIds } },
        ],
      },
      include: {
        medication1: { select: { name: true } },
        medication2: { select: { name: true } },
      },
    });
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    throw new Error('Failed to check drug interactions');
  }
}

export async function createInvoice(data) {
  try {
    return await prisma.invoice.create({
      data: {
        prescriptionId: data.prescriptionId,
        totalAmount: data.totalAmount,
        status: 'PENDING',
        paymentMethod: data.paymentMethod,
      },
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw new Error('Failed to create invoice');
  }
}

export async function processRefund(data) {
  try {
    return await prisma.refund.create({
      data: {
        invoiceId: data.invoiceId,
        reason: data.reason,
        amount: data.amount,
        processedById: data.processedById,
        refundDate: new Date(),
      },
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
}

export async function addMedication(data) {
  try {
    return await prisma.medication.create({
      data: {
        name: data.name,
        genericName: data.genericName,
        category: data.category,
        batchNumber: data.batchNumber,
        barcode: data.barcode,
        rfid: data.rfid,
        stockQuantity: data.stockQuantity,
        minStockThreshold: data.minStockThreshold || 10,
        price: data.price,
        expiryDate: new Date(data.expiryDate),
        supplierId: data.supplierId,
        formularyId: data.formularyId,
        narcotic: data.narcotic || false,
      },
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error('Failed to add medication');
  }
}

export async function updateStock(id, stockQuantity) {
  try {
    return await prisma.medication.update({
      where: { id },
      data: { stockQuantity },
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    throw new Error('Failed to update stock');
  }
}

export async function deleteMedication(id) {
  try {
    return await prisma.medication.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw new Error('Failed to delete medication');
  }
}

export async function getStockAlerts() {
  try {
    return await prisma.medication.findMany({
      where: {
        stockQuantity: { lte: prisma.medication.fields.minStockThreshold },
      },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        minStockThreshold: true,
      },
    });
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    throw new Error('Failed to fetch stock alerts');
  }
}

export async function scanBarcode(barcode) {
  try {
    return await prisma.medication.findFirst({
      where: { barcode },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        price: true,
      },
    });
  } catch (error) {
    console.error('Error scanning barcode:', error);
    throw new Error('Failed to scan barcode');
  }
}

export async function getFormularies() {
  try {
    return await prisma.formulary.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  } catch (error) {
    console.error('Error fetching formularies:', error);
    throw new Error('Failed to fetch formularies');
  }
}

export async function addFormulary(data) {
  try {
    return await prisma.formulary.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  } catch (error) {
    console.error('Error adding formulary:', error);
    throw new Error('Failed to add formulary');
  }
}

export async function getOrders() {
  try {
    return await prisma.purchaseOrder.findMany({
      include: {
        supplier: { select: { name: true } },
        items: {
          include: { medication: { select: { name: true } } },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function createOrder(data) {
  try {
    return await prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        orderDate: new Date(),
        status: 'PENDING',
        totalAmount: data.totalAmount,
        items: {
          create: data.items.map(item => ({
            medicationId: item.medicationId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

export async function updateOrderStatus(id, status) {
  try {
    return await prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
}

export async function getSuppliers() {
  try {
    return await prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        contact: true,
        email: true,
        address: true,
      },
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error('Failed to fetch suppliers');
  }
}

export async function addSupplier(data) {
  try {
    return await prisma.supplier.create({
      data: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
      },
    });
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw new Error('Failed to add supplier');
  }
}

export async function updateSupplier(id, data) {
  try {
    return await prisma.supplier.update({
      where: { id },
      data: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
      },
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw new Error('Failed to update supplier');
  }
}

export async function deleteSupplier(id) {
  try {
    return await prisma.supplier.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw new Error('Failed to delete supplier');
  }
}

export async function trackNarcotic(medicationId) {
  try {
    return await prisma.dispensingRecord.findMany({
      where: {
        medicationId,
        medication: { narcotic: true },
      },
      include: {
        medication: { select: { name: true } },
        dispensedBy: { select: { name: true } },
      },
    });
  } catch (error) {
    console.error('Error tracking narcotic:', error);
    throw new Error('Failed to track narcotic');
  }
}

export async function generateStockReport(timeRange) {
  try {
    const where = timeRange
      ? {
          updatedAt: {
            gte: new Date(timeRange.start),
            lte: new Date(timeRange.end),
          },
        }
      : {};

    return await prisma.medication.findMany({
      where,
      select: {
        name: true,
        stockQuantity: true,
        minStockThreshold: true,
        expiryDate: true,
      },
    });
  } catch (error) {
    console.error('Error generating stock report:', error);
    throw new Error('Failed to generate stock report');
  }
}

export async function generateSalesReport(timeRange) {
  try {
    const where = timeRange
      ? {
          dispensedDate: {
            gte: new Date(timeRange.start),
            lte: new Date(timeRange.end),
          },
        }
      : {};

    return await prisma.dispensingRecord.findMany({
      where,
      include: {
        medication: { select: { name: true, price: true } },
        prescription: { include: { patient: { include: { user: { select: { name: true } } } } } },
      },
    });
  } catch (error) {
    console.error('Error generating sales report:', error);
    throw new Error('Failed to generate sales report');
  }
}