import { API_ROUTES, BASE_URL } from '../api';

export async function getCssdRecords() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch CSSD records');
  return response.json();
}

export async function createCssdRecord(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create CSSD record');
  return response.json();
}
