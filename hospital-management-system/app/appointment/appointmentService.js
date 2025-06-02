import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getAppointments() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.APPOINTMENT}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

export async function createAppointment(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function updateAppointment(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

export async function getAvailability(params) {
  try {
    const response = await axios.get(`${BASE_URL}/api/availability`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
}

export async function createAvailability(data) {
  try {
    const response = await axios.post(`${BASE_URL}/api/availability`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating availability:', error);
    throw error;
  }
}

export async function getQueue(params) {
  try {
    const response = await axios.get(`${BASE_URL}/api/queue`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching queue:', error);
    throw error;
  }
}

export async function updateQueue(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/api/queue`, { id, ...data });
    return response.data;
  } catch (error) {
    console.error('Error updating queue:', error);
    throw error;
  }
}

export async function getDepartments() {
  try {
    const response = await axios.get(`${BASE_URL}/api/department`);
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
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

export async function getPatients() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PATIENT}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}
