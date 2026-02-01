/**
 * Cart Context - Redux Bridge
 * 
 * This file provides backward compatibility with the old Context API
 * while using Redux under the hood. Components can continue to use
 * useCart() without changes.
 * 
 * For new code, import useCart directly from @/hooks instead.
 */

import React from 'react';

// Re-export the hook
export { useCart } from '@/hooks/useCart';

// Empty provider for backward compatibility
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
