import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RegisterRequest, RegisterResponse } from '../types/auth.types';
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
  register: {
    isSuccess: boolean;
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  register: {
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
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { setCredentials, logout, resetRegisterState } = authSlice.actions;
export default authSlice.reducer; 