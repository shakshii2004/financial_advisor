import { create } from 'zustand';
import type { User } from '../types/schema';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (user: User) => void;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Zustand store for authentication and user profile management.
 * 
 * Note: We removed the 'persist' middleware to ensure that the session
 * is always validated against the backend cookies (Sanctum) on reload.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true so we can check the session before rendering routes

  initialize: async () => {
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    // Clear state immediately for better UX
    set({ user: null, isAuthenticated: false });
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
