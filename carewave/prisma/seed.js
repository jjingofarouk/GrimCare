// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting pharmacy data seeding...');

    // Seed Suppliers (10 records)
    const suppliersData = Array.from({ length: 10 }, () => ({
      name: faker.company.name(),
      contact: faker.phone.number(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await prisma.supplier.createMany({
      data: suppliersData,
      skipDuplicates: true, // Avoid duplicating emails
    });
    console.log('Seeded 10 suppliers');

    // Fetch created suppliers to use their IDs
    const suppliers = await prisma.supplier.findMany();

    // Seed Formularies (5 records)
    const formulariesData = Array.from({ length: 5 }, () => ({
      name: `${faker.commerce.productAdjective()} Formulary`,
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await prisma.formulary.createMany({
      data: formulariesData,
      skipDuplicates: true, // Avoid duplicating names
    });
    console.log('Seeded 5 formularies');

    // Fetch created formularies to use their IDs
    const formularies = await prisma.formulary.findMany();

    // Seed Medications (80 records, 20 narcotics)
    const medicationsData = Array.from({ length: 80 }, (_, index) => {
      const isNarcotic = index < 20; // First 20 are narcotics
      const drugName = faker.commerce.productName();
      return {
        name: drugName,
        genericName: isNarcotic ? `Generic ${drugName}` : null,
        category: isNarcotic ? 'Narcotics' : faker.helpers.arrayElement(['Analgesics', 'Antibiotics', 'Antivirals']),
        batchNumber: `BATCH-${faker.string.alphanumeric(8)}`,
        barcode: `BAR-${faker.string.uuid()}`, // Unique barcode
        rfid: isNarcotic ? `RFID-${faker.string.uuid()}` : null, // Unique RFID for narcotics
        stockQuantity: faker.number.int({ min: 10, max: 500 }),
        minStockThreshold: faker.number.int({ min: 5, max: 50 }),
        price: parseFloat(faker.commerce.price({ min: 5, max: 200, dec: 2 })),
        expiryDate: faker.date.future({ years: 2 }),
        supplierId: suppliers.length > 0 ? faker.helpers.arrayElement(suppliers).id : null,
        formularyId: formularies.length > 0 ? faker.helpers.arrayElement(formularies).id : null,
        narcotic: isNarcotic,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await prisma.medication.createMany({
      data: medicationsData,
      skipDuplicates: true, // Avoid duplicating barcodes and RFIDs
    });
    console.log('Seeded 80 medications (20 narcotics)');

    // Fetch created medications to use for drug interactions
    const medications = await prisma.medication.findMany();

    // Seed Drug Interactions (5 records)
    if (medications.length >= 2) {
      const drugInteractionsData = Array.from({ length: 5 }, () => {
        const [med1, med2] = faker.helpers.shuffle(medications).slice(0, 2); // Random pair
        return {
          medicationId1: med1.id,
          medicationId2: med2.id,
          interaction: faker.lorem.sentence(),
          severity: faker.helpers.arrayElement(['LOW', 'MODERATE', 'HIGH']),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      await prisma.drugInteraction.createMany({
        data: drugInteractionsData,
        skipDuplicates: true, // Avoid duplicating medication pairs
      });
      console.log('Seeded 5 drug interactions');
    } else {
      console.log('Skipped drug interactions: not enough medications');
    }

    console.log('Pharmacy data seeding completed successfully');
  } catch (error) {
    console.error('Error seeding pharmacy data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });