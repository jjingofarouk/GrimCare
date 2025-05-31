// app/adt/adtService.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getAdmissions() {
  try {
    const response = await axios.get(`${API_URL}/api/adt`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admissions:', error);
    throw error;
  }
}

export async function createAdmission(data) {
  try {
    const response = await axios.post(`${API_URL}/api/adt`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating admission:', error);
    throw error;
  }
}

export async function getAdmission(id) {
  try {
    const response = await axios.get(`${API_URL}/api/adt/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admission:', error);
    throw error;
  }
}

export async function updateAdmission(id, data) {
  try {
    const response = await axios.put(`${API_URL}/api/adt/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating admission:', error);
    throw error;
  }
}

export async function deleteAdmission(id) {
  try {
    const response = await axios.delete(`${API_URL}/api/adt/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admission:', error);
    throw error;
  }
}

export async function getPatients() {
  try {
    const response = await axios.get(`${API_URL}/api/patient`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function getDoctors() {
  try {
    const response = await axios.get(`${API_URL}/api/doctor`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function getWards() {
  try {
    const response = await axios.get(`${API_URL}/api/wards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
}