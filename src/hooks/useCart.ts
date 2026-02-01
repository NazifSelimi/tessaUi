/**
 * useCart Hook
 * 
 * Bridge hook that provides the same API as the old CartContext
 * but uses Redux under the hood.
 */

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  openDrawer,
  closeDrawer,
  toggleDrawer,
  selectCartItems,
  selectCartDrawerOpen,
  selectCartItemCount,
} from '@/store/slices/cartSlice';
import { selectIsProfessional } from '@/store/slices/authSlice';
import type { CartItem, Product, ProductSize } from '@/types';

export function useCart() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const items = useAppSelector(selectCartItems);
  const isDrawerOpen = useAppSelector(selectCartDrawerOpen);
  const itemCount = useAppSelector(selectCartItemCount);
  const isProfessional = useAppSelector(selectIsProfessional);

  // Add item to cart
  const handleAddItem = useCallback((product: Product, size: ProductSize, quantity = 1) => {
    dispatch(addItem({ product, size, quantity }));
  }, [dispatch]);

  // Remove item from cart
  const handleRemoveItem = useCallback((productId: string, sizeId: string) => {
    dispatch(removeItem({ productId, sizeId }));
  }, [dispatch]);

  // Update item quantity
  const handleUpdateQuantity = useCallback((productId: string, sizeId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, sizeId, quantity }));
  }, [dispatch]);

  // Clear entire cart
  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  // Drawer controls
  const handleOpenDrawer = useCallback(() => {
    dispatch(openDrawer());
  }, [dispatch]);

  const handleCloseDrawer = useCallback(() => {
    dispatch(closeDrawer());
  }, [dispatch]);

  const handleToggleDrawer = useCallback(() => {
    dispatch(toggleDrawer());
  }, [dispatch]);

  // Get price based on user role
  const getItemPrice = useCallback((item: CartItem): number => {
    return isProfessional ? item.size.stylistPrice : item.size.retailPrice;
  }, [isProfessional]);

  // Get total for an item
  const getItemTotal = useCallback((item: CartItem): number => {
    return getItemPrice(item) * item.quantity;
  }, [getItemPrice]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + getItemTotal(item), 0);
  }, [items, getItemTotal]);

  // Check if item is in cart
  const isInCart = useCallback((productId: string, sizeId: string): boolean => {
    return items.some(
      item => item.productId === productId && item.sizeId === sizeId
    );
  }, [items]);

  // Get cart item
  const getCartItem = useCallback((productId: string, sizeId: string): CartItem | undefined => {
    return items.find(
      item => item.productId === productId && item.sizeId === sizeId
    );
  }, [items]);

  return {
    // State
    items,
    isLoading: false, // Cart operations are synchronous with redux-persist
    isDrawerOpen,
    
    // Operations
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    
    // Drawer controls
    openDrawer: handleOpenDrawer,
    closeDrawer: handleCloseDrawer,
    toggleDrawer: handleToggleDrawer,
    
    // Calculations
    itemCount,
    subtotal,
    getItemPrice,
    getItemTotal,
    
    // Helpers
    isInCart,
    getCartItem,
  };
}

export default useCart;
