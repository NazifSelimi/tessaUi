/**
 * Auth API Service (RTK Query)
 * 
 * Handles all authentication-related API calls:
 * - Login/Register
 * - Logout
 * - Profile management
 * - Password reset
 * 
 * TODO: Replace mock implementations with real API calls
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, mockDelay, API_TAGS } from './baseApi';
import type { User } from '@/types';
import { users } from '@/mock/data';
import { API_ENDPOINTS } from '@/api/endpoints';

// Response types
interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

interface RegisterResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Request types
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [API_TAGS.Auth, API_TAGS.User],
  endpoints: (builder) => ({
    /**
     * Login endpoint
     * TODO: Replace with actual API call
     * Endpoint: POST /auth/login
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      // Real API implementation:
      // query: (credentials) => ({
      //   url: API_ENDPOINTS.AUTH.LOGIN,
      //   method: 'POST',
      //   body: credentials,
      // }),
      
      // Mock implementation:
      queryFn: async ({ email, password }) => {
        await mockDelay(500);
        
        // Find user by email (mock)
        const user = users.find(u => u.email === email);
        
        if (!user) {
          return {
            error: {
              status: 401,
              data: { message: 'Invalid credentials' },
            },
          };
        }
        
        // In production, password would be verified server-side
        // For mock, any non-empty password works
        if (!password) {
          return {
            error: {
              status: 401,
              data: { message: 'Password is required' },
            },
          };
        }
        
        return {
          data: {
            user,
            token: `mock-jwt-token-${Date.now()}`,
            refreshToken: `mock-refresh-token-${Date.now()}`,
          },
        };
      },
      invalidatesTags: [API_TAGS.Auth],
    }),

    /**
     * Register endpoint
     * TODO: Replace with actual API call
     * Endpoint: POST /auth/register
     */
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      // Real API implementation:
      // query: (data) => ({
      //   url: API_ENDPOINTS.AUTH.REGISTER,
      //   method: 'POST',
      //   body: data,
      // }),
      
      // Mock implementation:
      queryFn: async (data) => {
        await mockDelay(500);
        
        // Check if email already exists
        if (users.find(u => u.email === data.email)) {
          return {
            error: {
              status: 422,
              data: { 
                message: 'Validation failed',
                errors: { email: ['Email already taken'] },
              },
            },
          };
        }
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        users.push(newUser);
        
        return {
          data: {
            user: newUser,
            token: `mock-jwt-token-${Date.now()}`,
            refreshToken: `mock-refresh-token-${Date.now()}`,
          },
        };
      },
      invalidatesTags: [API_TAGS.Auth],
    }),

    /**
     * Logout endpoint
     * TODO: Replace with actual API call
     * Endpoint: POST /auth/logout
     */
    logout: builder.mutation<void, void>({
      // Real API implementation:
      // query: () => ({
      //   url: API_ENDPOINTS.AUTH.LOGOUT,
      //   method: 'POST',
      // }),
      
      // Mock implementation:
      queryFn: async () => {
        await mockDelay(200);
        return { data: undefined };
      },
      invalidatesTags: [API_TAGS.Auth],
    }),

    /**
     * Get current authenticated user
     * TODO: Replace with actual API call
     * Endpoint: GET /auth/me
     */
    getCurrentUser: builder.query<User, void>({
      // Real API implementation:
      // query: () => API_ENDPOINTS.AUTH.ME,
      
      // Mock implementation:
      queryFn: async (_, { getState }) => {
        await mockDelay(300);
        
        const state = getState() as { auth: { user: User | null } };
        
        if (state.auth.user) {
          return { data: state.auth.user };
        }
        
        return {
          error: {
            status: 401,
            data: { message: 'Not authenticated' },
          },
        };
      },
      providesTags: [API_TAGS.User],
    }),

    /**
     * Update user profile
     * TODO: Replace with actual API call
     * Endpoint: PUT /auth/profile
     */
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      // Real API implementation:
      // query: (data) => ({
      //   url: API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      //   method: 'PUT',
      //   body: data,
      // }),
      
      // Mock implementation:
      queryFn: async (data, { getState }) => {
        await mockDelay(300);
        
        const state = getState() as { auth: { user: User | null } };
        
        if (!state.auth.user) {
          return {
            error: {
              status: 401,
              data: { message: 'Not authenticated' },
            },
          };
        }
        
        const updatedUser: User = {
          ...state.auth.user,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        return { data: updatedUser };
      },
      invalidatesTags: [API_TAGS.User],
    }),

    /**
     * Request password reset
     * TODO: Replace with actual API call
     * Endpoint: POST /auth/forgot-password
     */
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      // Real API implementation:
      // query: (data) => ({
      //   url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      //   method: 'POST',
      //   body: data,
      // }),
      
      // Mock implementation:
      queryFn: async ({ email }) => {
        await mockDelay(500);
        
        // Always return success to prevent email enumeration
        return {
          data: {
            message: 'If an account exists with that email, a reset link has been sent.',
          },
        };
      },
    }),

    /**
     * Reset password with token
     * TODO: Replace with actual API call
     * Endpoint: POST /auth/reset-password
     */
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      // Real API implementation:
      // query: (data) => ({
      //   url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
      //   method: 'POST',
      //   body: data,
      // }),
      
      // Mock implementation:
      queryFn: async () => {
        await mockDelay(500);
        return {
          data: { message: 'Password has been reset successfully.' },
        };
      },
    }),
  }),
});

// Export hooks for use in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
