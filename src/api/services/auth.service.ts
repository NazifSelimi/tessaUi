/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls.
 * Currently uses mock data but structured for easy backend integration.
 * 
 * Security Notes:
 * - Passwords should NEVER be stored in localStorage
 * - Use HTTP-only cookies for refresh tokens in production
 * - Implement CSRF protection with Laravel Sanctum
 */

import apiClient, { setAuthTokens, clearAuthTokens } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { User, UserRole } from '@/types';

// Mock users for development
import { users } from '@/mock/data';

// Simulated delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Response types
interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation?: string;
}

interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  email?: string;
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

/**
 * Login user and store authentication tokens
 */
export async function login(data: LoginData): Promise<User> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  // setAuthTokens(response.data.access_token, response.data.refresh_token);
  // return response.data.user;
  
  // Mock implementation
  const user = users.find(u => u.email === data.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Simulate token storage
  setAuthTokens(`mock_token_${user.id}_${Date.now()}`, `mock_refresh_${user.id}`);
  
  return user;
}

/**
 * Register a new user account
 */
export async function register(data: RegisterData): Promise<User> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, {
  //   ...data,
  //   password_confirmation: data.password,
  // });
  // setAuthTokens(response.data.access_token, response.data.refresh_token);
  // return response.data.user;
  
  // Mock implementation - check for existing email
  const existingUser = users.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    name: data.name,
    phone: data.phone,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  
  setAuthTokens(`mock_token_${newUser.id}_${Date.now()}`);
  
  return newUser;
}

/**
 * Logout user and clear tokens
 */
export async function logout(): Promise<void> {
  // TODO: Replace with actual API call
  // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  
  await delay(200);
  clearAuthTokens();
}

/**
 * Request password reset email
 */
export async function forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  // return response.data;
  
  // Mock - check if email exists
  const user = users.find(u => u.email === data.email);
  if (!user) {
    // Don't reveal if email exists for security
    return { message: 'If the email exists, a reset link has been sent.' };
  }
  
  return { message: 'Password reset link sent to your email.' };
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  // return response.data;
  
  return { message: 'Password has been reset successfully.' };
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  await delay(200);
  
  // TODO: Replace with actual API call
  // try {
  //   const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  //   return response.data;
  // } catch {
  //   return null;
  // }
  
  // Mock - return first user if token exists
  const token = localStorage.getItem('tessa_auth_token');
  if (!token) return null;
  
  // Extract user ID from mock token
  const match = token.match(/mock_token_(\w+)_/);
  if (match) {
    const userId = match[1];
    return users.find(u => u.id === userId) || null;
  }
  
  return null;
}

/**
 * Update user profile
 */
export async function updateProfile(data: UpdateProfileData): Promise<User> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.put<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  // return response.data;
  
  // Mock implementation
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  return {
    ...currentUser,
    ...data,
  };
}

/**
 * Change user password
 */
export async function changePassword(data: ChangePasswordData): Promise<{ message: string }> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  // return response.data;
  
  return { message: 'Password changed successfully.' };
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post(`/auth/verify-email/${token}`);
  // return response.data;
  
  return { message: 'Email verified successfully.' };
}

/**
 * Resend email verification
 */
export async function resendVerification(): Promise<{ message: string }> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post('/auth/resend-verification');
  // return response.data;
  
  return { message: 'Verification email sent.' };
}
