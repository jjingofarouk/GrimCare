// medical-records/medicalRecordsService.js
import api from '../api';

export const getMedicalRecords = async () => {
  const response = await api.get('/api/medical-records');
  return response.data;
};

export const createMedicalRecord = async (data) => {
  const response = await api.post('/api/medical-records', data);
  return response.data;
};
