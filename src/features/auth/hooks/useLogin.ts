import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/loginApi';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials, AuthResponse } from '../types/auth.types';

/**
 * Hook for logging in a user.
 * Manages the loading and error states of the login request, saves the JWT, and updates the global auth store.
 */
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      setAuth(data.user, data.token);
    },
  });
};

export default useLogin;
