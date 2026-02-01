/**
 * Redux Store Configuration
 * 
 * Centralized store setup with Redux Toolkit and RTK Query.
 * Features:
 * - Configurable middleware for API calls
 * - Dev tools integration for debugging
 * - Typed hooks for TypeScript support
 * - Persistence ready (localStorage integration)
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import uiReducer from './slices/uiSlice';

// Import RTK Query APIs
import { authApi } from './api/authApi';
import { productsApi } from './api/productsApi';
import { ordersApi } from './api/ordersApi';
import { adminApi } from './api/adminApi';
import { couponsApi } from './api/couponsApi';

// Persist configuration for cart
const cartPersistConfig = {
  key: 'tessa_cart',
  storage,
  whitelist: ['items'], // Only persist items, not drawer state
};

// Persist configuration for auth
const authPersistConfig = {
  key: 'tessa_auth',
  storage,
  whitelist: ['token', 'refreshToken', 'user', 'devRoleOverride'], // Persist auth state
};

// Combine all reducers
const rootReducer = combineReducers({
  // Persisted reducers
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  
  // Non-persisted reducers
  ui: uiReducer,
  
  // RTK Query API reducers
  [authApi.reducerPath]: authApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [couponsApi.reducerPath]: couponsApi.reducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      productsApi.middleware,
      ordersApi.middleware,
      adminApi.middleware,
      couponsApi.middleware,
    ),
  devTools: import.meta.env.DEV,
});

// Setup listeners for RTK Query refetch on focus/reconnect
setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store instance for use outside React components
export default store;
