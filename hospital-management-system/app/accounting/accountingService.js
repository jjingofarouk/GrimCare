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

export async function getPayrolls() {
  const response = await axios.get(`${API_URL}/api/accounting?type=payroll`);
  return response.data;
}

export async function createPayroll(data) {
  const response = await axios.post(`${API_URL}/api/accounting?type=payroll`, data);
  return response.data;
}

export async function getAssets() {
  const response = await axios.get(`${API_URL}/api/accounting?type=asset`);
  return response.data;
}

export async function createAsset(data) {
  const response = await axios.post(`${API_URL}/api/accounting?type=asset`, data);
  return response.data;
}