/**
 * Axios API Client for Tessa Shop
 * 
 * This module provides a configured Axios instance for all API calls.
 * Features:
 * - Base URL configuration from environment variables
 * - Bearer token authentication interceptor
 * - Automatic 401 handling with token refresh/logout
 * - Request/response error handling
 * - CSRF token support (ready for Laravel)
 * 
 * TODO: Configure VITE_API_URL in your .env file
 * Example: VITE_API_URL=https://api.yourdomain.com/api
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Storage keys for authentication tokens
const TOKEN_KEY = 'tessa_auth_token';
const REFRESH_TOKEN_KEY = 'tessa_refresh_token';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // TODO: Add CSRF token header for Laravel Sanctum
    // 'X-Requested-With': 'XMLHttpRequest',
  },
  // Enable credentials for cookie-based auth (Laravel Sanctum)
  withCredentials: true,
});

// Request interceptor - adds auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles auth errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // TODO: Implement token refresh logic
      // const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      // if (refreshToken && !originalRequest?._retry) {
      //   originalRequest._retry = true;
      //   try {
      //     const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
      //       refresh_token: refreshToken,
      //     });
      //     localStorage.setItem(TOKEN_KEY, data.access_token);
      //     if (originalRequest) {
      //       originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      //       return apiClient(originalRequest);
      //     }
      //   } catch (refreshError) {
      //     // Refresh failed, clear tokens and redirect to login
      //     clearAuthTokens();
      //     window.location.href = '/login';
      //     return Promise.reject(refreshError);
      //   }
      // }
      
      // No refresh token or refresh failed - clear auth and redirect
      clearAuthTokens();
      
      // Don't redirect if already on auth pages
      const authPaths = ['/login', '/register', '/forgot-password'];
      if (!authPaths.some(path => window.location.pathname.startsWith(path))) {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }
    
    // Handle 422 Validation Error (Laravel)
    if (error.response?.status === 422) {
      // Return validation errors in a structured format
      return Promise.reject({
        ...error,
        validationErrors: error.response.data,
      });
    }
    
    // Handle 429 Too Many Requests (rate limiting)
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    }
    
    // Handle 500+ Server Errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error occurred. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Set authentication tokens in local storage
 */
export function setAuthTokens(accessToken: string, refreshToken?: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

/**
 * Clear all authentication tokens
 */
export function clearAuthTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Get current access token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated (has token)
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export default apiClient;
