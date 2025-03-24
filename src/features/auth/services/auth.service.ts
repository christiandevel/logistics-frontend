import { RegisterRequest, RegisterResponse, ConfirmEmailRequest, ConfirmEmailResponse, LoginRequest, LoginResponse, ForgotPasswordRequest, ForgotPasswordResponse, SetInitialPasswordRequest, SetInitialPasswordResponse } from '../types/auth.types';
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

  confirmEmail: async (data: ConfirmEmailRequest): Promise<ConfirmEmailResponse> => {
    const response = await fetch(`${API_URL}/auth/confirm-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al confirmar el email');
    }

    return response.json();
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: responseData
        }
      };
    }

    return responseData;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al solicitar recuperación de contraseña');
    }

    return response.json();
  },

  resetPassword: async ({ token, password, confirmPassword }: { token: string; password: string; confirmPassword: string }): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al restablecer la contraseña');
    }

    return response.json();
  },

  setInitialPassword: async (data: SetInitialPasswordRequest): Promise<SetInitialPasswordResponse> => {
    const response = await fetch(`${API_URL}/auth/set-initial-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: responseData
        }
      };
    }

    return responseData;
  },
}; 