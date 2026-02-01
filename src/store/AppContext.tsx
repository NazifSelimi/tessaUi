/**
 * App Context - DEPRECATED
 * 
 * This file is kept for backward compatibility.
 * The app now uses Redux for state management.
 * 
 * For new code, import from:
 * - @/hooks/useAuth for authentication
 * - @/hooks/useCart for cart operations
 * - @/store/hooks for Redux hooks
 */

import React, { type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import type { Product, ProductSize } from '@/types';

// Re-export for backward compatibility
export { useAuth } from '@/hooks/useAuth';
export { useCart } from '@/hooks/useCart';

/**
 * @deprecated Use Redux Provider instead
 */
export function AppProvider({ children }: { children: ReactNode }) {
  console.warn('AppProvider is deprecated. Redux Provider is now used for state management.');
  return <>{children}</>;
}

/**
 * @deprecated Use useAuth and useCart hooks instead
 * This hook combines auth and cart for legacy compatibility
 */
export function useApp() {
  const auth = useAuth();
  const cart = useCart();
  
  return {
    // Auth state
    currentRole: auth.currentRole,
    user: auth.user,
    setRole: auth.setDevRole,
    setUser: () => console.warn('setUser is deprecated, use auth.login instead'),
    
    // Cart state
    cart: cart.items,
    cartDrawerOpen: cart.isDrawerOpen,
    addToCart: (product: Product, size: ProductSize, quantity: number) => {
      cart.addItem(product, size, quantity);
    },
    updateCartQuantity: cart.updateQuantity,
    removeFromCart: cart.removeItem,
    clearCart: cart.clearCart,
    setCartDrawerOpen: (open: boolean) => {
      open ? cart.openDrawer() : cart.closeDrawer();
    },
    getCartTotal: () => ({
      subtotal: cart.subtotal,
      itemCount: cart.itemCount,
    }),
    getPrice: (size: ProductSize): number => {
      const isPro = auth.isProfessional;
      return isPro ? size.stylistPrice : size.retailPrice;
    },
  };
}
