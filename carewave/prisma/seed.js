// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

// List of real medications with generic names, categories, narcotic status, and descriptions
const realMedications = [
  // Narcotics (40)
  { name: 'Oxycodone', genericName: 'Oxycodone', category: 'Narcotics', narcotic: true, description: 'Opioid analgesic used to treat moderate to severe pain.' },
  { name: 'Morphine', genericName: 'Morphine', category: 'Narcotics', narcotic: true, description: 'Opioid used for severe pain management, often in hospital settings.' },
  { name: 'Fentanyl', genericName: 'Fentanyl', category: 'Narcotics', narcotic: true, description: 'Potent opioid used for chronic pain and surgical anesthesia.' },
  { name: 'Hydrocodone', genericName: 'Hydrocodone', category: 'Narcotics', narcotic: true, description: 'Opioid used for pain relief and cough suppression.' },
  { name: 'Codeine', genericName: 'Codeine', category: 'Narcotics', narcotic: true, description: 'Opioid used for mild to moderate pain and cough relief.' },
  { name: 'Methadone', genericName: 'Methadone', category: 'Narcotics', narcotic: true, description: 'Opioid used for pain management and opioid addiction treatment.' },
  { name: 'Tramadol', genericName: 'Tramadol', category: 'Narcotics', narcotic: true, description: 'Opioid-like analgesic for moderate to severe pain.' },
  { name: 'Buprenorphine', genericName: 'Buprenorphine', category: 'Narcotics', narcotic: true, description: 'Partial opioid agonist for pain and opioid dependence.' },
  { name: 'Hydromorphone', genericName: 'Hydromorphone', category: 'Narcotics', narcotic: true, description: 'Potent opioid for severe pain relief.' },
  { name: 'Meperidine', genericName: 'Meperidine', category: 'Narcotics', narcotic: true, description: 'Opioid used for short-term pain management.' },
  { name: 'Oxymorphone', genericName: 'Oxymorphone', category: 'Narcotics', narcotic: true, description: 'Opioid for severe pain, often in extended-release form.' },
  { name: 'Tapentadol', genericName: 'Tapentadol', category: 'Narcotics', narcotic: true, description: 'Opioid for acute and chronic pain with norepinephrine reuptake inhibition.' },
  { name: 'Sufentanil', genericName: 'Sufentanil', category: 'Narcotics', narcotic: true, description: 'Potent opioid used in anesthesia and pain management.' },
  { name: 'Alfentanil', genericName: 'Alfentanil', category: 'Narcotics', narcotic: true, description: 'Short-acting opioid used in surgical anesthesia.' },
  { name: 'Remifentanil', genericName: 'Remifentanil', category: 'Narcotics', narcotic: true, description: 'Ultra-short-acting opioid for anesthesia.' },
  { name: 'Pentazocine', genericName: 'Pentazocine', category: 'Narcotics', narcotic: true, description: 'Mixed opioid agonist-antagonist for moderate pain.' },
  { name: 'Nalbuphine', genericName: 'Nalbuphine', category: 'Narcotics', narcotic: true, description: 'Opioid agonist-antagonist for pain relief.' },
  { name: 'Butorphanol', genericName: 'Butorphanol', category: 'Narcotics', narcotic: true, description: 'Opioid agonist-antagonist for pain and migraine.' },
  { name: 'Dihydrocodeine', genericName: 'Dihydrocodeine', category: 'Narcotics', narcotic: true, description: 'Opioid for moderate pain and cough suppression.' },
  { name: 'Levorphanol', genericName: 'Levorphanol', category: 'Narcotics', narcotic: true, description: 'Opioid for severe pain with long duration.' },
  // Repeat some narcotics to reach 40
  ...Array.from({ length: 20 }, (_, i) => ({
    name: `${['Oxycodone', 'Morphine', 'Fentanyl', 'Hydrocodone'][i % 4]} (${i + 1})`,
    genericName: `${['Oxycodone', 'Morphine', 'Fentanyl', 'Hydrocodone'][i % 4]}`,
    category: 'Narcotics',
    narcotic: true,
    description: `Opioid analgesic for ${i % 2 === 0 ? 'severe' : 'moderate to severe'} pain management.`,
  })),

  // Non-Narcotics (120)
  { name: 'Amoxicillin', genericName: 'Amoxicillin', category: 'Antibiotics', narcotic: false, description: 'Penicillin antibiotic used to treat bacterial infections.' },
  { name: 'Azithromycin', genericName: 'Azithromycin', category: 'Antibiotics', narcotic: false, description: 'Macrolide antibiotic for respiratory and skin infections.' },
  { name: 'Ciprofloxacin', genericName: 'Ciprofloxacin', category: 'Antibiotics', narcotic: false, description: 'Fluoroquinolone antibiotic for urinary tract and other infections.' },
  { name: 'Doxycycline', genericName: 'Doxycycline', category: 'Antibiotics', narcotic: false, description: 'Tetracycline antibiotic for acne and bacterial infections.' },
  { name: 'Metronidazole', genericName: 'Metronidazole', category: 'Antibiotics', narcotic: false, description: 'Antibiotic for anaerobic bacterial and parasitic infections.' },
  { name: 'Ibuprofen', genericName: 'Ibuprofen', category: 'Analgesics', narcotic: false, description: 'NSAID for pain, inflammation, and fever reduction.' },
  { name: 'Acetaminophen', genericName: 'Acetaminophen', category: 'Analgesics', narcotic: false, description: 'Pain reliever and fever reducer.' },
  { name: 'Aspirin', genericName: 'Acetylsalicylic acid', category: 'Analgesics GESTA', description: 'NSAID for pain, fever, and cardiovascular protection.' },
  { name: 'Metformin', genericName: 'Metformin', category: 'Antidiabetic', narcotic: false, description: 'Biguanide for type 2 diabetes management.' },
  { name: 'Atorvastatin', genericName: 'Atorvastatin', category: 'Statins', narcotic: false, description: 'Statin for cholesterol reduction.' },
  { name: 'Lisinopril', genericName: 'Lisinopril', category: 'Antihypertensive', narcotic: false, description: 'ACE inhibitor for hypertension and heart failure.' },
  { name: 'Losartan', genericName: 'Losartan', category: 'Antihypertensive', narcotic: false, description: 'ARB for blood pressure control.' },
  { name: 'Omeprazole', genericName: 'Omeprazole', category: 'Proton Pump Inhibitor', narcotic: false, description: 'PPI for acid reflux and ulcers.' },
  { name: 'Levothyroxine', genericName: 'Levothyroxine', category: 'Thyroid', narcotic: false, description: 'Thyroid hormone replacement for hypothyroidism.' },
  { name: 'Albuterol', genericName: 'Albuterol', category: 'Bronchodilator', narcotic: false, description: 'Beta-agonist for asthma and COPD.' },
  { name: 'Fluoxetine', genericName: 'Fluoxetine', category: 'Antidepressant', narcotic: false, description: 'SSRI for depression and anxiety.' },
  { name: 'Sertraline', genericName: 'Sertraline', category: 'Antidepressant', narcotic: false, description: 'SSRI for depression, OCD, and PTSD.' },
  { name: 'Gabapentin', genericName: 'Gabapentin', category: 'Anticonvulsant', narcotic: false, description: 'Used for neuropathic pain and seizures.' },
  { name: 'Prednisone', genericName: 'Prednisone', category: 'Corticosteroid', narcotic: false, description: 'Steroid for inflammation and autoimmune conditions.' },
  { name: 'Loratadine', genericName: 'Loratadine', category: 'Antihistamine', narcotic: false, description: 'Non-drowsy antihistamine for allergies.' },
  { name: 'Acyclovir', genericName: 'Acyclovir', category: 'Antiviral', narcotic: false, description: 'Antiviral for herpes virus infections.' },
  { name: 'Oseltamivir', genericName: 'Oseltamivir', category: 'Antiviral', narcotic: false, description: 'Antiviral for influenza treatment and prevention.' },
  { name: 'Warfarin', genericName: 'Warfarin', category: 'Anticoagulant', narcotic: false, description: 'Anticoagulant for blood clot prevention.' },
  { name: 'Clopidogrel', genericName: 'Clopidogrel', category: 'Antiplatelet', narcotic: false, description: 'Antiplatelet for preventing heart attack and stroke.' },
  // Additional non-narcotics (repeat and vary)
  ...Array.from({ length: 96 }, (_, i) => ({
    name: `${
      ['Amoxicillin', 'Ibuprofen', 'Metformin', 'Atorvastatin', 'Lisinopril', 'Omeprazole'][i % 6]
    } (${i + 1})`,
    genericName: `${
      ['Amoxicillin', 'Ibuprofen', 'Metformin', 'Atorvastatin', 'Lisinopril', 'Omeprazole'][i % 6]
    }`,
    category: ['Antibiotics', 'Analgesics', 'Antidiabetic', 'Statins', 'Antihypertensive', 'Proton Pump Inhibitor'][i % 6],
    narcotic: false,
    description: `Used for ${
      ['bacterial infections', 'pain relief', 'diabetes management', 'cholesterol reduction', 'hypertension', 'acid reflux'][i % 6]
    }.`,
  })),
];

