// appointmentService.js
//import { API_ROUTES, BASE_URL } from '../api';

const dummyAppointments = [
  { id: 1, patient: { id: 1, name: "Aisha Nakato" }, doctor: { id: 1, name: "Dr. Musa Kiggundu" }, date: "2025-06-01T09:00:00Z", status: "SCHEDULED", reason: "Consultation", notes: "Fever and headache" },
  { id: 2, patient: { id: 2, name: "John Muwanga" }, doctor: { id: 2, name: "Drt. Sarah Nambooze" }, date: "2025-06-02T10:30:00Z", status: "SCHEDULED", reason: "Routine Checkup", notes: "Annual physical exam" },
  { id: 3, patient: { id: 3, name: "Fatuma Nansamba" }, doctor: { id: 3, name: "Dr. James Ssekitoleko" }, date: "2025-06-03T14:00:00Z", status: "COMPLETED", reason: "Follow-up", notes: "Post-malaria treatment" },
  { id: 4, patient: { id: 4, name: "Peter Okello" }, doctor: { id: 1, name: "Dr. Musa Kiggundu" }, date: "2025-06-04T11:00:00Z", status: "SCHEDULED", reason: "Emergency", notes: "Severe cough" },
  { id: 5, patient: { id: 5, name: "Mary Namusisi" }, doctor: { id: 4, name: "Dr. Esther Namuli" }, date: "2025-06-05T15:30:00Z", status: "CANCELLED", reason: "Consultation", notes: "Cancelled due to travel" },
  { id: 6, patient: { id: 6, name: "Joseph Kizito" }, doctor: { id: 2, name: "Dr. Sarah Nambooze" }, date: "2025-06-06T08:00:00Z", status: "SCHEDULED", reason: "Routine Checkup", notes: "Blood pressure check" },
  { id: 7, patient: { id: 7, name: "Esther Namaganda" }, doctor: { id: 3, name: "Dr. James Ssekitoleko" }, date: "2025-06-07T13:00:00Z", status: "COMPLETED", reason: "Other", notes: "Vaccination follow-up" },
  { id: 8, patient: { id: 8, name: "David Ssentongo" }, doctor: { id: 5, name: "Dr. Grace Akello" }, date: "2025-06-08T16:00:00Z", status: "SCHEDULED", reason: "Consultation", notes: "Stomach pain" },
  { id: 9, patient: { id: 9, name: "Lillian Nakanwagi" }, doctor: { id: 1, name: "Dr. Musa Kiggundu" }, date: "2025-06-09T10:00:00Z", status: "SCHEDULED", reason: "Follow-up", notes: "Diabetes management" },
  { id: 10, patient: { id: 10, name: "Samuel Wasswa" }, doctor: { id: 4, name: "Dr. Esther Namuli" }, date: "2025-06-10T12:30:00Z", status: "CANCELLED", reason: "Emergency", notes: "Cancelled due to emergency" },
  { id: 11, patient: { id: 11, name: "Grace Nabukenya" }, doctor: { id: 2, name: "Dr. Sarah Nambooze" }, date: "2025-06-11T09:30:00Z", status: "SCHEDULED", reason: "Routine Checkup", notes: "General wellness" },
  { id: 12, patient: { id: 12, name: "Moses Kizza" }, doctor: { id: 3, name: "Dr. James Ssekitoleko" }, date: "2025-06-12T14:30:00Z", status: "COMPLETED", reason: "Consultation", notes: "Malaria symptoms" },
  { id: 13, patient: { id: 13, name: "Ruth Namatovu" }, doctor: { id: 5, name: "Dr. Grace Akello" }, date: "2025-06-13T11:30:00Z", status: "SCHEDULED", reason: "Follow-up", notes: "Post-natal check" },
  { id: 14, patient: { id: 14, name: "Isaac Mugerwa" }, doctor: { id: 1, name: "Dr. Musa Kiggundu" }, date: "2025-06-14T15:00:00Z", status: "SCHEDULED", reason: "Emergency", notes: "Chest pain" },
  { id: 15, patient: { id: 15, name: "Sarah Nankya" }, doctor: { id: 4, name: "Dr. Esther Namuli" }, date: "2025-06-15T08:30:00Z", status: "COMPLETED", reason: "Routine Checkup", notes: "Eye examination" },
  { id: 16, patient: { id: 16, name: "Thomas Ssemakula" }, doctor: { id: 2, name: "Dr. Sarah Nambooze" }, date: "2025-06-16T10:00:00Z", status: "SCHEDULED", reason: "Consultation", notes: "Skin rash" },
  { id: 17, patient: { id: 17, name: "Jane Namubiru" }, doctor: { id: 3, name: "Dr. James Ssekitoleko" }, date: "2025-06-17T13:30:00Z", status: "CANCELLED", reason: "Other", notes: "Cancelled due to scheduling conflict" },
  { id: 18, patient: { id: 18, name: "Patrick Ssebulime" }, doctor: { id: 5, name: "Dr. Grace Akello" }, date: "2025-06-18T16:30:00Z", status: "SCHEDULED", reason: "Follow-up", notes: "Hypertension monitoring" },
  { id: 19, patient: { id: 19, name: "Christine Nansubuga" }, doctor: { id: 1, name: "Dr. Musa Kiggundu" }, date: "2025-06-19T09:00:00Z", status: "SCHEDULED", reason: "Consultation", notes: "Joint pain" },
  { id: 20, patient: { id: 20, name: "Emmanuel Kigozi" }, doctor: { id: 4, name: "Dr. Esther Namuli" }, date: "2025-06-20T12:00:00Z", status: "COMPLETED", reason: "Routine Checkup", notes: "Dental check" },
];

