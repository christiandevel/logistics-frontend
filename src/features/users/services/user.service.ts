import axios, { AxiosError } from 'axios';
import { API_URL } from '../../../config/api';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  email_verified: boolean;
  requires_password_change: boolean;
  confirmation_token: string | null;
  confirmation_expires_at: string | null;
  reset_password_token: string | null;
  reset_password_expires_at: string | null;
}

interface RegisterResponse {
  message: string;
  user: User;
}

interface RegisterError {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    full_name?: string[];
  };
}

class UserService {
  private baseUrl = `${API_URL}/users`;

  // Get drivers
  async getDrivers(): Promise<User[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/driver`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  // Create driver
  async createDriver(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<RegisterResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          email: userData.email,
          full_name: `${userData.firstName} ${userData.lastName}`,
          role: 'driver',
          password: userData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<RegisterError>;
        if (axiosError.response?.data) {
          throw new Error(axiosError.response.data.message || 'Error al crear el conductor');
        }
      }
      throw new Error('Error al crear el conductor');
    }
  }
}

export const userService = new UserService(); 