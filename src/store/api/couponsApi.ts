/**
 * Coupons API Service (RTK Query)
 * 
 * Handles coupon validation and application.
 * 
 * TODO: Replace mock implementations with real API calls
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, mockDelay, API_TAGS } from './baseApi';
import type { Coupon } from '@/types';
import { coupons } from '@/mock/data';
import { API_ENDPOINTS } from '@/api/endpoints';

// Response types
interface ValidateCouponResponse {
  valid: boolean;
  coupon?: Coupon;
  message?: string;
}

export const couponsApi = createApi({
  reducerPath: 'couponsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [API_TAGS.Coupons],
  endpoints: (builder) => ({
    /**
     * Validate a coupon code
     * TODO: Replace with actual API call
     * Endpoint: POST /coupons/validate
     */
    validateCoupon: builder.mutation<ValidateCouponResponse, { code: string; subtotal?: number }>({
      // Real API implementation:
      // query: (data) => ({
      //   url: API_ENDPOINTS.COUPONS.VALIDATE,
      //   method: 'POST',
      //   body: data,
      // }),
      
      // Mock implementation:
      queryFn: async ({ code, subtotal = 0 }) => {
        await mockDelay(300);
        
        const coupon = coupons.find(
          c => c.code.toUpperCase() === code.toUpperCase() && c.isActive
        );
        
        if (!coupon) {
          return {
            data: {
              valid: false,
              message: 'Invalid coupon code',
            },
          };
        }
        
        // Check expiration
        if (new Date(coupon.expiresAt) < new Date()) {
          return {
            data: {
              valid: false,
              message: 'This coupon has expired',
            },
          };
        }
        
        // Check minimum purchase
        if (coupon.minPurchase && subtotal < coupon.minPurchase) {
          return {
            data: {
              valid: false,
              message: `Minimum purchase of $${coupon.minPurchase} required`,
            },
          };
        }
        
        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          return {
            data: {
              valid: false,
              message: 'Coupon usage limit reached',
            },
          };
        }
        
        return {
          data: {
            valid: true,
            coupon,
          },
        };
      },
    }),

    /**
     * Get available coupons for user
     * TODO: Replace with actual API call
     */
    getAvailableCoupons: builder.query<Coupon[], void>({
      queryFn: async () => {
        await mockDelay(200);
        
        const now = new Date();
        const available = coupons.filter(
          c => c.isActive && 
               new Date(c.expiresAt) > now &&
               (!c.usageLimit || c.usedCount < c.usageLimit)
        );
        
        return { data: available };
      },
      providesTags: [API_TAGS.Coupons],
    }),
  }),
});

// Export hooks
export const {
  useValidateCouponMutation,
  useGetAvailableCouponsQuery,
} = couponsApi;
