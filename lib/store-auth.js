import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from './api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          const { user, accessToken } = response.data.data;
          
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false
          });
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
          }
          
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Login failed'
          });
          return { success: false, error: error.response?.data?.error };
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register({ email, password, name });
          const { user, accessToken } = response.data.data;
          
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false
          });
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
          }
          
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Registration failed'
          });
          return { success: false, error: error.response?.data?.error };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      refreshUser: async () => {
        try {
          const response = await authAPI.me();
          set({ user: response.data.data.user });
        } catch (error) {
          get().logout();
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);