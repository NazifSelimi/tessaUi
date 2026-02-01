/**
 * Authentication Context - Redux Bridge
 * 
 * This file provides backward compatibility with the old Context API
 * while using Redux under the hood. Components can continue to use
 * useAuth() without changes.
 * 
 * For new code, import useAuth directly from @/hooks instead.
 */

import React from 'react';
import type { UserRole } from '@/types';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

// Re-export the hook
export { useAuth } from '@/hooks/useAuth';

// Empty provider for backward compatibility
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
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
    const { isAuthenticated, isLoading, currentRole } = useAuthHook();

    if (isLoading) {
      return null;
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    if (allowedRoles && !allowedRoles.includes(currentRole)) {
      window.location.href = '/unauthorized';
      return null;
    }

    return <Component {...props} />;
  };
}
