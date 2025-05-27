import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getTransactions() {
  const response = await axios.get(`${API_URL}/api/accounting`);
  return response.data;
}

export async function createTransaction(data) {
  const response = await axios.post(`${API_URL}/api/accounting`, data);
  return response.data;
}

export async function getTransaction(id) {
  const response = await axios.get(`${API_URL}/api/accounting/${id}`);
  return response.data;
}

export async function updateTransaction(id, data) {
  const response = await axios.put(`${API_URL}/api/accounting/${id}`, data);
  return response.data;
}

export async function deleteTransaction(id) {
  const response = await axios.delete(`${API_URL}/api/accounting/${id}`);
  return response.data;
}
