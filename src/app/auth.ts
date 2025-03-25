import api from './api';
import { store } from './store';
import { loginSuccess, loginFailure } from '../features/auth/slices/authSlice';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'driver' | 'user';
}

// Auth service
export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      store.dispatch(loginSuccess({ user, token }));
      localStorage.setItem('token', token);
      return user;
    } catch (error) {
      store.dispatch(loginFailure('Error al iniciar sesión'));
      throw error;
    }
  },

  // Register user
  async register(data: RegisterData) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    localStorage.removeItem('token');
    store.dispatch({ type: 'auth/logout' });
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 