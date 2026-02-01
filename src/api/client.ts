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


// =============================================================================
// TEMPORARY MOCK API FUNCTIONS
// TODO: Replace these with actual API calls once backend is ready
// =============================================================================

import { products, orders, users, stylistCodes, coupons, stylistRequests } from '@/mock/data';
import type { Product, Order, OrderStatus, StylistCode, StylistRequest, User, Coupon } from '@/types';

/**
 * Get all products
 * TODO: Replace with: return apiClient.get('/products').then(res => res.data)
 */
export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return products;
}

/**
 * Get product by slug
 * TODO: Replace with: return apiClient.get(`/products/${slug}`).then(res => res.data)
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return products.find(p => p.slug === slug);
}

/**
 * Get all orders
 * TODO: Replace with: return apiClient.get('/orders').then(res => res.data)
 */
export async function getOrders(): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return orders;
}

/**
 * Get order by ID
 * TODO: Replace with: return apiClient.get(`/orders/${id}`).then(res => res.data)
 */
export async function getOrderById(id: string): Promise<Order | undefined> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return orders.find(o => o.id === id);
}

/**
 * Update order status
 * TODO: Replace with: return apiClient.patch(`/orders/${id}/status`, { status }).then(res => res.data)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
  }
  return order || null;
}

/**
 * Get all users
 * TODO: Replace with: return apiClient.get('/users').then(res => res.data)
 */
export async function getUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return users;
}

/**
 * Get stylist codes (for distributor)
 * TODO: Replace with: return apiClient.get(`/stylist-codes?distributor_id=${distributorId}`).then(res => res.data)
 */
export async function getStylistCodes(distributorId?: string): Promise<StylistCode[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (distributorId) {
    return stylistCodes.filter(c => c.distributorId === distributorId);
  }
  return stylistCodes;
}

/**
 * Create a new stylist code
 * TODO: Replace with: return apiClient.post('/stylist-codes', { distributorId }).then(res => res.data)
 */
export async function createStylistCode(distributorId: string): Promise<StylistCode> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const newCode: StylistCode = {
    id: `code-${Date.now()}`,
    code: `STYLIST${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    distributorId,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  stylistCodes.push(newCode);
  return newCode;
}

/**
 * Get all stylist requests
 * TODO: Replace with: return apiClient.get('/stylist-requests').then(res => res.data)
 */
export async function getStylistRequests(): Promise<StylistRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return stylistRequests;
}

/**
 * Create stylist request
 * TODO: Replace with: return apiClient.post('/stylist-requests', data).then(res => res.data)
 */
export async function createStylistRequest(data: Partial<StylistRequest>): Promise<StylistRequest> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const newRequest: StylistRequest = {
    id: `sr-${Date.now()}`,
    userId: data.userId || '',
    userName: data.userName || '',
    userEmail: data.userEmail || '',
    salonName: data.salonName || '',
    salonAddress: data.salonAddress || '',
    experience: data.experience || '',
    referralCode: data.referralCode,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  stylistRequests.push(newRequest);
  return newRequest;
}

/**
 * Update stylist request status
 * TODO: Replace with: return apiClient.patch(`/stylist-requests/${id}`, { status }).then(res => res.data)
 */
export async function updateStylistRequestStatus(
  requestId: string, 
  status: 'approved' | 'rejected'
): Promise<StylistRequest | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const request = stylistRequests.find(r => r.id === requestId);
  if (request) {
    request.status = status;
    request.reviewedAt = new Date().toISOString();
  }
  return request || null;
}

/**
 * Get all coupons
 * TODO: Replace with: return apiClient.get('/coupons').then(res => res.data)
 */
export async function getCoupons(): Promise<Coupon[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return coupons;
}

/**
 * Validate coupon code
 * TODO: Replace with: return apiClient.post('/coupons/validate', { code }).then(res => res.data)
 */
export async function validateCoupon(code: string): Promise<Coupon | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const coupon = coupons.find(c => c.code === code && c.isActive);
  if (coupon && new Date(coupon.expiresAt) > new Date()) {
    return coupon;
  }
  return null;
}

/**
 * Create a new coupon
 * TODO: Replace with: return apiClient.post('/coupons', data).then(res => res.data)
 */
export async function createCoupon(data: {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  usageLimit?: number;
  audience: string[];
  validFrom: string;
  validUntil: string;
}): Promise<Coupon> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const newCoupon: Coupon = {
    id: `coupon-${Date.now()}`,
    code: data.code,
    type: data.type,
    value: data.value,
    minPurchase: data.minPurchase || 0,
    usageLimit: data.usageLimit || 100,
    usedCount: 0,
    audience: data.audience as any,
    validFrom: data.validFrom,
    validUntil: data.validUntil,
    expiresAt: data.validUntil,
    isActive: true,
    status: 'active',
  };
  coupons.push(newCoupon);
  return newCoupon;
}

/**
 * Review stylist request (approve/reject)
 * TODO: Replace with: return apiClient.patch(`/stylist-requests/${id}/review`, { action, reviewer }).then(res => res.data)
 */
export async function reviewStylistRequest(
  requestId: string, 
  action: 'approve' | 'reject',
  reviewerEmail: string
): Promise<StylistRequest | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const request = stylistRequests.find(r => r.id === requestId);
  if (request) {
    request.status = action === 'approve' ? 'approved' : 'rejected';
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = reviewerEmail;
  }
  return request || null;
}

/**
 * Update user role
 * TODO: Replace with: return apiClient.patch(`/users/${id}/role`, { role }).then(res => res.data)
 */
export async function updateUserRole(userId: string, newRole: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const user = users.find(u => u.id === userId);
  if (user) {
    user.role = newRole as any;
  }
  return user || null;
}
