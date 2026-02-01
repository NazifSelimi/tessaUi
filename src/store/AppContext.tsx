'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole, CartItem, Product, ProductSize, User } from '@/types';

interface AppState {
  currentRole: UserRole;
  user: User | null;
  cart: CartItem[];
  cartDrawerOpen: boolean;
}

interface AppContextType extends AppState {
  setRole: (role: UserRole) => void;
  setUser: (user: User | null) => void;
  addToCart: (product: Product, size: ProductSize, quantity: number) => void;
  updateCartQuantity: (productId: string, sizeId: string, quantity: number) => void;
  removeFromCart: (productId: string, sizeId: string) => void;
  clearCart: () => void;
  setCartDrawerOpen: (open: boolean) => void;
  getCartTotal: () => { subtotal: number; itemCount: number };
  getPrice: (size: ProductSize) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentRole: 'guest',
    user: null,
    cart: [],
    cartDrawerOpen: false,
  });

  const setRole = useCallback((role: UserRole) => {
    setState(prev => ({ ...prev, currentRole: role }));
  }, []);

  const setUser = useCallback((user: User | null) => {
    setState(prev => ({ 
      ...prev, 
      user,
      currentRole: user?.role || 'guest',
    }));
  }, []);

  const addToCart = useCallback((product: Product, size: ProductSize, quantity: number) => {
    setState(prev => {
      const existingIndex = prev.cart.findIndex(
        item => item.productId === product.id && item.sizeId === size.id
      );

      if (existingIndex >= 0) {
        const newCart = [...prev.cart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity,
        };
        return { ...prev, cart: newCart, cartDrawerOpen: true };
      }

      return {
        ...prev,
        cart: [...prev.cart, { productId: product.id, sizeId: size.id, quantity, product, size }],
        cartDrawerOpen: true,
      };
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, sizeId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item =>
        item.productId === productId && item.sizeId === sizeId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    }));
  }, []);

  const removeFromCart = useCallback((productId: string, sizeId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => !(item.productId === productId && item.sizeId === sizeId)),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, cart: [] }));
  }, []);

  const setCartDrawerOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, cartDrawerOpen: open }));
  }, []);

  const getPrice = useCallback((size: ProductSize): number => {
    if (state.currentRole === 'stylist' || state.currentRole === 'distributor') {
      return size.stylistPrice;
    }
    return size.retailPrice;
  }, [state.currentRole]);

  const getCartTotal = useCallback(() => {
    const subtotal = state.cart.reduce((sum, item) => {
      const price = getPrice(item.size);
      return sum + price * item.quantity;
    }, 0);
    const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, itemCount };
  }, [state.cart, getPrice]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setRole,
        setUser,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        setCartDrawerOpen,
        getCartTotal,
        getPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
