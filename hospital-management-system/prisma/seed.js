const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Ugandan names data
const ugandanNames = {
  male: [
    'Mukasa', 'Ssali', 'Kiprotich', 'Mubiru', 'Katamba', 'Sekandi', 'Lwanga', 'Namugga',
    'Kato', 'Wasswa', 'Nakato', 'Babirye', 'Kyagulanyi', 'Tumwine', 'Museveni', 'Byanyima',
    'Mpuuga', 'Mayanja', 'Ssentamu', 'Mulindwa', 'Kisakye', 'Nalwanga', 'Kiwanuka', 'Ssebunya',
    'Lubega', 'Nambi', 'Kasozi', 'Nsubuga', 'Ddungu', 'Kayongo', 'Mugisha', 'Tumusiime',
    'Byarugaba', 'Ntare', 'Muhwezi', 'Bakabulindi', 'Tushabe', 'Ampaire', 'Mbabazi', 'Kahunde'
  ],
  female: [
    'Nakamya', 'Namukasa', 'Nansubuga', 'Namusoke', 'Namatovu', 'Nakiyingi', 'Nalubega', 'Nakalembe',
    'Nabirye', 'Namugga', 'Nassali', 'Nakitende', 'Namuleme', 'Namusisi', 'Nakayiza', 'Namuddu',
    'Nakabugo', 'Namusoke', 'Nalongo', 'Nakirya', 'Nankabirwa', 'Namaganda', 'Namatende', 'Nakanjako',
    'Nakyeyune', 'Nambi', 'Nakku', 'Nakaweesi', 'Namusaazi', 'Nalwadda', 'Namakula', 'Nakirijja',
    'Nakabuye', 'Namayanja', 'Namusoke', 'Nakayenga', 'Namatovu', 'Nalukwago', 'Nanfuka', 'Nakanwagi'
  ],
  surnames: [
    'Mukasa', 'Ssali', 'Mubiru', 'Katamba', 'Lwanga', 'Kiwanuka', 'Ssebunya', 'Lubega',
    'Kasozi', 'Nsubuga', 'Kayongo', 'Mugisha', 'Tumusiime', 'Byarugaba', 'Ntare', 'Muhwezi',
    'Tushabe', 'Ampaire', 'Mbabazi', 'Kahunde', 'Bakabulindi', 'Mulindwa', 'Kisakye', 'Nalwanga',
    'Mayanja', 'Ssentamu', 'Ddungu', 'Sekandi', 'Namugga', 'Kyagulanyi', 'Tumwine', 'Byanyima'
  ]
};

const specialties = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'Surgery',
  'Internal Medicine', 'Dermatology', 'Psychiatry', 'Radiology', 'Anesthesiology',
  'Emergency Medicine', 'Family Medicine', 'Oncology', 'Urology', 'Ophthalmology'
];

const departments = [
  'Emergency', 'Surgery', 'Pediatrics', 'Maternity', 'Internal Medicine', 'Cardiology',
  'Neurology', 'Orthopedics', 'Radiology', 'Laboratory', 'Pharmacy', 'Outpatient',
  'ICU', 'CCU', 'NICU', 'Dialysis', 'Physiotherapy', 'Dental'
];

const wards = [
  'Medical Ward A', 'Medical Ward B', 'Surgical Ward', 'Pediatric Ward', 'Maternity Ward',
  'ICU', 'CCU', 'HDU', 'Emergency Ward', 'Orthopedic Ward', 'Eye Ward', 'ENT Ward',
  'Psychiatric Ward', 'Isolation Ward', 'Burns Unit', 'Recovery Ward'
];

function getRandomName(gender = null) {
  const genderChoice = gender || (Math.random() > 0.5 ? 'male' : 'female');
  const firstName = ugandanNames[genderChoice][Math.floor(Math.random() * ugandanNames[genderChoice].length)];
  const lastName = ugandanNames.surnames[Math.floor(Math.random() * ugandanNames.surnames.length)];
  return `${firstName} ${lastName}`;
}

function getRandomEmail(name) {
  const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const randomNum = Math.floor(Math.random() * 999);
  return `${cleanName}${randomNum}@${domain}`;
}