const dummyDoctors = [
  { id: 1, name: "Dr. Musa Kiggundu", specialization: "General Practitioner" },
  { id: 2, name: "Dr. Sarah Nambooze", specialization: "Pediatrician" },
  { id: 3, name: "Dr. James Ssekitoleko", specialization: "Internal Medicine" },
  { id: 4, name: "Dr. Esther Namuli", specialization: "Gynecologist" },
  { id: 5, name: "Dr. Grace Akello", specialization: "Cardiologist" },
];

const dummyPatients = [
  { id: 1, name: "Aisha Nakato" },
  { id: 2, name: "John Muwanga" },
  { id: 3, name: "Fatuma Nansamba" },
  { id: 4, name: "Peter Okello" },
  { id: 5, name: "Mary Namusisi" },
  { id: 6, name: "Joseph Kizito" },
  { id: 7, name: "Esther Namaganda" },
  { id: 8, name: "David Ssentongo" },
  { id: 9, name: "Lillian Nakanwagi" },
  { id: 10, name: "Samuel Wasswa" },
  { id: 11, name: "Grace Nabukenya" },
  { id: 12, name: "Moses Kizza" },
  { id: 13, name: "Ruth Namatovu" },
  { id: 14, name: "Isaac Mugerwa" },
  { id: 15, name: "Sarah Nankya" },
  { id: 16, name: "Thomas Ssemakula" },
  { id: 17, name: "Jane Namubiru" },
  { id: 18, name: "Patrick Ssebulime" },
  { id: 19, name: "Christine Nansubuga" },
  { id: 20, name: "Emmanuel Kigozi" },
];

export async function getAppointments() {
  return Promise.resolve(dummyAppointments);
}

export async function createAppointment(data) {
  const newAppointment = {
    id: dummyAppointments.length + 1,
    patient: dummyPatients.find((p) => p.id === parseInt(data.patientId)),
    doctor: dummyDoctors.find((d) => d.id === parseInt(data.doctorId)),
    date: new Date(data.date).toISOString(),
    status: data.status || "SCHEDULED",
    reason: data.reason,
    notes: data.notes,
  };
  dummyAppointments.push(newAppointment);
  return Promise.resolve(newAppointment);
}

export async function updateAppointment(id, data) {
  const index = dummyAppointments.findIndex((appt) => appt.id === parseInt(id));
  if (index === -1) throw new Error('Appointment not found');
  dummyAppointments[index] = {
    ...dummyAppointments[index],
    patient: dummyPatients.find((p) => p.id === parseInt(data.patientId)) || dummyAppointments[index].patient,
    doctor: dummyDoctors.find((d) => d.id === parseInt(data.doctorId)) || dummyAppointments[index].doctor,
    date: new Date(data.date).toISOString(),
    status: data.status || dummyAppointments[index].status,
    reason: data.reason || dummyAppointments[index].reason,
    notes: data.notes || dummyAppointments[index].notes,
  };
  return Promise.resolve(dummyAppointments[index]);
}

export async function getDoctors() {
  return Promise.resolve(dummyDoctors);
}

export async function getPatients() {
  return Promise.resolve(dummyPatients);
}