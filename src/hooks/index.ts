/**
 * Hooks Index
 * 
 * Re-exports all custom hooks for easy importing.
 */

export { useAuth, default as useAuthHook } from './useAuth';
export { useCart, default as useCartHook } from './useCart';

// Re-export Redux hooks
export { 
  useAppDispatch, 
  useAppSelector, 
  useAppStore,
} from '@/store/hooks';

// Re-export RTK Query hooks for direct usage
export {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/store/api/authApi';

export {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductBySlugQuery,
  useLazyGetProductBySlugQuery,
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
} from '@/store/api/productsApi';

export {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} from '@/store/api/ordersApi';

export {
  useValidateCouponMutation,
  useGetAvailableCouponsQuery,
} from '@/store/api/couponsApi';

export {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetStylistRequestsQuery,
  useReviewStylistRequestMutation,
  useGetAdminCouponsQuery,
  useCreateCouponMutation,
  useToggleCouponMutation,
} from '@/store/api/adminApi';
