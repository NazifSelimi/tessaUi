/**
 * Cart Context
 * 
 * Manages shopping cart state with localStorage persistence.
 * Features:
 * - Add/remove/update items
 * - Quantity management
 * - Price calculations based on user role
 * - Cart persistence
 * - Cart drawer state
 */

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, ProductSize } from '@/types';
import { useAuth } from './AuthContext';

// Cart state interface
interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

// Cart context interface
interface CartContextType extends CartState {
  // Cart operations
  addItem: (product: Product, size: ProductSize, quantity?: number) => void;
  removeItem: (productId: string, sizeId: string) => void;
  updateQuantity: (productId: string, sizeId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Cart drawer
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  // Calculations
  itemCount: number;
  subtotal: number;
  getItemPrice: (item: CartItem) => number;
  getItemTotal: (item: CartItem) => number;
  
  // Helpers
  isInCart: (productId: string, sizeId: string) => boolean;
  getCartItem: (productId: string, sizeId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage key
const CART_STORAGE_KEY = 'tessa_cart';

/**
 * Load cart from localStorage
 */
function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return [];
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { currentRole, isProfessional } = useAuth();
  
  const [state, setState] = useState<CartState>({
    items: [],
    isLoading: true,
  });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    const items = loadCartFromStorage();
    setState({
      items,
      isLoading: false,
    });
  }, []);

  // Save cart to storage when items change
  useEffect(() => {
    if (!state.isLoading) {
      saveCartToStorage(state.items);
    }
  }, [state.items, state.isLoading]);

  // Add item to cart
  const addItem = useCallback((product: Product, size: ProductSize, quantity = 1) => {
    setState(prev => {
      const existingIndex = prev.items.findIndex(
        item => item.productId === product.id && item.sizeId === size.id
      );

      let newItems: CartItem[];

      if (existingIndex >= 0) {
        // Update existing item quantity
        newItems = prev.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          sizeId: size.id,
          quantity,
          product,
          size,
        };
        newItems = [...prev.items, newItem];
      }

      return { ...prev, items: newItems };
    });
    
    // Open drawer when adding items
    setIsDrawerOpen(true);
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId: string, sizeId: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(
        item => !(item.productId === productId && item.sizeId === sizeId)
      ),
    }));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, sizeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, sizeId);
      return;
    }

    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId && item.sizeId === sizeId
          ? { ...item, quantity: Math.min(quantity, item.size.stock) }
          : item
      ),
    }));
  }, [removeItem]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, items: [] }));
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  // Drawer controls
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), []);

  // Get price based on user role
  const getItemPrice = useCallback((item: CartItem): number => {
    return isProfessional ? item.size.stylistPrice : item.size.retailPrice;
  }, [isProfessional]);

  // Get total for an item
  const getItemTotal = useCallback((item: CartItem): number => {
    return getItemPrice(item) * item.quantity;
  }, [getItemPrice]);

  // Calculate total item count
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate subtotal
  const subtotal = state.items.reduce((sum, item) => sum + getItemTotal(item), 0);

  // Check if item is in cart
  const isInCart = useCallback((productId: string, sizeId: string): boolean => {
    return state.items.some(
      item => item.productId === productId && item.sizeId === sizeId
    );
  }, [state.items]);

  // Get cart item
  const getCartItem = useCallback((productId: string, sizeId: string): CartItem | undefined => {
    return state.items.find(
      item => item.productId === productId && item.sizeId === sizeId
    );
  }, [state.items]);

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    itemCount,
    subtotal,
    getItemPrice,
    getItemTotal,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook to access cart context
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
