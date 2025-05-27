// pharmacy/pharmacyService.js
import api from '../api';

export const getPrescriptions = async () => {
  const response = await api.get('/api/pharmacy');
  return response.data;
};

export const createPrescription = async (data) => {
  const response = await api.post('/api/pharmacy', data);
  return response.data;
};
