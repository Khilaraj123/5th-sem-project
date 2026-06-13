import { useMutation } from '@tanstack/react-query';
import { refreshTokenApi } from '../api/refreshTokenApi';
import { useAuthStore } from '../store/authStore';

interface RefreshTokenResponse {
  token: string;
}

/**
 * Hook for refreshing the expired access token.
 * Triggers a refresh call and saves the new JWT.
 */
export const useRefreshToken = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  return useMutation<RefreshTokenResponse, Error, void>({
    mutationFn: refreshTokenApi,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      if (user) {
        setAuth(user, data.token);
      }
    },
  });
};

export default useRefreshToken;
