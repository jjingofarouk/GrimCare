// patient/patientService.js
import api from '../api';

export const getPatients = async () => {
  const response = await api.get('/api/patient');
  return response.data;
};

export const createPatient = async (data) => {
  const response = await api.post('/api/patient', data);
  return response.data;
};
