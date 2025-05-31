const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    const userCount = await prisma.user.count();
    const doctorCount = await prisma.doctor.count();

    console.log('Database Data Check:');
    console.log(`Users: ${userCount}`);
    console.log(`Doctors: ${doctorCount}`);
    console.log(`Has Data: ${userCount > 0 || doctorCount > 0}`);
  } catch (error) {
    console.error('Error checking data:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();