function getRandomPhone() {
  const prefixes = ['0700', '0701', '0702', '0703', '0704', '0705', '0750', '0751', '0752', '0753'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${number}`;
}

function getRandomDate(daysBack = 365) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
}

function getRandomFutureDate(daysAhead = 30) {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date;
}

async function generateUniqueId(model, field, prefix = '', length = 6) {
  let id;
  let exists = true;
  
  while (exists) {
    const randomNum = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
    id = `${prefix}${randomNum}`;
    
    const existing = await prisma[model].findFirst({
      where: { [field]: id }
    });
    exists = !!existing;
  }
  
  return id;
}

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Departments
    console.log('📁 Seeding Departments...');
    const createdDepartments = [];
    for (let i = 0; i < departments.length; i++) {
      try {
        const department = await prisma.department.create({
          data: {
            name: departments[i],
            description: `${departments[i]} department providing specialized medical care`
          }
        });
        createdDepartments.push(department);
      } catch (error) {
        if (error.code === 'P2002') {
          // Department already exists, fetch it
          const existing = await prisma.department.findUnique({
            where: { name: departments[i] }
          });
          if (existing) createdDepartments.push(existing);
        }
      }
    }

    // 2. Create Cost Centers
    console.log('💰 Seeding Cost Centers...');
    const createdCostCenters = [];
    for (let i = 0; i < 15; i++) {
      const costCenter = await prisma.costCenter.create({
        data: {
          name: `Cost Center ${i + 1}`,
          department: departments[i % departments.length]
        }
      });
      createdCostCenters.push(costCenter);
    }

    // 3. Create Wards
    console.log('🏥 Seeding Wards...');
    const createdWards = [];
    for (let i = 0; i < wards.length; i++) {
      try {
        const ward = await prisma.ward.create({
          data: {
            name: wards[i],
            wardNumber: `W${(i + 1).toString().padStart(3, '0')}`,
            totalBeds: Math.floor(Math.random() * 20) + 10,
            occupiedBeds: Math.floor(Math.random() * 15),
            department: departments[i % departments.length],
            location: `Floor ${Math.floor(i / 4) + 1}`,
            nurseInCharge: getRandomName('female')
          }
        });
        createdWards.push(ward);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Ward ${wards[i]} already exists, skipping...`);
        }
      }
    }

    // 4. Create Admin Users
    console.log('👤 Seeding Admin Users...');
    const adminUsers = [];
    for (let i = 0; i < 5; i++) {
      const name = getRandomName();
      const email = getRandomEmail(name);
      
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: 'ADMIN'
          }
        });
        adminUsers.push(user);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`User with email ${email} already exists, skipping...`);
        }
      }
    }

    // 5. Create Doctor Users and Doctor records
    console.log('👨‍⚕️ Seeding Doctors...');
    const doctors = [];
    for (let i = 0; i < 35; i++) {
      const name = getRandomName();
      const email = getRandomEmail(name);
      
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: 'DOCTOR'
          }
        });

        const doctorId = await generateUniqueId('doctor', 'doctorId', 'DOC', 6);
        const licenseNumber = await generateUniqueId('doctor', 'licenseNumber', 'LIC', 8);

        const doctor = await prisma.doctor.create({
          data: {
            doctorId,
            specialty: specialties[Math.floor(Math.random() * specialties.length)],
            licenseNumber,
            phone: getRandomPhone(),
            office: `Office ${Math.floor(Math.random() * 200) + 1}`,
            departmentId: createdDepartments.length > 0 ? 
              createdDepartments[Math.floor(Math.random() * createdDepartments.length)].id : null
          }
        });

        // Update user with doctorId
        await prisma.user.update({
          where: { id: user.id },
          data: { doctorId: doctor.id }
        });

        doctors.push(doctor);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Doctor user already exists, skipping...`);
        }
      }
    }

    // 6. Create Patient Users and Patient records
    console.log('🏥 Seeding Patients...');
    const patients = [];
    for (let i = 0; i < 50; i++) {
      const name = getRandomName();
      const email = getRandomEmail(name);
      
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: 'PATIENT'
          }
        });

        const patientId = await generateUniqueId('patient', 'patientId', 'PAT', 6);

        const patient = await prisma.patient.create({
          data: {
            patientId,
            dateOfBirth: getRandomDate(365 * 70), // Up to 70 years ago
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            phone: getRandomPhone(),
            address: `${Math.floor(Math.random() * 1000) + 1} ${['Kampala Road', 'Entebbe Road', 'Jinja Road', 'Masaka Road'][Math.floor(Math.random() * 4)]}, Kampala`,
            emergencyContact: getRandomName(),
            emergencyContactPhone: getRandomPhone(),
            insuranceProvider: ['NSSF', 'AAR', 'Cigna', 'Resolution', 'Jubilee'][Math.floor(Math.random() * 5)],
            insurancePolicy: `POL${Math.floor(Math.random() * 100000)}`,
            bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
            allergies: ['None', 'Penicillin', 'Aspirin', 'Nuts', 'Dairy'][Math.floor(Math.random() * 5)],
            medicalHistory: 'Previous medical conditions documented'
          }
        });

        // Update user with patientId
        await prisma.user.update({
          where: { id: user.id },
          data: { patientId: patient.id }
        });

        patients.push(patient);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Patient user already exists, skipping...`);
        }
      }
    }

    // 7. Create Nurse Users
    console.log('👩‍⚕️ Seeding Nurses...');
    for (let i = 0; i < 30; i++) {
      const name = getRandomName('female');
      const email = getRandomEmail(name);
      
      try {
        await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: 'NURSE'
          }
        });
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Nurse user already exists, skipping...`);
        }
      }
    }

    // 8. Create Doctor Availability
    console.log('📅 Seeding Doctor Availability...');
    for (const doctor of doctors.slice(0, 20)) {
      for (let j = 0; j < 7; j++) { // Next 7 days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + j);
        startDate.setHours(8, 0, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setHours(17, 0, 0, 0);

        await prisma.doctorAvailability.create({
          data: {
            doctorId: doctor.id,
            startTime: startDate,
            endTime: endDate,
            status: Math.random() > 0.1 ? 'AVAILABLE' : 'UNAVAILABLE'
          }
        });
      }
    }

    // 9. Create Appointments
    console.log('📋 Seeding Appointments...');
    const appointments = [];
    for (let i = 0; i < 40; i++) {
      if (patients.length > 0 && doctors.length > 0) {
        const appointment = await prisma.appointment.create({
          data: {
            patientId: patients[Math.floor(Math.random() * patients.length)].id,
            doctorId: doctors[Math.floor(Math.random() * doctors.length)].id,
            departmentId: createdDepartments.length > 0 ? 
              createdDepartments[Math.floor(Math.random() * createdDepartments.length)].id : null,
            date: getRandomFutureDate(60),
            status: ['SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED'][Math.floor(Math.random() * 4)],
            type: ['REGULAR', 'WALK_IN', 'EMERGENCY'][Math.floor(Math.random() * 3)],
            reason: ['Regular checkup', 'Follow-up visit', 'Consultation', 'Emergency care'][Math.floor(Math.random() * 4)],
            notes: 'Patient appointment notes',
            reminderSent: Math.random() > 0.5
          }
        });
        appointments.push(appointment);
      }
    }

    // 10. Create Queue entries
    console.log('📊 Seeding Queue...');
    for (let i = 0; i < Math.min(15, appointments.length); i++) {
      await prisma.queue.create({
        data: {
          appointmentId: appointments[i].id,
          queueNumber: i + 1,
          status: ['WAITING', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 3)]
        }
      });
    }

    // 11. Create Admissions
    console.log('🏨 Seeding Admissions...');
    for (let i = 0; i < 30; i++) {
      if (patients.length > 0 && doctors.length > 0) {
        await prisma.admission.create({
          data: {
            patientId: patients[Math.floor(Math.random() * patients.length)].id,
            doctorId: doctors[Math.floor(Math.random() * doctors.length)].id,
            wardId: createdWards.length > 0 ? 
              createdWards[Math.floor(Math.random() * createdWards.length)].id : null,
            admissionDate: getRandomDate(30),
            scheduledDate: getRandomFutureDate(7),
            presentingComplaints: 'Patient presenting complaints documented',
            triagePriority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)],
            status: ['PENDING', 'ADMITTED', 'DISCHARGED'][Math.floor(Math.random() * 3)]
          }
        });
      }
    }

    // 12. Create Discharges
    console.log('🚪 Seeding Discharges...');
    for (let i = 0; i < 25; i++) {
      if (patients.length > 0 && doctors.length > 0) {
        await prisma.discharge.create({
          data: {
            patientId: patients[Math.floor(Math.random() * patients.length)].id,
            doctorId: doctors[Math.floor(Math.random() * doctors.length)].id,
            dischargeDate: getRandomDate(30),
            dischargeNotes: 'Patient discharged in stable condition',
            followUpInstructions: 'Follow up in 2 weeks',
            medications: 'Prescribed medications as per treatment plan'
          }
        });
      }
    }

    // 13. Create Transactions
    console.log('💳 Seeding Transactions...');
    for (let i = 0; i < 50; i++) {
      await prisma.transaction.create({
        data: {
          description: ['Consultation fee', 'Laboratory test', 'Prescription', 'Surgery fee', 'Room charge'][Math.floor(Math.random() * 5)],
          amount: Math.floor(Math.random() * 500000) + 10000, // 10k to 500k UGX
          category: ['MEDICAL', 'PHARMACY', 'LABORATORY', 'ACCOMMODATION'][Math.floor(Math.random() * 4)],
          status: ['PENDING', 'PAID', 'CANCELLED'][Math.floor(Math.random() * 3)],
          type: ['INCOME', 'EXPENSE'][Math.floor(Math.random() * 2)],
          costCenterId: createdCostCenters.length > 0 ? 
            createdCostCenters[Math.floor(Math.random() * createdCostCenters.length)].id : null,
          patientId: patients.length > 0 && Math.random() > 0.3 ? 
            patients[Math.floor(Math.random() * patients.length)].id : null
        }
      });
    }

    // 14. Create Payrolls
    console.log('💰 Seeding Payrolls...');
    const allUsers = await prisma.user.findMany({
      where: {
        role: { in: ['DOCTOR', 'NURSE', 'ADMIN'] }
      }
    });

    for (let i = 0; i < Math.min(40, allUsers.length); i++) {
      const baseSalary = Math.floor(Math.random() * 3000000) + 500000; // 500k to 3.5M UGX
      await prisma.payroll.create({
        data: {
          userId: allUsers[i].id,
          salary: baseSalary,
          taxes: baseSalary * 0.15,
          benefits: baseSalary * 0.1,
          period: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,
          status: ['PENDING', 'PAID', 'PROCESSING'][Math.floor(Math.random() * 3)]
        }
      });
    }

    // 15. Create Fixed Assets
    console.log('🏗️ Seeding Fixed Assets...');
    const assetNames = [
      'X-Ray Machine', 'CT Scanner', 'MRI Machine', 'Ultrasound Machine', 'ECG Machine',
      'Ventilator', 'Defibrillator', 'Patient Monitor', 'Surgical Table', 'Autoclave',
      'Centrifuge', 'Microscope', 'Anesthesia Machine', 'Dialysis Machine', 'Infusion Pump'
    ];

    for (let i = 0; i < 35; i++) {
      const purchaseDate = getRandomDate(365 * 5); // Up to 5 years ago
      const purchaseCost = Math.floor(Math.random() * 50000000) + 1000000; // 1M to 50M UGX
      const depreciation = purchaseCost * 0.1 * Math.random();
      
      await prisma.fixedAsset.create({
        data: {
          name: `${assetNames[i % assetNames.length]} ${Math.floor(i / assetNames.length) + 1}`,
          purchaseDate,
          purchaseCost,
          depreciation,
          currentValue: purchaseCost - depreciation,
          status: ['ACTIVE', 'MAINTENANCE', 'RETIRED'][Math.floor(Math.random() * 3)]
        }
      });
    }

    // 16. Create CSSD Instruments
    console.log('🔧 Seeding CSSD Instruments...');
    const instrumentNames = [
      'Forceps', 'Scissors', 'Scalpel', 'Retractor', 'Clamp', 'Needle Holder',
      'Suction Tube', 'Catheter', 'Endoscope', 'Probe', 'Curette', 'Elevator'
    ];

    const instruments = [];
    for (let i = 0; i < 40; i++) {
      try {
        const serialNumber = await generateUniqueId('cSSDInstrument', 'serialNumber', 'INS', 8);
        
        const instrument = await prisma.cSSDInstrument.create({
          data: {
            name: `${instrumentNames[i % instrumentNames.length]} ${Math.floor(i / instrumentNames.length) + 1}`,
            serialNumber,
            type: ['SURGICAL', 'DIAGNOSTIC', 'THERAPEUTIC'][Math.floor(Math.random() * 3)],
            status: ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'STERILIZING'][Math.floor(Math.random() * 4)],
            lastSterilized: getRandomDate(7),
            location: `Store Room ${Math.floor(Math.random() * 5) + 1}`,
            stockQuantity: Math.floor(Math.random() * 20) + 1,
            minStockThreshold: Math.floor(Math.random() * 5) + 1
          }
        });
        instruments.push(instrument);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`CSSD Instrument already exists, skipping...`);
        }
      }
    }

    // 17. Create CSSD Records
    console.log('📋 Seeding CSSD Records...');
    const records = [];
    for (let i = 0; i < 35; i++) {
      if (instruments.length > 0) {
        const record = await prisma.cSSDRecord.create({
          data: {
            instrumentId: instruments[Math.floor(Math.random() * instruments.length)].id,
            sterilizationDate: getRandomDate(30),
            sterilizationMethod: ['AUTOCLAVE', 'ETO', 'PLASMA'][Math.floor(Math.random() * 3)],
            cycleNumber: `CYC${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            status: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'][Math.floor(Math.random() * 4)],
            qualityCheck: ['PASSED', 'FAILED', 'PENDING'][Math.floor(Math.random() * 3)],
            notes: 'Sterilization process completed successfully'
          }
        });
        records.push(record);
      }
    }

    // 18. Create CSSD Requisitions
    console.log('📝 Seeding CSSD Requisitions...');
    const requisitions = [];
    for (let i = 0; i < 30; i++) {
      if (instruments.length > 0 && allUsers.length > 0) {
        const requisition = await prisma.cSSDRequisition.create({
          data: {
            instrumentId: instruments[Math.floor(Math.random() * instruments.length)].id,
            department: departments[Math.floor(Math.random() * departments.length)],
            requestedBy: allUsers[Math.floor(Math.random() * allUsers.length)].id,
            quantity: Math.floor(Math.random() * 10) + 1,
            requestDate: getRandomDate(30),
            dispatchDate: Math.random() > 0.5 ? getRandomDate(25) : null,
            status: ['PENDING', 'APPROVED', 'DISPATCHED', 'COMPLETED'][Math.floor(Math.random() * 4)],
            notes: 'Requisition for department use'
          }
        });
        requisitions.push(requisition);
      }
    }

    // 19. Create CSSD Logs
    console.log('📊 Seeding CSSD Logs...');
    for (let i = 0; i < 50; i++) {
      if (allUsers.length > 0) {
        await prisma.cSSDLog.create({
          data: {
            instrumentId: instruments.length > 0 && Math.random() > 0.3 ? 
              instruments[Math.floor(Math.random() * instruments.length)].id : null,
            recordId: records.length > 0 && Math.random() > 0.5 ? 
              records[Math.floor(Math.random() * records.length)].id : null,
            requisitionId: requisitions.length > 0 && Math.random() > 0.5 ? 
              requisitions[Math.floor(Math.random() * requisitions.length)].id : null,
            userId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
            action: ['CREATED', 'UPDATED', 'STERILIZED', 'DISPATCHED', 'RETURNED'][Math.floor(Math.random() * 5)],
            details: 'Action performed on CSSD system'
          }
        });
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`Created records summary:`);
    console.log(`- Departments: ${createdDepartments.length}`);
    console.log(`- Cost Centers: ${createdCostCenters.length}`);
    console.log(`- Wards: ${createdWards.length}`);
    console.log(`- Doctors: ${doctors.length}`);
    console.log(`- Patients: ${patients.length}`);
    console.log(`- Appointments: ${appointments.length}`);
    console.log(`- CSSD Instruments: ${instruments.length}`);
    console.log(`- And many more records across all tables!`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedData()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });