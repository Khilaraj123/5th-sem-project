import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLogin } from './useLogin';
import { useRegister } from './useRegister';
import { getMyProfile } from '../../users/api/usersApi';

/**
 * Unified authentication hook.
 * Exposes current session state (user, token, flags) and handles actions like login, register, and logout.
 * Listens for global Axios logout events.
 */
export const useAuth = () => {
  const { user, token, isAuthenticated, isInitializing, clearAuth, setAuth } = useAuthStore();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    clearAuth();
  };

  // Restore session from token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        clearAuth();
        return;
      }

      try {
        const profile = await getMyProfile();
        setAuth(
          {
            id: profile.id,
            name: profile.fullName,
            email: profile.email,
            role: (profile.role?.toLowerCase() as any) || 'student',
            profileImageUrl: profile.avatarUrl || undefined,
          },
          storedToken
        );
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        clearAuth();
      }
    };

    if (isInitializing && !user) {
      initializeAuth();
    }
  }, [isInitializing, user, setAuth, clearAuth]);

  // Listen for global logout events (triggered by Axios refresh token expiry)
  useEffect(() => {
    const handleGlobalLogout = () => {
      logout();
    };

    window.addEventListener('auth-logout', handleGlobalLogout);
    return () => {
      window.removeEventListener('auth-logout', handleGlobalLogout);
    };
  }, []);

  return {
    user,
    token,
    isAuthenticated,
    isInitializing,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };
};

export default useAuth;
