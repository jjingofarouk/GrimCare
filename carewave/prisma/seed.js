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

    let supplierCount = 0;
    for (const supplier of suppliersData) {
      try {
        await prisma.supplier.create({ data: supplier });
        supplierCount++;
      } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
          console.log(`Skipped duplicate supplier email: ${supplier.email}`);
        } else {
          console.error(`Error creating supplier:`, error);
        }
      }
    }
    console.log(`Seeded ${supplierCount} suppliers`);

    // Fetch created suppliers to use their IDs
    const suppliers = await prisma.supplier.findMany();

    // Seed Formularies (5 records)
    const formulariesData = Array.from({ length: 5 }, () => ({
      name: `${faker.commerce.productAdjective()} Formulary`,
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    let formularyCount = 0;
    for (const formulary of formulariesData) {
      try {
        await prisma.formulary.create({ data: formulary });
        formularyCount++;
      } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
          console.log(`Skipped duplicate formulary name: ${formulary.name}`);
        } else {
          console.error(`Error creating formulary:`, error);
        }
      }
    }
    console.log(`Seeded ${formularyCount} formularies`);

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

    let medicationCount = 0;
    for (const medication of medicationsData) {
      try {
        await prisma.medication.create({ data: medication });
        medicationCount++;
      } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.some(field => ['barcode', 'rfid'].includes(field))) {
          console.log(`Skipped duplicate medication barcode/rfid: ${medication.barcode}/${medication.rfid}`);
        } else {
          console.error(`Error creating medication:`, error);
        }
      }
    }
    console.log(`Seeded ${medicationCount} medications (${medicationCount >= 20 ? 20 : medicationCount} narcotics)`);

    // Fetch created medications to use for drug interactions
    const medications = await prisma.medication.findMany();

    // Seed Drug Interactions (5 records)
    let interactionCount = 0;
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

      for (const interaction of drugInteractionsData) {
        try {
          await prisma.drugInteraction.create({ data: interaction });
          interactionCount++;
        } catch (error) {
          if (error.code === 'P2002' && error.meta?.target?.includes('medicationId1_medicationId2')) {
            console.log(`Skipped duplicate drug interaction: ${interaction.medicationId1}-${interaction.medicationId2}`);
          } else {
            console.error(`Error creating drug interaction:`, error);
          }
        }
      }
      console.log(`Seeded ${interactionCount} drug interactions`);
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