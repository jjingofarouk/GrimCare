import axios from 'axios';
import { BASE_URL, API_ROUTES } from '../api';

export const getDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DEPARTMENT}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch departments');
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.DEPARTMENT}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create department');
  }
};