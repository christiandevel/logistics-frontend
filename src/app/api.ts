import axios from 'axios';
import { store } from './store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to the requests
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(error);
  }
);

// Reset password service
export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
      confirmPassword
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Error resetting password' };
  }
};

export default api; 