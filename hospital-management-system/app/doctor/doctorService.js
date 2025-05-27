import { API_ROUTES, BASE_URL } from '../api';

export async function getDoctors() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DOCTOR}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return response.json();
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
  return response.json();
}
