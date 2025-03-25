import axios from 'axios';
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

class UserService {
  private baseUrl = `${API_URL}/users`;

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

  async createDriver(userData: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/driver`,
        {
          email: userData.email,
          full_name: `${userData.firstName} ${userData.lastName}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 