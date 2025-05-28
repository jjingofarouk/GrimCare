
// clinical/clinicalService.js
import { API_ROUTES, BASE_URL } from '../api';

export async function getClinicalRecords() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CLINICAL}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch clinical records');
  return response.json();
}

export async function createClinicalRecord(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CLINICAL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create clinical record');
  return response.json();
}

export async function updateClinicalRecord(id, data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CLINICAL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update clinical record');
  return response.json();
}

export async function deleteClinicalRecord(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CLINICAL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete clinical record');
  return response.json();
}
