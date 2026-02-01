/**
 * useAuth Hook
 * 
 * Bridge hook that provides the same API as the old AuthContext
 * but uses Redux under the hood. This allows components to use
 * the same interface while benefiting from Redux.
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  logout as logoutAction, 
  setDevRole, 
  clearError,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectCurrentRole,
  selectDevRoleOverride,
  selectIsAdmin,
  selectIsDistributor,
  selectIsStylist,
  selectIsProfessional,
} from '@/store/slices/authSlice';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation,
  useUpdateProfileMutation,
} from '@/store/api/authApi';
import type { User, UserRole } from '@/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const currentRole = useAppSelector(selectCurrentRole);
  const devRoleOverride = useAppSelector(selectDevRoleOverride);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isDistributor = useAppSelector(selectIsDistributor);
  const isStylist = useAppSelector(selectIsStylist);
  const isProfessional = useAppSelector(selectIsProfessional);
  
  // RTK Query mutations
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [updateProfileMutation, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  // Login handler
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const result = await loginMutation({ email, password }).unwrap();
    return result.user;
  }, [loginMutation]);

  // Register handler
  const register = useCallback(async (data: { 
    name: string; 
    email: string; 
    phone: string; 
    password: string 
  }): Promise<User> => {
    const result = await registerMutation(data).unwrap();
    return result.user;
  }, [registerMutation]);

  // Logout handler
  const logout = useCallback(async () => {
    await logoutMutation().unwrap();
    dispatch(logoutAction());
  }, [logoutMutation, dispatch]);

  // Update profile handler
  const updateProfile = useCallback(async (data: { 
    name?: string; 
    phone?: string; 
    email?: string 
  }): Promise<User> => {
    const result = await updateProfileMutation(data).unwrap();
    return result;
  }, [updateProfileMutation]);

  // Role checking helper
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(currentRole);
  }, [currentRole]);

  // DEV role switch
  const handleSetDevRole = useCallback((role: UserRole) => {
    dispatch(setDevRole(role === 'guest' ? null : role));
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading || isRegisterLoading,
    error,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    
    // Role helpers
    currentRole,
    hasRole,
    isAdmin,
    isDistributor,
    isStylist,
    isProfessional,
    
    // DEV features
    setDevRole: handleSetDevRole,
    devRoleOverride,
    
    // Error handling
    clearError: handleClearError,
  };
}

export default useAuth;
