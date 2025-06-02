import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getAppointments() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, {
      params: { include: 'patient,doctor' }
    });
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

export async function deleteAppointment(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}

export async function getDoctorAvailability(doctorId, date) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DOCTOR}/${doctorId}/availability`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    throw error;
  }
}

export async function getQueueStatus(department, date) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.QUEUE_MNGMT}`, {
      params: { department, date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching queue status:', error);
    throw error;
  }
}

export async function sendReminder(appointmentId) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${appointmentId}/reminder`);
    return response.data;
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
}