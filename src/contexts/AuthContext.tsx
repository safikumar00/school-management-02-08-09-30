import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { storage } from '../utils/storage';
import { ROLES } from '../config/appConfig';
import type { UserRole } from '../config/appConfig';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department?: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await storage.getToken();
      const user = await storage.getUser();
      const role = await storage.getRole();

      if (token && user) {
        setState({
          user: { ...user, role: role || ROLES.STUDENT },
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Mock login - replace with real API call
      const mockResponse = {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: '1',
          name: email === 'admin@school.com' ? 'Admin User' : 
                email === 'hod@school.com' ? 'Dr. Smith (HOD)' : 'John Student',
          email,
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          department: email === 'hod@school.com' ? 'Computer Science' : undefined,
          role: email === 'admin@school.com' ? ROLES.ORG_ADMIN :
                email === 'hod@school.com' ? ROLES.HOD : ROLES.STUDENT,
        },
      };

      await storage.setToken(mockResponse.token);
      await storage.setUser(mockResponse.user);
      await storage.setRole(mockResponse.user.role);

      setState({
        user: mockResponse.user,
        token: mockResponse.token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await storage.clearAll();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const switchRole = async (role: UserRole) => {
    if (state.user) {
      const updatedUser = { ...state.user, role };
      await storage.setUser(updatedUser);
      await storage.setRole(role);
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      await storage.setUser(updatedUser);
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}