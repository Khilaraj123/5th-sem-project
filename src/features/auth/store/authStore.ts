import { create } from 'zustand';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User, token: string | null) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
      isInitializing: false,
    }),
  clearAuth: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: false,
    }),
  setInitializing: (isInitializing) => set({ isInitializing }),
}));

export default useAuthStore;
