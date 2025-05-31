// app/adt/adtService.js
import axios from 'axios';
import api from '../api'; // Adjust path as needed

const { BASE_URL, API_ROUTES } = api;

export async function getAdmissions() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.ADT}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admissions:', error);
    throw error;
  }
}

export async function createAdmission(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.ADT}`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating admission:', error);
    throw error;
  }
}

export async function getAdmission(id) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.ADT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admission:', error);
    throw error;
  }
}

export async function updateAdmission(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.ADT}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating admission:', error);
    throw error;
  }
}

export async function deleteAdmission(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.ADT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admission:', error);
    throw error;
  }
}

export async function getPatients() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PATIENT}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function getDoctors() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DOCTOR}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function getWards() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.WARD}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
}