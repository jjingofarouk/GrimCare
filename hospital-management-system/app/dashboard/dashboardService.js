import { API_ROUTES, BASE_URL } from '../api';

export async function getDashboardData() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DASHBOARD}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return response.json();
}