import { API_ROUTES, BASE_URL } from '@/api';

export async function getDoctors() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return await response.json();
}

export async function getDoctorById(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch doctor');
  return await response.json();
}

export async function createDoctor(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create doctor');
  return await response.json();
}

export async function updateDoctor(id, data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update doctor');
  return await response.json();
}

export async function deleteDoctor(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to delete doctor');
  return await response.json();
}

export async function getDoctorSchedule(doctorId) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/schedule`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch schedule');
  return await response.json();
}

export async function createSchedule(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${data.doctorId}/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create schedule');
  return await response.json();
}

export async function getAssignedPatients(doctorId) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/patients`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch patients');
  return await response.json();
}

export async function getAppointments(doctorId) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/appointments`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch appointments');
  return await response.json();
}

export async function updateAppointmentStatus(appointmentId, status) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/appointments`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ appointmentId, status }),
  });
  if (!response.ok) throw new Error('Failed to update appointment');
  return await response.json();
}

export async function createPrescription(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${data.doctorId}/prescriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create prescription');
  return await response.json();
}

export async function getPrescriptions(doctorId) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/prescriptions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch prescriptions');
  return await response.json();
}

export async function createCaseNote(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${data.doctorId}/case-notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create case note');
  return await response.json();
}

export async function getCaseNotes(doctorId) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/case-notes`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch case notes');
  return await response.json();
}

export async function createDiagnosticOrder(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${data.doctorId}/diagnostic-orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create diagnostic order');
  return await response.json();
}

export async function getDiagnosticOrders(doctorId) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/diagnostic-orders`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch diagnostic orders');
  return await response.json();
}

export async function createLeaveRequest(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${data.doctorId}/leave-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create leave request');
  return await response.json();
}

export async function getLeaveRequests(doctorId) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/leave-requests`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch leave requests');
  return await response.json();
}

export async function getPerformanceSummary(doctorId, filters) {
  const query = new URLSearchParams(filters).toString();
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/performance?${query}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch performance summary');
  return await response.json();
}
