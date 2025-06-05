// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

// Real medication data with categories and narcotic flags
const medicationsList = [
  // Non-narcotics (Analgesics, Antibiotics, Antivirals)
  { name: 'Ibuprofen', genericName: 'Ibuprofen', category: 'Analgesics', narcotic: false },
  { name: 'Paracetamol', genericName: 'Acetaminophen', category: 'Analgesics', narcotic: false },
  { name: 'Aspirin', genericName: 'Acetylsalicylic Acid', category: 'Analgesics', narcotic: false },
  { name: 'Naproxen', genericName: 'Naproxen', category: 'Analgesics', narcotic: false },
  { name: 'Amoxicillin', genericName: 'Amoxicillin', category: 'Antibiotics', narcotic: false },
  { name: 'Azithromycin', genericName: 'Azithromycin', category: 'Antibiotics', narcotic: false },
  { name: 'Ciprofloxacin', genericName: 'Ciprofloxacin', category: 'Antibiotics', narcotic: false },
  { name: 'Doxycycline', genericName: 'Doxycycline', category: 'Antibiotics', narcotic: false },
  { name: 'Acyclovir', genericName: 'Acyclovir', category: 'Antivirals', narcotic: false },
  { name: 'Oseltamivir', genericName: 'Oseltamivir', category: 'Antivirals', narcotic: false },
  { name: 'Valacyclovir', genericName: 'Valacyclovir', category: 'Antivirals', narcotic: false },
  { name: 'Zidovudine', genericName: 'Zidovudine', category: 'Antivirals', narcotic: false },
  { name: 'Metformin', genericName: 'Metformin', category: 'Antidiabetics', narcotic: false },
  { name: 'Lisinopril', genericName: 'Lisinopril', category: 'Antihypertensives', narcotic: false },
  { name: 'Amlodipine', genericName: 'Amlodipine', category: 'Antihypertensives', narcotic: false },
  { name: 'Atorvastatin', genericName: 'Atorvastatin', category: 'Statins', narcotic: false },
  // Narcotics
  { name: 'Oxycodone', genericName: 'Oxycodone', category: 'Narcotics', narcotic: true },
  { name: 'Hydrocodone', genericName: 'Hydrocodone', category: 'Narcotics', narcotic: true },
  { name: 'Morphine', genericName: 'Morphine', category: 'Narcotics', narcotic: true },
  { name: 'Fentanyl', genericName: 'Fentanyl', category: 'Narcotics', narcotic: true },
  { name: 'Codeine', genericName: 'Codeine', category: 'Narcotics', narcotic: true },
  { name: 'Tramadol', genericName: 'Tramadol', category: 'Narcotics', narcotic: true },
  { name: 'Diazepam', genericName: 'Diazepam', category: 'Narcotics', narcotic: true },
  { name: 'Alprazolam', genericName: 'Alprazolam', category: 'Narcotics', narcotic: true },
];

// Formulary descriptions
const formularyDescriptions = [
  'Standard formulary for pain management medications.',
  'Antibiotic formulary for common bacterial infections.',
  'Antiviral formulary for viral infection treatment.',
  'Narcotic formulary for controlled substances.',
  'General formulary for chronic disease management.',
  'Emergency formulary for acute care medications.',
  'Pediatric formulary for child-safe medications.',
  'Cardiology formulary for heart-related treatments.',
  'Neurology formulary for neurological disorders.',
  'Primary care formulary for outpatient use.',
];

// Drug interaction descriptions
const interactionDescriptions = [
  'May increase risk of gastrointestinal bleeding when combined.',
  'Concurrent use may enhance sedative effects, causing drowsiness.',
  'Potential for increased toxicity due to metabolic interference.',
  'Combination may reduce efficacy of one or both medications.',
  'Risk of severe hypotension when taken together.',
  'May cause additive respiratory depression in high doses.',
  'Interaction may lead to elevated liver enzyme levels.',
  'Combined use may increase risk of seizures.',
  'Potential for prolonged QT interval, increasing arrhythmia risk.',
  'May alter blood glucose levels when used concurrently.',
];

async function seed() {
  try {
    console.log('Starting pharmacy data seeding...');

    // Seed Suppliers (20 records)
    const suppliersData = Array.from({ length: 20 }, () => ({
      name: `${faker.company.name()} Pharmaceuticals`,
      contact: faker.phone.number(),
      email: `pharma${faker.string.uuid()}@example.com`, // Unique email
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

    // Fetch created suppliers
    const suppliers = await prisma.supplier.findMany();

    // Seed Formularies (10 records)
    const formulariesData = Array.from({ length: 10 }, (_, index) => ({
      name: `Formulary ${String.fromCharCode(65 + index)}`, // Formulary A, B, C, ...
      description: formularyDescriptions[index] || faker.lorem.sentence(),
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

    // Fetch created formularies
    const formularies = await prisma.formulary.findMany();

    // Seed Medications (160 records, 40 narcotics)
    const medicationsData = Array.from({ length: 160 }, (_, index) => {
      // Cycle through medicationsList to create multiple instances
      const baseMed = medicationsList[index % medicationsList.length];
      const isNarcotic = baseMed.narcotic;
      return {
        name: `${baseMed.name} ${faker.string.alphanumeric(3)}`, // Unique suffix
        genericName: baseMed.genericName,
        category: baseMed.category,
        batchNumber: `BATCH2-${faker.string.alphanumeric(8)}`,
        barcode: `SEED2-BAR-${faker.string.uuid()}`, // Unique barcode
        rfid: isNarcotic ? `SEED2-RFID-${faker.string.uuid()}` : null, // Unique RFID for narcotics
        stockQuantity: faker.number.int({ min: 20, max: 1000 }),
        minStockThreshold: faker.number.int({ min: 10, max: 100 }),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 2 })),
        expiryDate: faker.date.future({ years: 3 }),
        supplierId: suppliers.length > 0 ? faker.helpers.arrayElement(suppliers).id : null,
        formularyId: formularies.length > 0 ? faker.helpers.arrayElement(formularies).id : null,
        narcotic: isNarcotic,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    let medicationCount = 0;
    let narcoticCount = 0;
    for (const medication of medicationsData) {
      try {
        await prisma.medication.create({ data: medication });
        medicationCount++;
        if (medication.narcotic) narcoticCount++;
      } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.some(field => ['barcode', 'rfid'].includes(field))) {
          console.log(`Skipped duplicate medication barcode/rfid: ${medication.barcode}/${medication.rfid}`);
        } else {
          console.error(`Error creating medication:`, error);
        }
      }
    }
    console.log(`Seeded ${medicationCount} medications (${narcoticCount} narcotics)`);

    // Fetch created medications
    const medications = await prisma.medication.findMany();

    // Seed Drug Interactions (10 records)
    let interactionCount = 0;
    if (medications.length >= 2) {
      const drugInteractionsData = Array.from({ length: 10 }, (_, index) => {
        const [med1, med2] = faker.helpers.shuffle(medications).slice(0, 2);
        return {
          medicationId1: med1.id,
          medicationId2: med2.id,
          interaction: interactionDescriptions[index] || faker.lorem.sentence(),
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