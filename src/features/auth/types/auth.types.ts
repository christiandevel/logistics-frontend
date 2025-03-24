export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role: 'user';
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export interface ConfirmEmailRequest {
  token: string;
}

export interface ConfirmEmailResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    isVerified: boolean;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  userExists: boolean;
}

export interface RegisterState {
  isSuccess: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ConfirmEmailState {
  isSuccess: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ForgotPasswordState {
  isSuccess: boolean;
  isLoading: boolean;
  error: string | null;
  userExists: boolean | null;
} 