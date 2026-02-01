/**
 * Cart Slice
 * 
 * Manages shopping cart state including:
 * - Cart items with product/size references
 * - Quantity management
 * - Cart drawer visibility
 * 
 * Cart is persisted to localStorage via redux-persist.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product, ProductSize } from '@/types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isDrawerOpen: false,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart or increase quantity if already exists
     */
    addItem: (
      state,
      action: PayloadAction<{
        product: Product;
        size: ProductSize;
        quantity?: number;
      }>
    ) => {
      const { product, size, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id && item.sizeId === size.id
      );

      if (existingIndex >= 0) {
        // Update existing item quantity
        state.items[existingIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          productId: product.id,
          sizeId: size.id,
          quantity,
          product,
          size,
        });
      }
      
      // Auto-open drawer when adding items
      state.isDrawerOpen = true;
    },

    /**
     * Remove item from cart
     */
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; sizeId: string }>
    ) => {
      const { productId, sizeId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.productId === productId && item.sizeId === sizeId)
      );
    },

    /**
     * Update item quantity
     */
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        sizeId: string;
        quantity: number;
      }>
    ) => {
      const { productId, sizeId, quantity } = action.payload;

      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => !(item.productId === productId && item.sizeId === sizeId)
        );
        return;
      }

      // Find and update the item
      const item = state.items.find(
        (item) => item.productId === productId && item.sizeId === sizeId
      );

      if (item) {
        // Clamp quantity to available stock
        item.quantity = Math.min(quantity, item.size.stock);
      }
    },

    /**
     * Clear entire cart
     */
    clearCart: (state) => {
      state.items = [];
    },

    /**
     * Set cart items (useful for syncing with server cart)
     */
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    /**
     * Open cart drawer
     */
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    /**
     * Close cart drawer
     */
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    /**
     * Toggle cart drawer
     */
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Export actions
export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setItems,
  openDrawer,
  closeDrawer,
  toggleDrawer,
  setLoading,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartDrawerOpen = (state: { cart: CartState }) => state.cart.isDrawerOpen;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;

/**
 * Select total item count in cart
 */
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

/**
 * Check if an item is in cart
 */
export const selectIsInCart = (
  state: { cart: CartState },
  productId: string,
  sizeId: string
) => state.cart.items.some(
  (item) => item.productId === productId && item.sizeId === sizeId
);

/**
 * Get a specific cart item
 */
export const selectCartItem = (
  state: { cart: CartState },
  productId: string,
  sizeId: string
) => state.cart.items.find(
  (item) => item.productId === productId && item.sizeId === sizeId
);

export default cartSlice.reducer;
