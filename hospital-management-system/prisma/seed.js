const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    await prisma.admission.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.payroll.deleteMany();
    await prisma.costCenter.deleteMany();
    await prisma.fixedAsset.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.ward.deleteMany();
    await prisma.user.deleteMany();

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      { email: 'nakato@example.com', name: 'Nakato Sarah', role: 'PATIENT' },
      { email: 'mugisha@example.com', name: 'Mugisha David', role: 'PATIENT' },
      { email: 'nabirye@example.com', name: 'Nabirye Grace', role: 'PATIENT' },
      { email: 'tumusiime@example.com', name: 'Tumusiime Joseph', role: 'PATIENT' },
      { email: 'kato@example.com', name: 'Kato Emmanuel看', role: 'PATIENT' },
      { email: 'dr.nalubega@example.com', name: 'Dr. Nalubega Esther', role: 'DOCTOR' },
      { email: 'dr.mukasa@example.com', name: 'Dr. Mukasa Simon', role: 'DOCTOR' },
      { email: 'dr.namugga@example.com', name: 'Dr. Namugga Ruth', role: 'DOCTOR' },
      { email: 'dr.kyeyune@example.com', name: 'Dr. Kyeyune Peter', role: 'DOCTOR' },
      { email: 'dr.asiimwe@example.com', name: 'Dr. Asiimwe Monica', role: 'DOCTOR' },
      { email: 'nurse.nansamba@example.com', name: 'Nansamba Jane', role: 'NURSE' },
      { email: 'admin.okello@example.com', name: 'Okello James', role: 'ADMIN' },
    ];

    const createdUsers = await Promise.all(
      users.map(user =>
        prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            password: hashedPassword,
            role: user.role,
          },
        })
      )
    );

    // Seed Patients
    const patients = [
      { userId: createdUsers[0].id, dateOfBirth: new Date('1990-03-12'), gender: 'Female', phone: '256-700-123456', address: 'Kampala', emergencyContact: '256-700-654321', insuranceProvider: 'AAR', insurancePolicy: 'AAR12345' },
      { userId: createdUsers[1].id, dateOfBirth: new Date('1985-07-22'), gender: 'Male', phone: '256-701-234567', address: 'Mbarara', emergencyContact: '256-701-765432', insuranceProvider: 'UAP', insurancePolicy: 'UAP67890' },
      { userId: createdUsers[2].id, dateOfBirth: new Date('1995-11-05'), gender: 'Female', phone: '256-702-345678', address: 'Gulu', emergencyContact: '256-702-876543', insuranceProvider: 'Jubilee', insurancePolicy: 'JUB11223' },
      { userId: createdUsers[3].id, dateOfBirth: new Date('1988-01-15'), gender: 'Male', phone: '256-703-456789', address: 'Jinja', emergencyContact: '256-703-987654', insuranceProvider: 'Sanlam', insurancePolicy: 'SAN44556' },
      { userId: createdUsers[4].id, dateOfBirth: new Date('1992-09-30'), gender: 'Male', phone: '256-704-567890', address: 'Mbale', emergencyContact: '256-704-098765', insuranceProvider: 'ICEA', insurancePolicy: 'ICEA77889' },
    ];

    const createdPatients = await Promise.all(
      patients.map(patient =>
        prisma.patient.create({
          data: patient,
        })
      )
    );

    // Seed Doctors
    const doctors = [
      { userId: createdUsers[5].id, specialty: 'Cardiology', licenseNumber: 'LIC10001' },
      { userId: createdUsers[6].id, specialty: 'Pediatrics', licenseNumber: 'LIC10002' },
      { userId: createdUsers[7].id, specialty: 'Orthopedics', licenseNumber: 'LIC10003' },
      { userId: createdUsers[8].id, specialty: 'Neurology', licenseNumber: 'LIC10004' },
      { userId: createdUsers[9].id, specialty: 'General Medicine', licenseNumber: 'LIC10005' },
    ];

    const createdDoctors = await Promise.all(
      doctors.map(doctor =>
        prisma.doctor.create({
          data: doctor,
        })
      )
    );

    // Seed Wards
    const wards = [
      { name: 'General Ward', totalBeds: 20, occupiedBeds: 0, department: 'General Medicine' },
      { name: 'Maternity Ward', totalBeds: 15, occupiedBeds: 0, department: 'Obstetrics' },
      { name: 'Pediatric Ward', totalBeds: 10, occupiedBeds: 0, department: 'Pediatrics' },
      { name: 'Surgical Ward', totalBeds: 12, occupiedBeds: 0, department: 'Surgery' },
      { name: 'ICU', totalBeds: 8, occupiedBeds: 0, department: 'Critical Care' },
    ];

    const createdWards = await Promise.all(
      wards.map(ward =>
        prisma.ward.create({
          data: ward,
        })
      )
    );

    // Seed Admissions
    const admissions = [
      {
        patientId: createdPatients[0].id,
        doctorId: createdDoctors[0].id,
        wardId: createdWards[0].id,
        admissionDate: new Date('2025-05-01'),
        triagePriority: 'MEDIUM',
        triageNotes: 'Chest pain, requires monitoring',
        status: 'ADMITTED',
      },
      {
        patientId: createdPatients[1].id,
        doctorId: createdDoctors[1].id,
        wardId: createdWards[2].id,
        admissionDate: new Date('2025-05-10'),
        triagePriority: 'HIGH',
        triageNotes: 'Fever and cough, suspected pneumonia',
        status: 'ADMITTED',
      },
      {
        patientId: createdPatients[2].id,
        doctorId: createdDoctors[2].id,
        wardId: createdWards[3].id,
        admissionDate: new Date('2025-05-15'),
        scheduledDate: new Date('2025-05-14'),
        preAdmissionNotes: 'Scheduled for surgery',
        triagePriority: 'LOW',
        status: 'PENDING',
      },
    ];

    await Promise.all(
      admissions.map(admission =>
        prisma.admission.create({
          data: admission,
        })
      )
    );

    // Seed CostCenters
    const costCenters = [
      { name: 'Pharmacy', department: 'Medical Services' },
      { name: 'Laboratory', department: 'Diagnostics' },
      { name: 'Surgical Unit', department: 'Surgery' },
    ];

    const createdCostCenters = await Promise.all(
      costCenters.map(costCenter =>
        prisma.costCenter.create({
          data: costCenter,
        })
      )
    );

    // Seed Transactions
    const transactions = [
      {
        description: 'Medication for Nakato Sarah',
        amount: 150000,
        category: 'Pharmacy',
        status: 'COMPLETED',
        type: 'EXPENSE',
        costCenterId: createdCostCenters[0].id,
        patientId: createdPatients[0].id,
        date: new Date('2025-05-02'),
      },
      {
        description: 'Lab test for Mugisha David',
        amount: 200000,
        category: 'Laboratory',
        status: 'PENDING',
        type: 'EXPENSE',
        costCenterId: createdCostCenters[1].id,
        patientId: createdPatients[1].id,
        date: new Date('2025-05-11'),
      },
    ];

    await Promise.all(
      transactions.map(transaction =>
        prisma.transaction.create({
          data: transaction,
        })
      )
    );

    // Seed Payrolls
    const payrolls = [
      {
        userId: createdUsers[5].id,
        salary: 5000000,
        taxes: 1500000,
        benefits: 500000,
        period: '2025-05',
        status: 'PAID',
      },
      {
        userId: createdUsers[10].id,
        salary: 3000000,
        taxes: 900000,
        benefits: 300000,
        period: '2025-05',
        status: 'PENDING',
      },
    ];

    await Promise.all(
      payrolls.map(payroll =>
        prisma.payroll.create({
          data: payroll,
        })
      )
    );

    // Seed FixedAssets
    const fixedAssets = [
      {
        name: 'Ultrasound Machine',
        purchaseDate: new Date('2023-06-01'),
        purchaseCost: 25000000,
        depreciation: 5000000,
        currentValue: 20000000,
        status: 'ACTIVE',
      },
      {
        name: 'Surgical Table',
        purchaseDate: new Date('2022-09-15'),
        purchaseCost: 15000000,
        depreciation: 4500000,
        currentValue: 10500000,
        status: 'ACTIVE',
      },
    ];

    await Promise.all(
      fixedAssets.map(asset =>
        prisma.fixedAsset.create({
          data: asset,
        })
      )
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();