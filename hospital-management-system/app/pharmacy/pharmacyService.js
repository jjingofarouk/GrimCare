// pharmacy/pharmacyService.js
// Comprehensive pharmacy service with backend integration

import { PrismaClient } from '@prisma/client';
import api from '../api';

const prisma = new PrismaClient();

export const getInventory = async () => {
  return await prisma.medication.findMany({
    include: { supplier: true, formulary: true },
  });
};

export const addMedication = async (data) => {
  return await prisma.medication.create({ data });
};

export const updateStock = async (id, stockQuantity) => {
  return await prisma.medication.update({
    where: { id },
    data: { stockQuantity },
  });
};

export const deleteMedication = async (id) => {
  return await prisma.medication.delete({ where: { id } });
};

export const getPrescriptions = async () => {
  return await prisma.prescription.findMany({
    include: { patient: true, doctor: true, items: { include: { medication: true } } },
  });
};

export const createPrescription = async (data) => {
  return await prisma.prescription.create({
    data: {
      ...data,
      items: { create: data.items },
    },
    include: { items: true },
  });
};

export const updatePrescriptionStatus = async (id, status) => {
  return await prisma.prescription.update({
    where: { id },
    data: { status },
  });
};

export const getOrders = async () => {
  return await prisma.purchaseOrder.findMany({
    include: { supplier: true, items: { include: { medication: true } } },
  });
};

export const createOrder = async (data) => {
  return await prisma.purchaseOrder.create({
    data: {
      ...data,
      items: { create: data.items },
    },
    include: { items: true },
  });
};

export const updateOrderStatus = async (id, status) => {
  return await prisma.purchaseOrder.update({
    where: { id },
    data: { status },
  });
};

export const getSuppliers = async () => {
  return await prisma.supplier.findMany();
};

export const addSupplier = async (data) => {
  return await prisma.supplier.create({ data });
};

export const updateSupplier = async (id, data) => {
  return await prisma.supplier.update({
    where: { id },
    data,
  });
};

export const deleteSupplier = async (id) => {
  return await prisma.supplier.delete({ where: { id } });
};

export const generateStockReport = async (timeRange) => {
  const dateFilter = {
    gte: new Date(new Date().setMonth(new Date().getMonth() - (timeRange === 'monthly' ? 1 : timeRange === 'weekly' ? 0.25 : 12))),
  };
  return await prisma.medication.findMany({
    where: { updatedAt: dateFilter },
    select: { name: true, stockQuantity: true, expiryDate: true },
  });
};

export const generateSalesReport = async (timeRange) => {
  const dateFilter = {
    gte: new Date(new Date().setMonth(new Date().getMonth() - (timeRange === 'monthly' ? 1 : timeRange === 'weekly' ? 0.25 : 12))),
  };
  return await prisma.dispensingRecord.findMany({
    where: { dispensedDate: dateFilter },
    include: { medication: true },
  });
};

export const dispenseMedication = async (data) => {
  const { prescriptionId, medicationId, quantity, patientType, dispensedById } = data;
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

  return dispensingRecord;
};

export const processRefund = async (data) => {
  const { invoiceId, reason, amount, processedById } = data;
  return await prisma.refund.create({
    data: {
      invoiceId,
      reason,
      amount,
      processedById,
    },
  });
};

export const createInvoice = async (data) => {
  return await prisma.invoice.create({
    data: {
      prescriptionId: data.prescriptionId,
      totalAmount: data.totalAmount,
      status: data.status || 'PENDING',
      paymentMethod: data.paymentMethod,
      transaction: data.transactionId ? { connect: { id: data.transactionId } } : undefined,
    },
  });
};

export const getStockAlerts = async () => {
  return await prisma.medication.findMany({
    where: { stockQuantity: { lte: prisma.medication.fields.minStockThreshold } },
  });
};

export const addStockAdjustment = async (data) => {
  const { medicationId, quantity, reason, adjustedById } = data;
  const medication = await prisma.medication.findUnique({ where: { id: medicationId } });
  
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
    data: { stockQuantity: medication.stockQuantity + quantity },
  });

  return adjustment;
};

export const getFormularies = async () => {
  return await prisma.formulary.findMany({
    include: { medications: true },
  });
};

export const addFormulary = async (data) => {
  return await prisma.formulary.create({ data });
};

export const checkDrugInteractions = async (medicationIds) => {
  return await prisma.drugInteraction.findMany({
    where: {
      OR: [
        { medicationId1: { in: medicationIds } },
        { medicationId2: { in: medicationIds } },
      ],
    },
    include: { medication1: true, medication2: true },
  });
};

export const trackNarcotic = async (medicationId) => {
  return await prisma.medication.findFirst({
    where: { id: medicationId, narcotic: true },
    include: { dispensingRecords: true, stockAdjustments: true },
  });
};

export const scanBarcode = async (barcode) => {
  return await prisma.medication.findFirst({
    where: { barcode },
    include: { supplier: true, formulary: true },
  });
};