import axios from 'axios';
import axiosRetry from 'axios-retry';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 1000 });

export async function getAppointments() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'patient.user,doctor.user,queue,department,bookedBy' },
    });
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: Expected array');
    }
    const appointments = response.data;
    const invalidAppointments = appointments.filter(
      (appt) => !appt.patient?.user || !appt.doctor?.user
    );
    if (invalidAppointments.length > 0) {
      console.warn('Appointments with missing user data:', JSON.stringify(invalidAppointments, null, 2));
    }
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
  }
}

export async function createAppointment(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'patient.user,doctor.user,queue,department,bookedBy' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw new Error(error.response?.data?.message || 'Failed to create appointment');
  }
}

export async function updateAppointment(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'patient.user,doctor.user,queue,department,bookedBy' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new Error(error.response?.data?.message || 'Failed to update appointment');
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
    throw new Error(error.response?.data?.message || 'Failed to fetch availability');
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
    throw new Error(error.response?.data?.message || 'Failed to create availability');
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
    throw new Error(error.response?.data?.message || 'Failed to fetch queue');
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
    throw new Error(error.response?.data?.message || 'Failed to update queue');
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
    throw new Error(error.response?.data?.message || 'Failed to fetch departments');
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
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PATIENT}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { include: 'user' },
    });
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: Expected array');
    }
    const patients = response.data;
    const invalidPatients = patients.filter((patient) => !patient.user);
    if (invalidPatients.length > 0) {
      console.warn('Patients with missing user data:', JSON.stringify(invalidPatients, null, 2));
    }
    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch patients');
  }
}