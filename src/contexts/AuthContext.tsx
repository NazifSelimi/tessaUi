/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the app.
 * Features:
 * - User state management
 * - Login/logout functionality
 * - Role-based access control helpers
 * - Token persistence
 * - Auto-login on page refresh
 * - DEV-only role switching
 * 
 * Security Notes:
 * - Tokens are stored in localStorage (consider httpOnly cookies for production)
 * - Role verification should always happen server-side
 * - Never trust client-side role checks for sensitive operations
 */

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { 
  login as loginService, 
  logout as logoutService, 
  register as registerService,
  getCurrentUser,
  updateProfile as updateProfileService,
} from '@/api/services/auth.service';
import { isAuthenticated, clearAuthTokens } from '@/api/client';

// Auth state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
  // Core auth methods
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; email?: string }) => Promise<User>;
  
  // Role helpers
  currentRole: UserRole;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
  isDistributor: boolean;
  isStylist: boolean;
  isProfessional: boolean;
  
  // DEV-only role switching
  setDevRole: (role: UserRole) => void;
  devRoleOverride: UserRole | null;
  
  // Error handling
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Environment check for DEV features
const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  
  // DEV-only role override
  const [devRoleOverride, setDevRoleOverride] = useState<UserRole | null>(() => {
    if (isDevelopment) {
      return (localStorage.getItem('tessa_dev_role') as UserRole) || null;
    }
    return null;
  });

  // Computed current role (with DEV override support)
  const currentRole: UserRole = devRoleOverride || state.user?.role || 'guest';

  // Load user on mount if authenticated
  useEffect(() => {
    async function loadUser() {
      if (!isAuthenticated()) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const user = await getCurrentUser();
        setState({
          user,
          isLoading: false,
          isAuthenticated: !!user,
          error: null,
        });
      } catch (error) {
        console.error('Failed to load user:', error);
        clearAuthTokens();
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    }

    loadUser();
  }, []);

  // Login handler
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await loginService({ email, password });
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, []);

  // Register handler
  const register = useCallback(async (data: { 
    name: string; 
    email: string; 
    phone: string; 
    password: string 
  }): Promise<User> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await registerService(data);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      // Clear DEV role override on logout
      if (isDevelopment) {
        setDevRoleOverride(null);
        localStorage.removeItem('tessa_dev_role');
      }
    }
  }, []);

  // Update profile handler
  const updateProfile = useCallback(async (data: { 
    name?: string; 
    phone?: string; 
    email?: string 
  }): Promise<User> => {
    if (!state.user) {
      throw new Error('Not authenticated');
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedUser = await updateProfileService(data);
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));
      return updatedUser;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      throw error;
    }
  }, [state.user]);

  // Role checking helpers
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(currentRole);
  }, [currentRole]);

  // Computed role booleans
  const isAdmin = currentRole === 'admin';
  const isDistributor = currentRole === 'distributor';
  const isStylist = currentRole === 'stylist';
  const isProfessional = isStylist || isDistributor;

  // DEV-only role switch
  const setDevRole = useCallback((role: UserRole) => {
    if (!isDevelopment) {
      console.warn('DEV role switching is not available in production');
      return;
    }
    
    setDevRoleOverride(role === 'guest' ? null : role);
    
    if (role === 'guest') {
      localStorage.removeItem('tessa_dev_role');
    } else {
      localStorage.setItem('tessa_dev_role', role);
    }
  }, []);

  // Error clearing
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    currentRole,
    hasRole,
    isAdmin,
    isDistributor,
    isStylist,
    isProfessional,
    setDevRole,
    devRoleOverride,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * HOC for protecting routes based on role
 * Usage: withAuth(Component, ['admin', 'distributor'])
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, currentRole } = useAuth();

    if (isLoading) {
      return null; // Or loading spinner
    }

    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return null;
    }

    if (allowedRoles && !allowedRoles.includes(currentRole)) {
      // Redirect to unauthorized
      window.location.href = '/unauthorized';
      return null;
    }

    return <Component {...props} />;
  };
}
