// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetDatabase() {
  // Delete data in reverse order to avoid foreign key constraints
  await prisma.cSSDLog.deleteMany();
  await prisma.cSSDRequisition.deleteMany();
  await prisma.cSSDRecord.deleteMany();
  await prisma.cSSDInstrument.deleteMany();
  await prisma.fixedAsset.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.costCenter.deleteMany();
  await prisma.queue.deleteMany();
  await prisma.admission.deleteMany();
  await prisma.discharge.deleteMany();
  await prisma.doctorAvailability.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.ward.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database reset successfully.');
}

async function seedDatabase() {
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Cardiology',
        description: 'Heart-related treatments',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Orthopedics',
        description: 'Bone and joint treatments',
      },
    }),
  ]);

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'doctor1@example.com',
        name: 'Dr. John Doe',
        password: hashedPassword,
        role: 'DOCTOR',
      },
    }),
    prisma.user.create({
      data: {
        email: 'patient1@example.com',
        name: 'Jane Smith',
        password: hashedPassword,
        role: 'PATIENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'nurse1@example.com',
        name: 'Nurse Nancy',
        password: hashedPassword,
        role: 'NURSE',
      },
    }),
  ]);

  // Create Doctors
  const doctor = await prisma.doctor.create({
    data: {
      user: { connect: { id: users[1].id } },
      doctorId: 'DOC001',
      specialty: 'Cardiologist',
      licenseNumber: 'LIC12345',
      phone: '123-456-7890',
      office: 'Room 101',
      department: { connect: { id: departments[0].id } },
    },
  });

  // Create Patients
  const patient = await prisma.patient.create({
    data: {
      user: { connect: { id: users[2].id } },
      patientId: 'PAT001',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Female',
      phone: '987-654-3210',
      address: '123 Main St',
      emergencyContact: 'John Smith',
      emergencyContactPhone: '555-555-5555',
      insuranceProvider: 'HealthCorp',
      insurancePolicy: 'POL123456',
      bloodType: 'O+',
      allergies: 'Peanuts',
      medicalHistory: 'Asthma',
    },
  });

  // Create Wards
  const ward = await prisma.ward.create({
    data: {
      name: 'Cardiology Ward',
      wardNumber: 'W001',
      totalBeds: 20,
      occupiedBeds: 5,
      department: 'Cardiology',
      location: 'Building A, Floor 2',
      nurseInCharge: 'Nurse Nancy',
    },
  });

  // Create Appointments
  const appointment = await prisma.appointment.create({
    data: {
      patient: { connect: { id: patient.id } },
      doctor: { connect: { id: doctor.id } },
      department: { connect: { id: departments[0].id } },
      bookedBy: { connect: { id: users[0].id } },
      date: new Date('2025-06-10T10:00:00Z'),
      status: 'SCHEDULED',
      type: 'REGULAR',
      reason: 'Chest pain evaluation',
      notes: 'Patient reports occasional palpitations',
    },
  });

  // Create Queue
  await prisma.queue.create({
    data: {
      appointment: { connect: { id: appointment.id } },
      queueNumber: 1,
      status: 'WAITING',
    },
  });

  // Create Doctor Availability
  await prisma.doctorAvailability.create({
    data: {
      doctor: { connect: { id: doctor.id } },
      startTime: new Date('2025-06-10T09:00:00Z'),
      endTime: new Date('2025-06-10T17:00:00Z'),
      status: 'AVAILABLE',
    },
  });

  // Create Admission
  const admission = await prisma.admission.create({
    data: {
      patient: { connect: { id: patient.id } },
      doctor: { connect: { id: doctor.id } },
      ward: { connect: { id: ward.id } },
      admissionDate: new Date('2025-06-01T08:00:00Z'),
      presentingComplaints: 'Chest pain',
      triagePriority: 'HIGH',
      triageNotes: 'Requires immediate evaluation',
      status: 'ADMITTED',
    },
  });

  // Create Discharge
  await prisma.discharge.create({
    data: {
      patient: { connect: { id: patient.id } },
      doctor: { connect: { id: doctor.id } },
      dischargeDate: new Date('2025-06-05T12:00:00Z'),
      dischargeNotes: 'Patient stable, discharged with medication',
      followUpInstructions: 'Follow up in 2 weeks',
      medications: 'Aspirin 81mg daily',
    },
  });

  // Create Cost Center
  const costCenter = await prisma.costCenter.create({
    data: {
      name: 'Cardiology Services',
      department: 'Cardiology',
    },
  });

  // Create Transaction
  await prisma.transaction.create({
    data: {
      description: 'Consultation Fee',
      amount: 150.0,
      category: 'Consultation',
      status: 'COMPLETED',
      type: 'DEBIT',
      costCenter: { connect: { id: costCenter.id } },
      patient: { connect: { id: patient.id } },
    },
  });

  // Create Payroll
  await prisma.payroll.create({
    data: {
      user: { connect: { id: users[1].id } },
      salary: 5000.0,
      taxes: 1000.0,
      benefits: 500.0,
      period: '2025-06',
      status: 'PAID',
    },
  });

  // Create Fixed Asset
  await prisma.fixedAsset.create({
    data: {
      name: 'ECG Machine',
      purchaseDate: new Date('2024-01-10'),
      purchaseCost: 10000.0,
      depreciation: 2000.0,
      currentValue: 8000.0,
      status: 'ACTIVE',
    },
  });

  // Create CSSD Instrument
  const cssdInstrument = await prisma.cSSDInstrument.create({
    data: {
      name: 'Surgical Scissors',
      serialNumber: 'INST001',
      type: 'Cutting',
      status: 'AVAILABLE',
      lastSterilized: new Date('2025-05-30T10:00:00Z'),
      location: 'CSSD Storage',
      stockQuantity: 10,
      minStockThreshold: 5,
    },
  });

  // Create CSSD Record
  const cssdRecord = await prisma.cSSDRecord.create({
    data: {
      instrument: { connect: { id: cssdInstrument.id } },
      sterilizationDate: new Date('2025-05-30T10:00:00Z'),
      sterilizationMethod: 'Autoclave',
      cycleNumber: 'CYCLE001',
      status: 'COMPLETED',
      qualityCheck: 'Passed',
      notes: 'No issues observed',
    },
  });

  // Create CSSD Requisition
  const cssdRequisition = await prisma.cSSDRequisition.create({
    data: {
      instrument: { connect: { id: cssdInstrument.id } },
      department: 'Cardiology',
      requestedBy: users[1].id,
      quantity: 2,
      status: 'PENDING',
      notes: 'Urgent request for surgery',
    },
  });

  // Create CSSD Log
  await prisma.cSSDLog.create({
    data: {
      instrument: { connect: { id: cssdInstrument.id } },
      record: { connect: { id: cssdRecord.id } },
      requisition: { connect: { id: cssdRequisition.id } },
      user: { connect: { id: users[0].id } },
      action: 'STERILIZATION_COMPLETED',
      details: 'Instrument sterilized and ready for use',
    },
  });

  console.log('Database seeded successfully.');
}

async function main() {
  try {
    console.log('Resetting database...');
    await resetDatabase();
    console.log('Seeding database...');
    await seedDatabase();
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();