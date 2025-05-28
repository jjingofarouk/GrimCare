// appointmentService.js
import { API_ROUTES, BASE_URL } from '../api';

export async function getAppointments() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch appointments');
  return response.json();
}

export async function createAppointment(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      ...data,
      date: new Date(data.date).toISOString(),
    }),
  });
  if (!response.ok) throw new Error('Failed to create appointment');
  return response.json();
}

export async function updateAppointment(id, data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      ...data,
      date: new Date(data.date).toISOString(),
    }),
  });
  if (!response.ok) throw new Error('Failed to update appointment');
  return response.json();
}

export async function getDoctors() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTORS}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return response.json();
}

export async function getPatients() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.PATIENTS}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch patients');
  return response.json();
}
