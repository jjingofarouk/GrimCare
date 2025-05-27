// queue-mngmt/queueService.js
import api from '../api';

export const getQueues = async () => {
  const response = await api.get('/api/queue-mngmt');
  return response.data;
};

export const createQueue = async (data) => {
  const response = await api.post('/api/queue-mngmt', data);
  return response.data;
};
