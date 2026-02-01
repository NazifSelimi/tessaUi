/**
 * Contexts Index
 * 
 * MIGRATION NOTE: This file now re-exports from hooks for backward compatibility.
 * The app uses Redux for state management. These exports provide
 * the same API for existing components.
 * 
 * New code should import directly from @/hooks instead.
 */

// Re-export hooks for backward compatibility
export { useAuth } from '@/hooks/useAuth';
export { useCart } from '@/hooks/useCart';

// Empty providers for backward compatibility (Redux Provider is used instead)
import React from 'react';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Re-export withAuth HOC for route protection
export { withAuth } from './AuthContext';
