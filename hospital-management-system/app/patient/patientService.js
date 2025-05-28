// patientService.js (mock API simulation)

let patientsDB = [
  {
    id: '1',
    patientId: 'UG1001',
    name: 'John Mwanga',
    age: 34,
    gender: 'Male',
    referralCenter: 'Mulago Hospital',
  },
  {
    id: '2',
    patientId: 'UG1002',
    name: 'Grace Nakitende',
    age: 28,
    gender: 'Female',
    referralCenter: 'Mbarara Regional Referral Hospital',
  },
  {
    id: '3',
    patientId: 'UG1003',
    name: 'Samuel Kato',
    age: 45,
    gender: 'Male',
    referralCenter: 'Kampala General Hospital',
  },
  {
    id: '4',
    patientId: 'UG1004',
    name: 'Amina Nakato',
    age: 37,
    gender: 'Female',
    referralCenter: 'Jinja Hospital',
  },
  {
    id: '5',
    patientId: 'UG1005',
    name: 'David Ssekandi',
    age: 52,
    gender: 'Male',
    referralCenter: 'Gulu Regional Referral Hospital',
  },
];

// Simulated delay helper
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getPatients = async () => {
  await delay(300);
  return [...patientsDB];
};

export const getPatientById = async (id) => {
  await delay(200);
  return patientsDB.find((p) => p.id === id) || null;
};

export const createPatient = async (data) => {
  await delay(200);
  const newPatient = { id: String(patientsDB.length + 1), ...data };
  patientsDB.push(newPatient);
  return newPatient;
};

export const updatePatient = async (id, data) => {
  await delay(200);
  const index = patientsDB.findIndex((p) => p.id === id);
  if (index === -1) return null;
  patientsDB[index] = { ...patientsDB[index], ...data };
  return patientsDB[index];
};

export const deletePatient = async (id) => {
  await delay(200);
  const index = patientsDB.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const deleted = patientsDB.splice(index, 1)[0];
  return deleted;
};

export const searchPatients = async (query) => {
  await delay(300);
  const lowerQuery = query.toLowerCase();
  return patientsDB.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.patientId.toLowerCase().includes(lowerQuery)
  );
};

export const getPatientHistory = async (id) => {
  await delay(300);
  const patient = patientsDB.find((p) => p.id === id);
  if (!patient) return [];
  return [
    { date: '2025-01-10', note: `Routine check-up for ${patient.patientId}, stable` },
    { date: '2024-12-05', note: `Treated ${patient.patientId} for malaria` },
  ];
};