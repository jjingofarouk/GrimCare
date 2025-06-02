import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getAppointments() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.APPOINTMENT}`);
    return response.data.map(appt => ({
      ...appt,
      patient: { id: appt.patientId, name: appt.patient.user.name },
      doctor: { id: appt.doctorId, name: appt.doctor.user.name, specialization: appt.doctor.specialty },
      department: appt.department
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

export async function createAppointment(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.APPOINTMENT}`, {
      ...data,
      date: new Date(data.date).toISOString(),
    });
    return {
      ...response.data,
      patient: { id: response.data.patientId, name: response.data.patient.user.name },
      doctor: { id: response.data.doctorId, name: response.data.doctor.user.name, specialization: response.data.doctor.specialty },
      department: response.data.department
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function updateAppointment(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}`, {
      ...data,
      date: new Date(data.date).toISOString(),
    });
    return {
      ...response.data,
      patient: { id: response.data.patientId, name: response.data.patient.user.name },
      doctor: { id: response.data.doctorId, name: response.data.doctor.user.name, specialization: response.data.doctor.specialty },
      department: response.data.department
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

export async function deleteAppointment(id) {
  try {
    await axios.delete(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}`);
    return { message: 'Appointment deleted' };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}

export async function getDoctors() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DOCTOR}`);
    return response.data.map(doctor => ({
      id: doctor.id,
      name: doctor.user.name,
      specialization: doctor.specialty
    }));
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function getPatients() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PATIENT}`);
    return response.data.map(patient => ({
      id: patient.id,
      name: patient.user.name
    }));
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function getDoctorAvailability(doctorId, date) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.APPOINTMENT}/availability`, {
      params: { doctorId, date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
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

export async function checkInAppointment(id) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}/check-in`);
    return response.data;
  } catch (error) {
    console.error('Error checking in appointment:', error);
    throw error;
  }
}

export async function checkOutAppointment(id) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.APPOINTMENT}/${id}/check-out`);
    return response.data;
  } catch (error) {
    console.error('Error checking out appointment:', error);
    throw error;
  }
}

export async function getQueue(department) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.APPOINTMENT}/queue`, {
      params: { department }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching queue:', error);
    throw error;
  }
}

export async function generateReport(filters) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.APPOINTMENT}/report`, {
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}