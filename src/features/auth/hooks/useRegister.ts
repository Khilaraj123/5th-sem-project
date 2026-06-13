import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/registerApi';
import { useAuthStore } from '../store/authStore';
import type { RegisterCredentials, AuthResponse } from '../types/auth.types';

/**
 * Hook for registering a new user.
 * Sends user registration details and updates the global auth store on success.
 */
export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: registerApi,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      setAuth(data.user, data.token || null);
    },
  });
};

export default useRegister;
