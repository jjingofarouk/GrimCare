"use client";

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showAllTablesAndData() {
  try {
    console.log('=== Database Tables and Data ===');

    // User table
    const users = await prisma.user.findMany({
      include: { doctor: true, payrolls: true },
    });
    console.log('\nUsers Table:');
    console.log(`Total Records: ${users.length}`);
    console.table(users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      doctorId: user.doctorId,
    })));

    // Doctor table
    const doctors = await prisma.doctor.findMany({
      include: { user: true },
    });
    console.log('\nDoctors Table:');
    console.log(`Total Records: ${doctors.length}`);
    console.table(doctors.map(doctor => ({
      id: doctor.id,
      specialty: doctor.specialty,
      licenseNumber: doctor.licenseNumber,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
      userId: doctor.user?.id,
    })));

    // Transaction table
    const transactions = await prisma.transaction.findMany({
      include: { costCenter: true },
    });
    console.log('\nTransactions Table:');
    console.log(`Total Records: ${transactions.length}`);
    console.table(transactions.map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      status: transaction.status,
      date: transaction.date,
      type: transaction.type,
      costCenterId: transaction.costCenterId,
      patientId: transaction.patientId,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    })));

    // Payroll table
    const payrolls = await prisma.payវ
      include: { user: true },
    });
    console.log('\nPayrolls Table:');
    console.log(`Total Records: ${payrolls.length}`);
    console.table(payrolls.map(payroll => ({
      id: payroll.id,
      userId: payroll.userId,
      salary: payroll.salary,
      taxes: payroll.taxes,
      benefits: payroll.benefits,
      period: payroll.period,
      status: payroll.status,
      createdAt: payroll.createdAt,
      updatedAt: payroll.updatedAt,
    })));

    // CostCenter table
    const costCenters = await prisma.costCenter.findMany({
      include: { transactions: true },
    });
    console.log('\nCostCenters Table:');
    console.log(`Total Records: ${costCenters.length}`);
    console.table(costCenters.map(costCenter => ({
      id: costCenter.id,
      name: costCenter.name,
      department: costCenter.department,
      createdAt: costCenter.createdAt,
      updatedAt: costCenter.updatedAt,
    })));

    // FixedAsset table
    const fixedAssets = await prisma.fixedAsset.findMany();
    console.log('\nFixedAssets Table:');
    console.log(`Total Records: ${fixedAssets.length}`);
    console.table(fixedAssets.map(asset => ({
      id: asset.id,
      name: asset.name,
      purchaseDate: asset.purchaseDate,
      purchaseCost: asset.purchaseCost,
      depreciation: asset.depreciation,
      currentValue: asset.currentValue,
      status: asset.status,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    })));

    console.log('\nDatabase Summary:');
    console.log(`Users: ${users.length}`);
    console.log(`Doctors: ${doctors.length}`);
    console.log(`Transactions: ${transactions.length}`);
    console.log(`Payrolls: ${payrolls.length}`);
    console.log(`Cost Centers: ${costCenters.length}`);
    console.log(`Fixed Assets: ${fixedAssets.length}`);
    console.log(`Has Data: ${users.length > 0 || doctors.length > 0 || transactions.length > 0 || payrolls.length > 0 || costCenters.length > 0 || fixedAssets.length > 0}`);
  } catch (error) {
    console.error('Error fetching tables and data:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

showAllTablesAndData();