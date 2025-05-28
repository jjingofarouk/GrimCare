import api from '../api';

export const getPatients = async () => {
  const response = await api.get('/api/patients');
  return response.data;
};

export const getPatientById = async (id) => {
  const response = await api.get(`/api/patients/${id}`);
  return response.data;
};

export const createPatient = async (data) => {
  const response = await api.post('/api/patients', data);
  return response.data;
};

export const updatePatient = async (id, data) => {
  const response = await api.put(`/api/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await api.delete(`/api/patients/${id}`);
  return response.data;
};

export const searchPatients = async (query) => {
  const response = await api.get('/api/patients/search', { params: { query } });
  return response.data;
};

export const getPatientHistory = async (patientId) => {
  const response = await api.get(`/api/patients/${patientId}/history`);
  return response.data;
};