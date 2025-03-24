import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterRequest, RegisterResponse, ConfirmEmailRequest, LoginRequest, LoginResponse, ForgotPasswordRequest, LoginStatus } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { decodeToken } from '../../../utils/jwt';
import { showToast } from '../../../components/ui/Toast';

interface User {
  id: string;
  email: string;
  role: string;
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

const getErrorMessage = (error: any): string => {
  if (!error.response) {
    return 'Error de conexión. Por favor, intenta más tarde.';
  }

  const { status, data } = error.response;
  const message = data?.message;

  if (message === 'Incorrect password') {
    return 'Contraseña incorrecta. Por favor, verifica tus credenciales.';
  }

  switch (status) {
    case 400:
      return message || 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
    case 404:
      return message || 'Usuario no encontrado. Por favor, verifica tu email.';
    case 500:
      return message || 'Error en el servidor. Por favor, intenta más tarde.';
    default:
      return message || 'Error al iniciar sesión';
  }
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
        
        if (action.payload.status === 'SUCCESS') {
          const decodedToken = decodeToken(action.payload.token);
          state.user = {
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
          };
          state.token = action.payload.token;
          state.isAuthenticated = true;
          showToast('Inicio de sesión exitoso', 'success');
        } else if (action.payload.status === 'REQUIRED_EMAIL_VERIFICATION') {
          showToast('Por favor, verifica tu correo electrónico para continuar', 'warning');
        } else if (action.payload.status === 'REQUIRED_PASSWORD_CHANGE') {
          showToast('Es necesario cambiar tu contraseña', 'warning');
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
      });
  },
});

export const { setCredentials, logout, resetRegisterState, resetConfirmEmailState, resetForgotPasswordState, resetResetPasswordState } = authSlice.actions;
export default authSlice.reducer; 