// radiology/radiologyService.js
import api from '../api';

export const getRadiologyScans = async () => {
  const response = await api.get('/api/radiology');
  return response.data;
};

export const createRadiologyScan = async (data) => {
  const response = await api.post('/api/radiology', data);
  return response.data;
};
