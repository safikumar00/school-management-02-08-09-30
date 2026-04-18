/**
 * Back-compat wrapper. Existing screens import { useAuth } from this module;
 * under the hood we now delegate to the Zustand store, so there's a single
 * source of truth.
 */
import React, { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../config/appConfig';

export function AuthProvider({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);

  return <>{children}</>;
}

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const switchRole = useAuthStore((s) => s.switchRole);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    hydrated,
    login,
    logout,
    switchRole: switchRole as (role: UserRole) => Promise<void>,
    updateProfile,
  };
}
