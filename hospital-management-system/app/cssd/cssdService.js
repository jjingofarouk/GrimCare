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
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) throw new Error('Failed to create CSSD record');
  return response.json();
}

export async function updateCssdRecord(id, data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) throw new Error('Failed to update CSSD record');
  return response.json();
}

export async function deleteCssdRecord(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete CSSD record');
  return response.json();
}

export async function getInstruments() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/instruments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch instruments');
  return response.json();
}

export async function createInstrument(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/instruments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) throw new Error('Failed to create instrument');
  return response.json();
}

export async function deleteInstrument(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/instruments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete instrument');
  return response.json();
}

export async function getRequisitions() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/requisitions`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch requisitions');
  return response.json();
}

export async function createRequisition(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/requisitions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) throw new Error('Failed to create requisition');
  return response.json();
}

export async function updateRequisition(id, data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/requisitions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) throw new Error('Failed to update requisition');
  return response.json();
}

export async function deleteRequisition(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/requisitions/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete requisition');
  return response.json();
}

export async function getCssdLogs() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/logs`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch logs');
  return response.json();
}