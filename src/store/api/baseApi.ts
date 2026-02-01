/**
 * Base API Configuration for RTK Query
 * 
 * Provides a configured base query with:
 * - Authentication token injection
 * - Error handling
 * - Token refresh logic
 * 
 * TODO: Configure VITE_API_URL in your .env file
 */

import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import { logout, setTokens } from '../slices/authSlice';

// Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Base query with authentication
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include', // Include cookies for CSRF (Laravel Sanctum)
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = (getState() as RootState).auth.token;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
});

/**
 * Base query with token refresh
 * 
 * Handles 401 errors by attempting to refresh the token.
 * If refresh fails, logs out the user.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      // Attempt to refresh token
      // TODO: Uncomment and configure when backend supports token refresh
      /*
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { access_token, refresh_token } = refreshResult.data as {
          access_token: string;
          refresh_token?: string;
        };

        // Update tokens in store
        api.dispatch(setTokens({ 
          token: access_token, 
          refreshToken: refresh_token 
        }));

        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout
        api.dispatch(logout());
      }
      */
      
      // For now, just logout on 401
      api.dispatch(logout());
    } else {
      // No refresh token - logout
      api.dispatch(logout());
    }
  }

  return result;
};

/**
 * Mock delay helper for development
 * TODO: Remove in production
 */
export const mockDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Tags for cache invalidation
 */
export const API_TAGS = {
  Auth: 'Auth',
  User: 'User',
  Products: 'Products',
  Product: 'Product',
  Categories: 'Categories',
  Brands: 'Brands',
  Orders: 'Orders',
  Order: 'Order',
  Coupons: 'Coupons',
  StylistRequests: 'StylistRequests',
  StylistCodes: 'StylistCodes',
  Users: 'Users',
  Dashboard: 'Dashboard',
} as const;

export type ApiTag = typeof API_TAGS[keyof typeof API_TAGS];
