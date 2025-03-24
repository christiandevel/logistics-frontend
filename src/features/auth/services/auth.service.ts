import { RegisterRequest, RegisterResponse } from '../types/auth.types';
import { API_URL } from '../../../config/api';

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return response.json();
  },
}; 