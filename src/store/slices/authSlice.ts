/**
 * Auth Slice
 * 
 * Manages authentication state including:
 * - User data
 * - Token management
 * - Role-based access control
 * - DEV mode role switching
 * 
 * Security Notes:
 * - Tokens are stored via redux-persist
 * - Server-side validation should always be the source of truth
 * - DEV role switching is disabled in production
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserRole } from '@/types';
import { authApi } from '../api/authApi';

// Environment check for DEV features
const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  devRoleOverride: UserRole | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  devRoleOverride: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set authentication credentials
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken?: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Update user data
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    /**
     * Update tokens
     */
    setTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Logout - clear all auth state
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.devRoleOverride = null;
    },

    /**
     * DEV-only: Set role override for testing
     * This only works in development mode
     */
    setDevRole: (state, action: PayloadAction<UserRole | null>) => {
      if (isDevelopment) {
        state.devRoleOverride = action.payload;
      } else {
        console.warn('DEV role switching is not available in production');
      }
    },
  },

  // Handle RTK Query actions
  extraReducers: (builder) => {
    // Login
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });

    // Register
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      });

    // Get current user
    builder
      .addMatcher(authApi.endpoints.getCurrentUser.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state) => {
        state.isLoading = false;
        // Don't set error here, user just isn't logged in
      });

    // Update profile
    builder
      .addMatcher(authApi.endpoints.updateProfile.matchFulfilled, (state, action) => {
        state.user = action.payload;
      });

    // Logout
    builder
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.devRoleOverride = null;
      });
  },
});

// Export actions
export const {
  setCredentials,
  setUser,
  setTokens,
  setLoading,
  setError,
  clearError,
  logout,
  setDevRole,
} = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectCurrentRole = (state: { auth: AuthState }) =>
  state.auth.devRoleOverride || state.auth.user?.role || 'guest';
export const selectDevRoleOverride = (state: { auth: AuthState }) => state.auth.devRoleOverride;

// Role helper selectors
export const selectIsAdmin = (state: { auth: AuthState }) => selectCurrentRole(state) === 'admin';
export const selectIsDistributor = (state: { auth: AuthState }) => selectCurrentRole(state) === 'distributor';
export const selectIsStylist = (state: { auth: AuthState }) => selectCurrentRole(state) === 'stylist';
export const selectIsProfessional = (state: { auth: AuthState }) => {
  const role = selectCurrentRole(state);
  return role === 'stylist' || role === 'distributor';
};

export default authSlice.reducer;