async function seed() {
  try {
    console.log('Starting pharmacy data seeding...');

    // Seed Suppliers (20 records)
    const suppliersData = Array.from({ length: 20 }, () => ({
      name: faker.company.name(),
      contact: faker.phone.number(),
      email: `${faker.internet.userName()}@pharmaseed2.com`, // Unique domain
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
    const formulariesData = Array.from({ length: 10 }, () => ({
      name: `${faker.commerce.productAdjective()} Formulary SEED2-${faker.string.nanoid(4)}`,
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

    // Fetch created formularies
    const formularies = await prisma.formulary.findMany();

    // Seed Medications (160 records, 40 narcotics)
    const medicationsData = realMedications.map(med => ({
      name: med.name,
      genericName: med.genericName,
      category: med.category,
      batchNumber: `BATCH-SEED2-${faker.string.alphanumeric(8)}`,
      barcode: `SEED2-BAR-${faker.string.uuid()}`, // Unique barcode
      rfid: med.narcotic ? `SEED2-RFID-${faker.string.uuid()}` : null, // Unique RFID for narcotics
      stockQuantity: faker.number.int({ min: 10, max: 500 }),
      minStockThreshold: faker.number.int({ min: 5, max: 50 }),
      price: parseFloat(faker.commerce.price({ min: 5, max: 200, dec: 2 })),
      expiryDate: faker.date.future({ years: 2 }),
      supplierId: suppliers.length > 0 ? faker.helpers.arrayElement(suppliers).id : null,
      formularyId: formularies.length > 0 ? faker.helpers.arrayElement(formularies).id : null,
      narcotic: med.narcotic,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: med.description, // English description
    }));

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
      const drugInteractionsData = Array.from({ length: 10 }, () => {
        const [med1, med2] = faker.helpers.shuffle(medications).slice(0, 2);
        return {
          medicationId1: med1.id,
          medicationId2: med2.id,
          interaction: `Potential ${faker.lorem.words(3)} interaction between ${med1.name} and ${med2.name}.`,
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