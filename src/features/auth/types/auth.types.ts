export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string; // The access token (JWT)
  refreshToken?: string; // Optional depending on how it's sent (cookie vs body)
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}
