export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'driver' | 'user';
  status: 'active' | 'inactive';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'driver' | 'user';
}

export interface AuthResponse {
  user: User;
  token: string;
} 