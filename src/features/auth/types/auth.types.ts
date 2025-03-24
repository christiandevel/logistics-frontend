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

export interface RegisterState {
  isSuccess: boolean;
  isLoading: boolean;
  error: string | null;
} 