import { RegisterRequest, RegisterResponse, ConfirmEmailRequest, ConfirmEmailResponse, LoginRequest, LoginResponse, ForgotPasswordRequest, ForgotPasswordResponse, SetInitialPasswordRequest, SetInitialPasswordResponse } from '../types/auth.types';
import { API_URL } from '../../../config/api';

export const authService = {
  
  // Register new user
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

  // Confirm email
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

  // Login
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

    // Guardar el token en localStorage
    if (responseData.token) {
      localStorage.setItem('token', responseData.token);
      console.log('Token guardado en localStorage');
    }

    return responseData;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    console.log('Token removido de localStorage');
  },

  // Forgot password
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

  // Reset password
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

  // Set initial password
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