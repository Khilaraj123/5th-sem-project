import apiClient from '../../../lib/axios';
import type { RegisterCredentials, AuthResponse, UserRole } from '../types/auth.types';

/**
 * Registers a new user with the provided credentials.
 * @param credentials Registration details (name, email, password, role)
 * @returns AuthResponse containing user details and access token
 */
export const registerApi = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const payload = {
    fullName: credentials.name,
    email: credentials.email,
    password: credentials.password,
    confirmPassword: credentials.password,
    role: credentials.role.charAt(0).toUpperCase() + credentials.role.slice(1),
    acceptTerms: true,
  };
  const response = await apiClient.post<any>('/auth/register', payload);
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

export default registerApi;
