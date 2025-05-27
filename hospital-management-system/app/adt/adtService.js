import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getAdmissions() {
  const response = await axios.get(`${API_URL}/api/adt`);
  return response.data;
}

export async function createAdmission(data) {
  const response = await axios.post(`${API_URL}/api/adt`, data);
  return response.data;
}

export async function getAdmission(id) {
  const response = await axios.get(`${API_URL}/api/adt/${id}`);
  return response.data;
}

export async function updateAdmission(id, data) {
  const response = await axios.put(`${API_URL}/api/adt/${id}`, data);
  return response.data;
}

export async function deleteAdmission(id) {
  const response = await axios.delete(`${API_URL}/api/adt/${id}`);
  return response.data;
}