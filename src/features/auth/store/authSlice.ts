import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterRequest, RegisterResponse, ConfirmEmailRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface User {
  id: number;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
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
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al iniciar sesión');
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
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, resetRegisterState, resetConfirmEmailState } = authSlice.actions;
export default authSlice.reducer; 