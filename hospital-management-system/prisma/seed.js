const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    await prisma.cSSDLog.deleteMany();
    await prisma.cSSDRequisition.deleteMany();
    await prisma.cSSDRecord.deleteMany();
    await prisma.cSSDInstrument.deleteMany();
    await prisma.fixedAsset.deleteMany();
    await prisma.payroll.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.discharge.deleteMany();
    await prisma.admission.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.ward.deleteMany();
    await prisma.costCenter.deleteMany();
    await prisma.user.deleteMany();
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const doctorNames = [
      'Abaho Abbott', 'Abamukama Robinah', 'Abaasa Michael', 'Aber Elizabeth',
      'Aceng Princess Priscilla', 'Agona Ambrose', 'Ahimbisibwe Gideon',
      'Ainembabazi Rachael', 'Ainomugisha Barbra', 'Akampa Joanita',
      'Arinaitwe Edward', 'Ayieko Allan Mwesigwa', 'Babirye Sheba Balisanyuka',
      'Bukomeko Charles', 'Daniel Mugabe', 'Fred Dratia', 'Ishimwe Mark',
      'Jjingo Farouk', 'Jjuuko Ismail Nakibinge', 'Joshua Opio Ekwamu',
      'Kabagenyi Oliyer Abwooli', 'Kakande Regan', 'Kakembo Jovan',
      'Kalyango Joshua', 'Kamusime Crescent', 'Kasagga Ashraf', 'Katamba Godfrey',
      'Kayondo Brian Simon', 'Kayondo Rabah', 'Kemigabo Mellon',
      'Kiggundu Joseph', 'Kirega Ivan', 'Kirya Joseph', 'Kisitu Joseph',
      'Kitimbo Sawuya', 'Kiweewa Raymond', 'Kiwudhu Jonathan', 'Kuteesakwe David',
      'Labalpiny Joseph', 'Lajja Jesse', 'Letaru Cynthia', 'Lubega Frank',
      'Lubega Jorums Jacob', 'Lulangwa Marvin Mark', 'Lusiba Andrew Kelvin',
      'Lutaaya Elvis', 'Makumbi Musa', 'Maraka Mark Marvin',
      'Masudio Caroline Corine', 'Mayega Esau', 'Mugabe Luke', 'Mugaga Abubakar',
      'Mukonyezi Julius', 'Murungi Daniel', 'Murungi John',
      'Muwaya Emmanuel Joshua', 'Muwugumya Sifuloza', 'Mwebe Timothy',
      'Nagaba Collins', 'Nalwoga Esther', 'Namale Blessed Shadia',
      'Nambasa Betty', 'Namugerwa Mariam', 'Nanyanzi Matildah Rebecca',
      'Nassuna Kevin', 'Ndagano Isaac', 'Ngobi Treva', 'Niwagaba Danson',
      'Niyigena Landry Ildefonse', 'Nomugisha Penelope', 'Ntaate Jonathan Cyrus',
      'Nuwemwiine Isaac', 'Nyinobugaiga Habibah', 'Nzayisenga Vincent',
      'Obedgiu Benjamin Luga', 'Odem Vincent', 'Okello John Emmanuel',
      'Okia Charles Simon', 'Okongel Ruth Peace', 'Oriono Felix', 'Oyala Nathan',
      'Singba Grace Zindo', 'Ssenyonga Edgar Regan', 'Sseruwano Fredrick',
      'Sserwanja Noah', 'Syodo Collins', 'Tugaine Anslem', 'Turyagyenda Joel',
      'Twekwatsemukama Hillary', 'Wafula Hudson', 'Wandukwa Joshua',
      'Wanzunula Gerald', 'Yoramu Shedrack Kissa',
      'Nalubega Esther', 'Mukasa Simon', 'Namugga Ruth',
      'Kyeyune Peter', 'Asiimwe Monica'
    ];

    const patientNames = [
      'Akello Grace', 'Mugisha Brian', 'Auma Sharon', 'Okello Peter',
      'Kato Michael', 'Babirye Joan', 'Nandala Paul', 'Nabirye Faith',
      'Wamala Simon', 'Adoch Patricia', 'Tumwine Daniel', 'Nansubuga Rebecca',
      'Ayebare Kevin', 'Opio Samuel', 'Namutebi Stella', 'Mwesigwa Ronald',
      'Apio Judith', 'Mukama David', 'Namanya Esther', 'Baluku Martin',
      'Atim Carol', 'Kakande James', 'Achieng Sarah', 'Kaggwa Joshua',
      'Kirabo Hope', 'Komakech Joseph', 'Namukasa Lilian', 'Oketcho Allan',
      'Nanyonga Juliet', 'Isabirye Edgar', 'Acio Brenda', 'Kiiza Emmanuel',
      'Nakato Irene', 'Obua Denis', 'Nabukeera Angela', 'Tumuhairwe Clare',
      'Otim Isaac', 'Namirembe Rose', 'Musoke Alex', 'Aciro Mary',
      'Kiggundu Ben', 'Namwanje Ruth', 'Okumu Vincent', 'Kabanda Fred',
      'Nabatanzi Doreen', 'Mwebesa Joshua', 'Anyango Linda', 'Lubega Ronald',
      'Nyangoma Agnes', 'Kibuuka Stephen', 'Laker Susan', 'Kagimu Mark',
      'Abalo Monica', 'Nakyambadde Joan', 'Odong Samuel', 'Nantume Allen',
      'Byaruhanga Collins', 'Ajok Milly', 'Ssali Patrick', 'Atuhaire Sharon',
      'Ocen Robert', 'Namuddu Prossy', 'Baguma Timothy', 'Ajwang Grace',
      'Kakooza Ivan', 'Nakibinge Sarah', 'Olara Benjamin', 'Kanzira Fiona',
      'Okiring Julius', 'Nambalirwa Carol', 'Waiswa Henry', 'Birungi Patience',
      'Oyella Martha', 'Namwanje Shakira', 'Ndibwami Rogers', 'Akech Winnie',
      'Lubwama Martin', 'Namazzi Susan', 'Ojara Jimmy', 'Nabaggala Brenda',
      'Kamba Charles', 'Anyait Lydia', 'Mugalasi Peter', 'Alupo Diana',
      'Nambogo Immaculate', 'Ogwang Patrick', 'Mbabazi Carol', 'Nankya Agnes',
      'Ejang Nelson', 'Kamoga Yusuf', 'Namuli Edith', 'Ochola Benard',
      'Nakiboneka Hadijah', 'Ouma Joseph', 'Nassozi Brenda', 'Mukasa Collins',
      'Akello Brenda', 'Sekabira Isaac', 'Namyalo Peace', 'Ojok Emmanuel'
    ];

    // Users
    const users = [
      ...patientNames.map((name, index) => ({
        email: `patient${index + 1}@example.com`,
        name,
        role: 'PATIENT',
      })),
      ...doctorNames.map((name, index) => ({
        email: `doctor${index + 1}@example.com`,
        name,
        role: 'DOCTOR',
      })),
      { email: 'nurse1@example.com', name: 'Nansamba Jane', role: 'NURSE' },
      { email: 'admin1@example.com', name: 'Okello James', role: 'ADMIN' },
    ];

    const createdUsers = await prisma.$transaction(
      users.map(user =>
        prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            role: user.role,
            password: hashedPassword,
          },
        })
      )
    );

    // Patients
    const patientUsers = createdUsers.filter(user => user.role === 'PATIENT');
    const patients = patientUsers.map((user, index) => ({
      patientId: `P${100000 + index}`,
      dateOfBirth: new Date(1960 + Math.floor(Math.random() * 50), Math.random() * 12, Math.random() * 28),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      phone: `+2567${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: ['Kampala', 'Gulu', 'Mbarara', 'Jinja'][Math.floor(Math.random() * 4)],
      emergencyContact: `Contact ${index + 1}`,
      emergencyContactPhone: `+2567${Math.floor(10000000 + Math.random() * 90000000)}`,
      insuranceProvider: ['AAR', 'UAP', 'Jubilee'][Math.floor(Math.random() * 3)],
      insurancePolicy: `POL${10000 + index}`,
      bloodType: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
      allergies: Math.random() > 0.7 ? 'Peanuts' : null,
      medicalHistory: Math.random() > 0.7 ? 'Hypertension' : null,
      user: { connect: { id: user.id } },
    }));

    const createdPatients = await prisma.$transaction(
      patients.map(patient =>
        prisma.patient.create({
          data: patient,
        })
      )
    );

    // Doctors
    const specialties = [
      'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine',
      'Oncology', 'Dermatology', 'Gastroenterology', 'Endocrinology', 'Pulmonology',
    ];
    const doctorUsers = createdUsers.filter(user => user.role === 'DOCTOR');
    const doctors = doctorUsers.map((user, index) => ({
      doctorId: `D${100000 + index}`,
      specialty: specialties[Math.floor(Math.random() * specialties.length)],
      licenseNumber: `LIC${10000 + index}`,
      phone: `+2567${Math.floor(10000000 + Math.random() * 90000000)}`,
      office: `Room ${index + 101}`,
      user: { connect: { id: user.id } },
    }));

    const createdDoctors = await prisma.$transaction(
      doctors.map(doctor =>
        prisma.doctor.create({
          data: doctor,
        })
      )
    );

    // Wards
    const wards = [
      { name: 'Medical Ward', wardNumber: 'W1001', totalBeds: 30, department: 'General Medicine', location: 'Building A', nurseInCharge: 'Nansamba Jane' },
      { name: 'Surgical Ward', wardNumber: 'W1002', totalBeds: 25, department: 'Surgery', location: 'Building B', nurseInCharge: 'Nansamba Jane' },
      { name: 'Pediatric Ward', wardNumber: 'W1003', totalBeds: 20, department: 'Pediatrics', location: 'Building C', nurseInCharge: 'Nansamba Jane' },
      { name: 'Maternity Ward', wardNumber: 'W1004', totalBeds: 15, department: 'Obstetrics', location: 'Building D', nurseInCharge: 'Nansamba Jane' },
      { name: 'ICU', wardNumber: 'W1005', totalBeds: 10, department: 'Critical Care', location: 'Building E', nurseInCharge: 'Nansamba Jane' },
    ];

    const createdWards = await prisma.$transaction(
      wards.map(ward =>
        prisma.ward.create({
          data: ward,
        })
      )
    );

    // Admissions
    const admissions = Array.from({ length: 20 }, (_, index) => ({
      patientId: createdPatients[Math.floor(Math.random() * createdPatients.length)].id,
      doctorId: createdDoctors[Math.floor(Math.random() * createdDoctors.length)].id,
      wardId: createdWards[Math.floor(Math.random() * createdWards.length)].id,
      admissionDate: new Date(2025, 0, Math.random() * 28 + 1),
      triagePriority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
      triageNotes: `Triage notes for admission ${index + 1}`,
      status: ['PENDING', 'ADMITTED', 'DISCHARGED'][Math.floor(Math.random() * 3)],
      dischargeDate: Math.random() > 0.5 ? new Date(2025, 1, Math.random() * 28 + 1) : null,
      dischargeNotes: Math.random() > 0.5 ? 'Discharged with follow-up' : null,
    }));

    await prisma.$transaction(
      admissions.map(admission =>
        prisma.admission.create({
          data: admission,
        })
      )
    );

    // Discharges
    const discharges = admissions
      .filter(a => a.status === 'DISCHARGED')
      .map((admission, index) => ({
        patientId: admission.patientId,
        doctorId: admission.doctorId,
        dischargeDate: admission.dischargeDate || new Date(2025, 1, Math.random() * 28 + 1),
        dischargeNotes: 'Discharged with medication',
        followUpInstructions: 'Follow-up in 2 weeks',
        medications: 'Paracetamol, Amoxicillin',
      }));

    await prisma.$transaction(
      discharges.map(discharge =>
        prisma.discharge.create({
          data: discharge,
        })
      )
    );

    // Cost Centers
    const costCenters = [
      { name: 'Pharmacy', department: 'Medical Services' },
      { name: 'Laboratory', department: 'Diagnostics' },
      { name: 'Surgical Unit', department: 'Surgery' },
    ];

    const createdCostCenters = await prisma.$transaction(
      costCenters.map(costCenter =>
        prisma.costCenter.create({
          data: costCenter,
        })
      )
    );

    // Transactions
    const transactions = Array.from({ length: 30 }, (_, index) => ({
      description: `Service ${index + 1}`,
      amount: Math.random() * 100000 + 10000,
      category: ['Consultation', 'Lab', 'Pharmacy'][Math.floor(Math.random() * 3)],
      status: ['COMPLETED', 'PENDING'][Math.floor(Math.random() * 2)],
      type: ['REVENUE', 'EXPENSE'][Math.floor(Math.random() * 2)],
      costCenterId: createdCostCenters[Math.floor(Math.random() * createdCostCenters.length)].id,
      patientId: createdPatients[Math.floor(Math.random() * createdPatients.length)].id,
      date: new Date(2025, Math.random() * 5, Math.random() * 28 + 1),
    }));

    await prisma.$transaction(
      transactions.map(transaction =>
        prisma.transaction.create({
          data: transaction,
        })
      )
    );

    // Payrolls
    const payrollUsers = createdUsers.filter(user => ['DOCTOR', 'NURSE', 'ADMIN'].includes(user.role));
    const payrolls = payrollUsers.map((user, index) => ({
      userId: user.id,
      salary: Math.random() * 4000000 + 1000000,
      taxes: Math.random() * 1000000,
      benefits: Math.random() * 500000,
      period: `2025-0${Math.floor(Math.random() * 6) + 1}`,
      status: ['PAID', 'PENDING'][Math.floor(Math.random() * 2)],
    }));

    await prisma.$transaction(
      payrolls.map(payroll =>
        prisma.payroll.create({
          data: payroll,
        })
      )
    );

    // Fixed Assets
    const fixedAssets = [
      { name: 'Ultrasound Machine', purchaseDate: new Date('2023-01-01'), purchaseCost: 20000000, depreciation: 4000000, currentValue: 16000000, status: 'ACTIVE' },
      { name: 'X-Ray Machine', purchaseDate: new Date('2022-06-01'), purchaseCost: 30000000, depreciation: 6000000, currentValue: 24000000, status: 'ACTIVE' },
    ];

    await prisma.$transaction(
      fixedAssets.map(asset =>
        prisma.fixedAsset.create({
          data: asset,
        })
      )
    );

    // CSSD Instruments
    const cssdInstruments = [
      { name: 'Scalpel', serialNumber: 'SC001', type: 'Surgical', status: 'AVAILABLE', stockQuantity: 10, minStockThreshold: 5 },
      { name: 'Forceps', serialNumber: 'FC001', type: 'Surgical', status: 'AVAILABLE', stockQuantity: 15, minStockThreshold: 5 },
    ];

    const createdInstruments = await prisma.$transaction(
      cssdInstruments.map(instrument =>
        prisma.cSSDInstrument.create({
          data: instrument,
        })
      )
    );

    // CSSD Records
    const cssdRecords = createdInstruments.map((instrument, index) => ({
      instrumentId: instrument.id,
      sterilizationDate: new Date(2025, 0, Math.random() * 28 + 1),
      sterilizationMethod: 'Autoclave',
      cycleNumber: `CY${1000 + index}`,
      status: 'STERILIZED',
      qualityCheck: 'Passed',
    }));

    await prisma.$transaction(
      cssdRecords.map(record =>
        prisma.cSSDRecord.create({
          data: record,
        })
      )
    );

    // CSSD Requisitions
    const cssdRequisitions = Array.from({ length: 5 }, (_, index) => ({
      instrumentId: createdInstruments[Math.floor(Math.random() * createdInstruments.length)].id,
      department: ['Surgery', 'Maternity'][Math.floor(Math.random() * 2)],
      requestedBy: payrollUsers[Math.floor(Math.random() * payrollUsers.length)].id,
      quantity: Math.floor(Math.random() * 5) + 1,
      status: ['PENDING', 'APPROVED'][Math.floor(Math.random() * 2)],
    }));

    await prisma.$transaction(
      cssdRequisitions.map(requisition =>
        prisma.cSSDRequisition.create({
          data: requisition,
        })
      )
    );

    // CSSD Logs
    const cssdLogs = Array.from({ length: 10 }, (_, index) => ({
      instrumentId: createdInstruments[Math.floor(Math.random() * createdInstruments.length)].id,
      userId: payrollUsers[Math.floor(Math.random() * payrollUsers.length)].id,
      action: ['STERILIZED', 'ISSUED'][Math.floor(Math.random() * 2)],
      details: `Log entry ${index + 1}`,
    }));

    await prisma.$transaction(
      cssdLogs.map(log =>
        prisma.cSSDLog.create({
          data: log,
        })
      )
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function main() {
  try {
    await resetDatabase();
    await seedDatabase();
  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();