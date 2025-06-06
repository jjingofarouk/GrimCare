import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getMedicalRecords() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.MEDICAL_RECORDS}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
}

export async function getMedicalRecord(id) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.MEDICAL_RECORDS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medical record:', error);
    throw error;
  }
}

export async function createMedicalRecord(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.MEDICAL_RECORDS}`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
}

export async function updateMedicalRecord(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.MEDICAL_RECORDS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
}

export async function deleteMedicalRecord(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.MEDICAL_RECORDS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
}