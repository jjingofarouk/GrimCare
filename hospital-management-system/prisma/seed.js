const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.cSSDLog.deleteMany();
  await prisma.cSSDRequisition.deleteMany();
  await prisma.cSSDRecord.deleteMany();
  await prisma.cSSDInstrument.deleteMany();
  await prisma.fixedAsset.deleteMany();
  await prisma.costCenter.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.queue.deleteMany();
  await prisma.doctorAvailability.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.discharge.deleteMany();
  await prisma.admission.deleteMany();
  await prisma.ward.deleteMany();
  await prisma.department.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@hospital.com',
        name: 'Admin User',
        password: '$2b$10$123456789012345678901234567890123456789012345678901234',
        role: 'ADMIN',
      },
      {
        email: 'dr.john@hospital.com',
        name: 'Dr. John Smith',
        password: '$2b$10$123456789012345678901234567890123456789012345678901234',
        role: 'DOCTOR',
      },
      {
        email: 'dr.jane@hospital.com',
        name: 'Dr. Jane Doe',
        password: '$2b$10$123456789012345678901234567890123456789012345678901234',
        role: 'DOCTOR',
      },
      {
        email: 'patient.alice@hospital.com',
        name: 'Alice Johnson',
        password: '$2b$10$123456789012345678901234567890123456789012345678901234',
        role: 'PATIENT',
      },
      {
        email: 'patient.bob@hospital.com',
        name: 'Bob Williams',
        password: '$2b$10$123456789012345678901234567890123456789012345678901234',
        role: 'PATIENT',
      },
      {
        email: 'nurse.emily@hospital.com',
        name: 'Emily Brown',
        password: '$2b$10$123456789012345678901234567890123456789012345678901234',
        role: 'NURSE',
      },
    ],
  });

  // Fetch created users
  const admin = await prisma.user.findUnique({ where: { email: 'admin@hospital.com' } });
  const drJohn = await prisma.user.findUnique({ where: { email: 'dr.john@hospital.com' } });
  const drJane = await prisma.user.findUnique({ where: { email: 'dr.jane@hospital.com' } });
  const alice = await prisma.user.findUnique({ where: { email: 'patient.alice@hospital.com' } });
  const bob = await prisma.user.findUnique({ where: { email: 'patient.bob@hospital.com' } });
  const emily = await prisma.user.findUnique({ where: { email: 'nurse.emily@hospital.com' } });

  // Create Departments
  await prisma.department.createMany({
    data: [
      { name: 'Cardiology', description: 'Heart and vascular care' },
      { name: 'Orthopedics', description: 'Bone and joint care' },
      { name: 'General Medicine', description: 'Primary care services' },
    ],
  });

  const cardiology = await prisma.department.findUnique({ where: { name: 'Cardiology' } });
  const orthopedics = await prisma.department.findUnique({ where: { name: 'Orthopedics' } });

  // Create Doctors
  await prisma.doctor.createMany({
    data: [
      {
        userId: drJohn.id,
        doctorId: 'DOC001',
        specialty: 'Cardiology',
        licenseNumber: 'LIC001',
        phone: '555-0101',
        office: 'Room 101',
        departmentId: cardiology.id,
      },
      {
        userId: drJane.id,
        doctorId: 'DOC002',
        specialty: 'Orthopedics',
        licenseNumber: 'LIC002',
        phone: '555-0102',
        office: 'Room 102',
        departmentId: orthopedics.id,
      },
    ],
  });

  // Create Patients
  await prisma.patient.createMany({
    data: [
      {
        userId: alice.id,
        patientId: 'PAT001',
        dateOfBirth: new Date('1985-05-15'),
        gender: 'Female',
        phone: '555-0201',
        address: '123 Main St',
        emergencyContact: 'Tom Johnson',
        emergencyContactPhone: '555-0202',
        insuranceProvider: 'HealthCare Inc.',
        insurancePolicy: 'POL001',
        bloodType: 'A+',
        allergies: 'Penicillin',
        medicalHistory: 'Hypertension',
      },
      {
        userId: bob.id,
        patientId: 'PAT002',
        dateOfBirth: new Date('1990-08-22'),
        gender: 'Male',
        phone: '555-0203',
        address: '456 Oak Ave',
        emergencyContact: 'Sarah Williams',
        emergencyContactPhone: '555-0204',
        insuranceProvider: 'MediCare',
        insurancePolicy: 'POL002',
        bloodType: 'O-',
        allergies: 'None',
        medicalHistory: 'Asthma',
      },
    ],
  });

  const patientAlice = await prisma.patient.findUnique({ where: { patientId: 'PAT001' } });
  const patientBob = await prisma.patient.findUnique({ where: { patientId: 'PAT002' } });
  const doctorJohn = await prisma.doctor.findUnique({ where: { doctorId: 'DOC001' } });
  const doctorJane = await prisma.doctor.findUnique({ where: { doctorId: 'DOC002' } });

  // Create Wards
  await prisma.ward.createMany({
    data: [
      {
        name: 'Cardiology Ward',
        wardNumber: 'CW001',
        totalBeds: 20,
        occupiedBeds: 5,
        department: 'Cardiology',
        location: 'Building A, Floor 2',
        nurseInCharge: 'Emily Brown',
      },
      {
        name: 'Orthopedic Ward',
        wardNumber: 'OW001',
        totalBeds: 15,
        occupiedBeds: 3,
        department: 'Orthopedics',
        location: 'Building B, Floor 3',
        nurseInCharge: 'Emily Brown',
      },
    ],
  });

  const cardioWard = await prisma.ward.findUnique({ where: { wardNumber: 'CW001' } });

  // Create Admissions
  await prisma.admission.createMany({
    data: [
      {
        patientId: patientAlice.id,
        doctorId: doctorJohn.id,
        wardId: cardioWard.id,
        admissionDate: new Date('2025-06-01'),
        presentingComplaints: 'Chest pain',
        triagePriority: 'High',
        triageNotes: 'Requires immediate attention',
        status: 'ADMITTED',
      },
    ],
  });

  // Create Appointments
  await prisma.appointment.createMany({
    data: [
      {
        patientId: patientAlice.id,
        doctorId: doctorJohn.id,
        departmentId: cardiology.id,
        bookedById: admin.id,
        date: new Date('2025-06-05T10:00:00Z'),
        status: 'SCHEDULED',
        type: 'REGULAR',
        reason: 'Follow-up',
        notes: 'Check blood pressure',
      },
      {
        patientId: patientBob.id,
        doctorId: doctorJane.id,
        departmentId: orthopedics.id,
        bookedById: admin.id,
        date: new Date('2025-06-06T14:00:00Z'),
        status: 'SCHEDULED',
        type: 'REGULAR',
        reason: 'Knee pain',
        notes: 'Review X-ray results',
      },
    ],
  });

  const appointment1 = await prisma.appointment.findFirst({ where: { patientId: patientAlice.id } });
  const appointment2 = await prisma.appointment.findFirst({ where: { patientId: patientBob.id } });

  // Create Queues
  await prisma.queue.createMany({
    data: [
      {
        appointmentId: appointment1.id,
        queueNumber: 1,
        status: 'WAITING',
      },
      {
        appointmentId: appointment2.id,
        queueNumber: 1,
        status: 'WAITING',
      },
    ],
  });

  // Create Doctor Availability
  await prisma.doctorAvailability.createMany({
    data: [
      {
        doctorId: doctorJohn.id,
        startTime: new Date('2025-06-05T08:00:00Z'),
        endTime: new Date('2025-06-05T12:00:00Z'),
        status: 'AVAILABLE',
      },
      {
        doctorId: doctorJane.id,
        startTime: new Date('2025-06-06T13:00:00Z'),
        endTime: new Date('2025-06-06T17:00:00Z'),
        status: 'AVAILABLE',
      },
    ],
  });

  // Create Discharges
  await prisma.discharge.createMany({
    data: [
      {
        patientId: patientAlice.id,
        doctorId: doctorJohn.id,
        dischargeDate: new Date('2025-06-02'),
        dischargeNotes: 'Stable condition',
        followUpInstructions: 'Follow up in 1 week',
        medications: 'Aspirin 75mg daily',
      },
    ],
  });

  // Create Transactions
  await prisma.transaction.createMany({
    data: [
      {
        description: 'Consultation Fee',
        amount: 150.0,
        category: 'Consultation',
        status: 'PAID',
        date: new Date('2025-06-01'),
        type: 'DEBIT',
        patientId: patientAlice.id,
      },
    ],
  });

  // Create Payrolls
  await prisma.payroll.createMany({
    data: [
      {
        userId: drJohn.id,
        salary: 10000.0,
        taxes: 2000.0,
        benefits: 500.0,
        period: '2025-05',
        status: 'PAID',
      },
    ],
  });

  // Create Cost Centers
  await prisma.costCenter.createMany({
    data: [
      { name: 'Cardiology Clinic', department: 'Cardiology' },
    ],
  });

  // Create Fixed Assets
  await prisma.fixedAsset.createMany({
    data: [
      {
        name: 'ECG Machine',
        purchaseDate: new Date('2024-01-15'),
        purchaseCost: 5000.0,
        depreciation: 500.0,
        currentValue: 4500.0,
        status: 'ACTIVE',
      },
    ],
  });

  // Create CSSD Instruments
  await prisma.cSSDInstrument.createMany({
    data: [
      {
        name: 'Scalpel',
        serialNumber: 'SC001',
        type: 'Surgical',
        status: 'AVAILABLE',
        lastSterilized: new Date('2025-05-30'),
        location: 'CSSD Storage',
        stockQuantity: 10,
        minStockThreshold: 2,
      },
    ],
  });

  const scalpel = await prisma.cSSDInstrument.findUnique({ where: { serialNumber: 'SC001' } });

  // Create CSSD Records
  await prisma.cSSDRecord.createMany({
    data: [
      {
        instrumentId: scalpel.id,
        sterilizationDate: new Date('2025-05-30'),
        sterilizationMethod: 'Autoclave',
        cycleNumber: 'CY001',
        status: 'COMPLETED',
        qualityCheck: 'Passed',
        notes: 'Ready for use',
      },
    ],
  });

  const cssdRecord = await prisma.cSSDRecord.findFirst({ where: { instrumentId: scalpel.id } });

  // Create CSSD Requisitions
  await prisma.cSSDRequisition.createMany({
    data: [
      {
        instrumentId: scalpel.id,
        department: 'Cardiology',
        requestedBy: emily.id,
        quantity: 2,
        requestDate: new Date('2025-06-01'),
        status: 'PENDING',
        notes: 'Urgent for surgery',
      },
    ],
  });

  const requisition = await prisma.cSSDRequisition.findFirst({ where: { instrumentId: scalpel.id } });

  // Create CSSD Logs
  await prisma.cSSDLog.createMany({
    data: [
      {
        instrumentId: scalpel.id,
        recordId: cssdRecord.id,
        userId: emily.id,
        action: 'STERILIZED',
        details: 'Instrument sterilized and logged',
      },
      {
        requisitionId: requisition.id,
        userId: emily.id,
        action: 'REQUESTED',
        details: 'Requisition for 2 scalpels',
      },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });