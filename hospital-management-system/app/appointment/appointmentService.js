import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getAppointments() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'patient.user,doctor.user,queue' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
  }
}

export async function createAppointment(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'patient.user,doctor.user,queue' },
    });
    console.log('Created appointment:', response.data); // Debug
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function updateAppointment(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'patient.user,doctor.user,queue' },
    });
    console.log('Updated appointment:', response.data); // Debug
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

export async function getAvailability(params) {
  try {
    const response = await axios.get(`${BASE_URL}/api/availability`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
}

export async function createAvailability(data) {
  try {
    const response = await axios.post(`${BASE_URL}/api/availability`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating availability:', error);
    throw error;
  }
}

export async function getQueue(params) {
  try {
    const response = await axios.get(`${BASE_URL}/api/queue`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching queue:', error);
    throw error;
  }
}

export async function updateQueue(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/api/queue`, { id, ...data }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating queue:', error);
    throw error;
  }
}

export async function getDepartments() {
  try {
    const response = await axios.get(`${BASE_URL}/api/department`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

export async function getDoctors() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DOCTOR}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'user' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function getPatients() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PATIENT}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'user' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}