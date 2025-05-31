// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    await prisma.admission.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.ward.deleteMany();
    await prisma.user.deleteMany();

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user1 = await prisma.user.create({
      data: {
        email: 'patient1@example.com',
        name: 'John Doe',
        password: hashedPassword,
        role: 'PATIENT',
      },
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'doctor1@example.com',
        name: 'Dr. Alice Brown',
        password: hashedPassword,
        role: 'DOCTOR',
      },
    });

    // Seed Patients
    await prisma.patient.create({
      data: {
        userId: user1.id,
        dateOfBirth: new Date('1985-05-15'),
        gender: 'Male',
        phone: '123-456-7890',
      },
    });

    // Seed Doctors
    await prisma.doctor.create({
      data: {
        userId: user2.id,
        specialty: 'Cardiology',
        licenseNumber: 'LIC12345',
      },
    });

    // Seed Wards
    await prisma.ward.create({
      data: {
        name: 'General Ward',
        totalBeds: 20,
        occupiedBeds: 0,
        department: 'General Medicine',
      },
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();