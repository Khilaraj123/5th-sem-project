import apiClient from '../../../lib/axios';
import type { LoginCredentials, AuthResponse, UserRole } from '../types/auth.types';

/**
 * Logs in a user with the provided credentials.
 * @param credentials User email and password
 * @returns AuthResponse containing user details and access token
 */
export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<any>('/auth/login', credentials);
  const data = response.data;
  return {
    user: {
      id: data.userId,
      name: data.fullName,
      email: data.email,
      role: (data.role?.toLowerCase() as UserRole) || 'student',
      profileImageUrl: data.avatarUrl || undefined,
    },
    token: data.accessToken,
    refreshToken: data.refreshToken,
  };
};

export default loginApi;
