'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product, ProductSize, UserRole, User } from './types';

// Mock current user - TODO: Replace with actual auth
const mockUsers: Record<UserRole, User> = {
  guest: { id: 'guest', email: '', name: 'Guest', role: 'guest', createdAt: '' },
  user: { id: '4', email: 'user@email.com', name: 'John Customer', role: 'user', phone: '+1 555-0456', createdAt: '2024-01-10' },
  stylist: { id: '3', email: 'stylist@salon.com', name: 'Sarah Styles', role: 'stylist', phone: '+1 555-0123', createdAt: '2023-06-20' },
  distributor: { id: '2', email: 'distributor@tessa.com', name: 'Distributor Pro', role: 'distributor', createdAt: '2023-03-15' },
  admin: { id: '1', email: 'admin@tessa.com', name: 'Admin User', role: 'admin', createdAt: '2023-01-01' },
};

interface StoreContextType {
  // User & Role
  currentUser: User | null;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, size: ProductSize, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  
  // Price helpers
  getDisplayPrice: (retailPrice: number, stylistPrice: number) => { primary: number; secondary?: number; showBoth?: boolean };
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Role state - defaults to guest for dev, use 'guest' for production
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const currentUser = currentRole === 'guest' ? null : mockUsers[currentRole];
  const isAuthenticated = currentRole !== 'guest';

  const setRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
  }, []);

  // TODO: Replace with actual API call - POST /api/auth/login
  const login = useCallback(async (_email: string, _password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentRole('user');
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentRole('guest');
    setCart([]);
  }, []);

  // Cart functions
  const addToCart = useCallback((product: Product, size: ProductSize, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize.id === size.id
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      
      return [...prev, {
        id: `${product.id}-${size.id}-${Date.now()}`,
        product,
        selectedSize: size,
        quantity,
      }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartTotal = cart.reduce((sum, item) => {
    const price = currentRole === 'stylist' || currentRole === 'distributor'
      ? item.selectedSize.stylistPrice
      : item.selectedSize.retailPrice;
    return sum + price * item.quantity;
  }, 0);

  // Price display helper based on role
  const getDisplayPrice = useCallback((retailPrice: number, stylistPrice: number) => {
    switch (currentRole) {
      case 'stylist':
        return { primary: stylistPrice, secondary: retailPrice, showBoth: false };
      case 'distributor':
        return { primary: retailPrice, secondary: stylistPrice, showBoth: true };
      case 'admin':
        return { primary: retailPrice, secondary: stylistPrice, showBoth: true };
      default:
        return { primary: retailPrice };
    }
  }, [currentRole]);

  return (
    <StoreContext.Provider value={{
      currentUser,
      currentRole,
      setRole,
      isAuthenticated,
      login,
      logout,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isCartOpen,
      setCartOpen,
      getDisplayPrice,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
