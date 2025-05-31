// prisma/resetAndSeed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    // Delete all data in the correct order to avoid foreign key constraints
    await prisma.admission.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.payroll.deleteMany();
    await prisma.costCenter.deleteMany();
    await prisma.fixedAsset.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.ward.deleteMany();
    await prisma.user.deleteMany();
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const doctorNames = [
      'Abaho Abbott', 'Abamukama Robinah', 'Abaasa Michael', 'Aber Elizabeth',
      'Aceng Princess Priscilla', 'Agona Ambrose', 'Ahimbisibwe Gideon',
      'Ainembabazi Rachael', 'Ainomugisha Barbra', 'Akampa Joanita',
      'Arinaitwe Edward', 'Ayiekoh Allan Mwesigwa', 'Babirye Sheba Balisanyuka',
      'Bukomeko Charles', 'Daniel Mugabe Arinaitwe', 'Fred Dratia', 'Ishimwe Mark',
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
      'Obedgiu Bemjamin Luga', 'Odem Vincent', 'Okello John Emmanuel',
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

    const users = [
      ...patientNames.map((name, index) => ({
        email: `patient${index + 1}@example.com`,
        name,
        role: 'PATIENT'
      })),
      ...doctorNames.map((name, index) => ({
        email: `doctor${index + 1}@example.com`,
        name,
        role: 'DOCTOR'
      })),
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
    const generatePatientId = () => `LMX${Math.floor(100000 + Math.random() * 900000)}`;
    const patientUsers = createdUsers.filter(user => user.role === 'PATIENT');
    const patients = patientUsers.map((user, index) => ({
      userId: user.id,
      dateOfBirth: new Date(1970 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      phone: `256-70${Math.floor(1000000 + Math.random() * 9000000)}`,
      address: ['Kampala', 'Mbarara', 'Gulu', 'Jinja', 'Mbale'][Math.floor(Math.random() * 5)],
      emergencyContact: `256-70${Math.floor(1000000 + Math.random() * 9000000)}`,
      insuranceProvider: ['AAR', 'UAP', 'Jubilee', 'Sanlam', 'ICEA'][Math.floor(Math.random() * 5)],
      insurancePolicy: `${['AAR', 'UAP', 'JUB', 'SAN', 'ICEA'][Math.floor(Math.random() * 5)]}${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: generatePatientId(),
    }));

    const createdPatients = await Promise.all(
      patients.map(patient =>
        prisma.patient.create({
          data: patient,
        })
      )
    );

    // Seed Doctors
    const specialties = [
      'Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine',
      'Oncology', 'Dermatology', 'Gastroenterology', 'Endocrinology', 'Pulmonology',
      'Urology', 'Ophthalmology', 'ENT', 'Rheumatology', 'Nephrology'
    ];
    const doctorUsers = createdUsers.filter(user => user.role === 'DOCTOR');
    const doctors = doctorUsers.map((user, index) => ({
      user: { connect: { id: user.id } },
      specialty: specialties[Math.floor(Math.random() * specialties.length)],
      licenseNumber: `LIC${10001 + index}`
    }));

    const createdDoctors = await Promise.all(
      doctors.map(doctor =>
        prisma.doctor.create({
          data: doctor,
        })
      )
    );

    // Seed Wards
    const wards = [
      { name: 'Medical Ward', totalBeds: 30, occupiedBeds: 0, department: 'General Medicine' },
      { name: 'Surgical Ward', totalBeds: 25, occupiedBeds: 0, department: 'Surgery' },
      { name: 'Pediatric Ward', totalBeds: 20, occupiedBeds: 0, department: 'Pediatrics' },
      { name: 'Maternity Ward', totalBeds: 15, occupiedBeds: 0, department: 'Obstetrics' },
      { name: 'Neonatal Unit (NICU)', totalBeds: 10, occupiedBeds: 0, department: 'Neonatal Care' },
      { name: 'Emergency Department', totalBeds: 12, occupiedBeds: 0, department: 'Emergency' },
      { name: 'Intensive Care Unit (ICU)', totalBeds: 8, occupiedBeds: 0, department: 'Critical Care' },
      { name: 'Orthopedic Ward', totalBeds: 15, occupiedBeds: 0, department: 'Orthopedics' },
      { name: 'Psychiatric Ward', totalBeds: 10, occupiedBeds: 0, department: 'Psychiatry' },
      { name: 'Isolation Ward', totalBeds: 5, occupiedBeds: 0, department: 'Infectious Diseases' },
      { name: 'General Ward', totalBeds: 20, occupiedBeds: 0, department: 'General Medicine' },
    ];

    const createdWards = await Promise.all(
      wards.map(ward =>
        prisma.ward.create({
          data: ward,
        })
      )
    );

    // Seed Admissions
    const admissions = Array.from({ length: 20 }, (_, index) => ({
      patientId: createdPatients[Math.floor(Math.random() * createdPatients.length)].id,
      doctorId: createdDoctors[Math.floor(Math.random() * createdDoctors.length)].id,
      wardId: createdWards[Math.floor(Math.random() * createdWards.length)].id,
      admissionDate: new Date(2025, 4, Math.floor(Math.random() * 30) + 1),
      triagePriority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
      triageNotes: `Patient condition: ${['Stable', 'Critical', 'Moderate'][Math.floor(Math.random() * 3)]}`,
      status: ['ADMITTED', 'PENDING', 'DISCHARGED'][Math.floor(Math.random() * 3)],
      dischargeDate: Math.random() > 0.7 ? new Date(2025, 5, Math.floor(Math.random() * 30) + 1) : null,
      dischargeNotes: Math.random() > 0.7 ? 'Discharged with medication' : null,
    }));

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
      { name: 'Radiology', department: 'Diagnostics' },
      { name: 'Emergency', department: 'Emergency Services' },
    ];

    const createdCostCenters = await Promise.all(
      costCenters.map(costCenter =>
        prisma.costCenter.create({
          data: costCenter,
        })
      )
    );

    // Seed Transactions
    const transactionTypes = ['EXPENSE', 'REVENUE', 'REFUND'];
    const transactionCategories = ['Pharmacy', 'Laboratory', 'Surgery', 'Consultation', 'Radiology'];
    const transactions = Array.from({ length: 50 }, (_, index) => ({
      description: `${transactionCategories[Math.floor(Math.random() * transactionCategories.length)]} for Patient ${Math.floor(Math.random() * 100) + 1}`,
      amount: Math.floor(Math.random() * 500000) + 50000,
      category: transactionCategories[Math.floor(Math.random() * transactionCategories.length)],
      status: ['COMPLETED', 'PENDING', 'FAILED'][Math.floor(Math.random() * 3)],
      type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
      costCenterId: createdCostCenters[Math.floor(Math.random() * createdCostCenters.length)].id,
      patientId: createdPatients[Math.floor(Math.random() * createdPatients.length)].id,
      date: new Date(2025, Math.floor(Math.random() * 5), Math.floor(Math.random() * 30) + 1),
    }));

    await Promise.all(
      transactions.map(transaction =>
        prisma.transaction.create({
          data: transaction,
        })
      )
    );

    // Seed Payrolls
    const payrollUsers = createdUsers.filter(user => ['DOCTOR', 'NURSE', 'ADMIN'].includes(user.role));
    const payrolls = payrollUsers.map((user, index) => ({
      userId: user.id,
      salary: Math.floor(Math.random() * 5000000) + 2000000,
      taxes: Math.floor(Math.random() * 1500000) + 500000,
      benefits: Math.floor(Math.random() * 500000) + 100000,
      period: `2025-0${Math.floor(Math.random() * 5) + 1}`,
      status: ['PAID', 'PENDING'][Math.floor(Math.random() * 2)],
    }));

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
      {
        name: 'X-Ray Machine',
        purchaseDate: new Date('2024-01-10'),
        purchaseCost: 30000000,
        depreciation: 6000000,
        currentValue: 24000000,
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
    throw error;
  } finally {
    await prisma.$disconnect();
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