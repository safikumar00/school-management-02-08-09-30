/**
 * Auth store — Zustand.
 * Replaces AuthContext. Keeps the exact same public API so the legacy
 * `useAuth()` hook (re-exported from contexts/AuthContext) keeps working.
 */
import { create } from 'zustand';
import { authApi } from '../services/api';
import { storage } from '../utils/storage';
import { ROLES } from '../config/appConfig';
import type { UserRole } from '../config/appConfig';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  studentId?: string;
  year?: number;
  semester?: number;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (patch: Partial<AuthUser>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  hydrated: false,

  hydrate: async () => {
    try {
      const token = await storage.getToken();
      const user = await storage.getUser<AuthUser>();
      const role = ((await storage.getRole()) as UserRole | null) ?? null;
      if (token && user) {
        set({
          token,
          user: { ...user, role: role || user.role || ROLES.STUDENT },
          isAuthenticated: true,
          isLoading: false,
          hydrated: true,
        });
      } else {
        set({ isLoading: false, hydrated: true });
      }
    } catch {
      set({ isLoading: false, hydrated: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { token, user } = await authApi.login(email, password);
      await storage.setToken(token);
      await storage.setUser(user);
      await storage.setRole(user.role);
      set({
        token,
        user: user as AuthUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await storage.clearAll();
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  switchRole: async (role) => {
    const current = get().user;
    if (!current) return;
    const next = { ...current, role };
    await storage.setUser(next);
    await storage.setRole(role);
    set({ user: next });
  },

  updateProfile: async (patch) => {
    const current = get().user;
    if (!current) return;
    const next = { ...current, ...patch };
    await storage.setUser(next);
    set({ user: next });
  },
}));
