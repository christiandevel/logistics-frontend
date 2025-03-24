import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterRequest, RegisterResponse, ConfirmEmailRequest, LoginRequest, LoginResponse, ForgotPasswordRequest, LoginStatus, SetInitialPasswordRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { decodeToken } from '../../../utils/jwt';
import { showToast } from '../../../components/ui/Toast';

interface User {
  id: string;
  email: string;
  role: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStatus: LoginStatus | null;
  error: string | null;
  register: {
    isSuccess: boolean;
    isLoading: boolean;
    error: string | null;
  };
  confirmEmail: {
    isSuccess: boolean;
    isLoading: boolean;
    error: string | null;
  };
  forgotPassword: {
    isSuccess: boolean;
    isLoading: boolean;
    error: string | null;
    userExists: boolean | null;
  };
  resetPassword: {
    isLoading: boolean;
    isSuccess: boolean;
    error: string | null;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  loginStatus: null,
  error: null,
  register: {
    isSuccess: false,
    isLoading: false,
    error: null,
  },
  confirmEmail: {
    isSuccess: false,
    isLoading: false,
    error: null,
  },
  forgotPassword: {
    isSuccess: false,
    isLoading: false,
    error: null,
    userExists: null,
  },
  resetPassword: {
    isLoading: false,
    isSuccess: false,
    error: null,
  },
};

const ERROR_MESSAGES: Record<string | number, string> = {
  'Incorrect password': 'Contraseña incorrecta. Por favor, verifica tus credenciales.',
  400: 'Credenciales inválidas. Por favor, verifica tu email y contraseña.',
  404: 'Usuario no encontrado. Por favor, verifica tu email.',
  500: 'Error en el servidor. Por favor, intenta más tarde.',
} as const;

const getErrorMessage = (error: any): string => {
  if (!error.response) {
    return 'Error de conexión. Por favor, intenta más tarde.';
  }

  const { status, data } = error.response;
  const message = data?.message;

  if (message === 'Incorrect password') {
    return ERROR_MESSAGES['Incorrect password'];
  }

  return ERROR_MESSAGES[status] || message || 'Error al iniciar sesión';
};

// Thunk para registro
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al registrar usuario');
    }
  }
);

// Thunk para confirmar email
export const confirmEmail = createAsyncThunk(
  'auth/confirmEmail',
  async (data: ConfirmEmailRequest, { rejectWithValue }) => {
    try {
      const response = await authService.confirmEmail(data);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al confirmar el email');
    }
  }
);

// Thunk para login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error: any) {
      console.log('Login error:', error); // Para debugging
      const errorMessage = getErrorMessage(error);
      showToast(errorMessage, 'error');
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk para olvidar contraseña
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al solicitar recuperación de contraseña');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password, confirmPassword }: { token: string; password: string; confirmPassword: string }) => {
    const response = await authService.resetPassword({ token, password, confirmPassword });
    return response;
  }
);

export const setInitialPassword = createAsyncThunk(
  'auth/setInitialPassword',
  async (data: SetInitialPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.setInitialPassword(data);
      return response;
    } catch (error: any) {
      const message = getErrorMessage(error);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    resetRegisterState: (state) => {
      state.register.isSuccess = false;
      state.register.isLoading = false;
      state.register.error = null;
    },
    resetConfirmEmailState: (state) => {
      state.confirmEmail.isSuccess = false;
      state.confirmEmail.isLoading = false;
      state.confirmEmail.error = null;
    },
    resetForgotPasswordState: (state) => {
      state.forgotPassword.isSuccess = false;
      state.forgotPassword.isLoading = false;
      state.forgotPassword.error = null;
      state.forgotPassword.userExists = null;
    },
    resetResetPasswordState: (state) => {
      state.resetPassword = {
        isLoading: false,
        isSuccess: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Registro
      .addCase(registerUser.pending, (state) => {
        state.register.isLoading = true;
        state.register.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.register.isLoading = false;
        state.register.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.register.isLoading = false;
        state.register.error = action.payload as string;
      })
      // Confirmación de email
      .addCase(confirmEmail.pending, (state) => {
        state.confirmEmail.isLoading = true;
        state.confirmEmail.error = null;
      })
      .addCase(confirmEmail.fulfilled, (state) => {
        state.confirmEmail.isLoading = false;
        state.confirmEmail.isSuccess = true;
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.confirmEmail.isLoading = false;
        state.confirmEmail.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.loginStatus = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loginStatus = action.payload.status;
        state.error = null;
        
        const { id, email, role } = action.payload.user as { id: string | number; email: string; role: string };
        state.user = {
          id: String(id),
          email,
          role
        };
        state.token = action.payload.token;
        
        const statusMessages = {
          'SUCCESS': { message: 'Inicio de sesión exitoso', type: 'success' as const },
          'REQUIRED_PASSWORD_CHANGE': { message: 'Es necesario cambiar tu contraseña', type: 'warning' as const },
          'REQUIRED_EMAIL_VERIFICATION': { message: 'Por favor, verifica tu correo electrónico para continuar', type: 'warning' as const }
        };

        state.isAuthenticated = action.payload.status === 'SUCCESS';
        
        const statusConfig = statusMessages[action.payload.status];
        if (statusConfig) {
          showToast(statusConfig.message, statusConfig.type);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.loginStatus = null;
      })
      // Olvidar contraseña
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword.isLoading = true;
        state.forgotPassword.error = null;
        state.forgotPassword.isSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPassword.isLoading = false;
        state.forgotPassword.isSuccess = true;
        state.forgotPassword.userExists = action.payload.userExists;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword.isLoading = false;
        state.forgotPassword.error = action.payload as string;
        state.forgotPassword.isSuccess = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.isLoading = true;
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword.isLoading = false;
        state.resetPassword.isSuccess = true;
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.isLoading = false;
        state.resetPassword.error = action.error.message || 'Error al restablecer la contraseña';
      })
      .addCase(setInitialPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setInitialPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loginStatus = null;
      })
      .addCase(setInitialPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, resetRegisterState, resetConfirmEmailState, resetForgotPasswordState, resetResetPasswordState } = authSlice.actions;
export default authSlice.reducer; 