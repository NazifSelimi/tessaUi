/**
 * Admin API Service (RTK Query)
 * 
 * Handles all admin-related API calls:
 * - Dashboard stats
 * - User management
 * - Order management
 * - Stylist requests
 * - Coupons management
 * 
 * TODO: Replace mock implementations with real API calls
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, mockDelay, API_TAGS } from './baseApi';
import type { 
  User, 
  Order, 
  OrderStatus, 
  StylistRequest, 
  Coupon,
  DashboardStats,
  PaginatedResponse 
} from '@/types';
import { users, orders, stylistRequests, coupons, products } from '@/mock/data';
import { API_ENDPOINTS } from '@/api/endpoints';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    API_TAGS.Dashboard,
    API_TAGS.Users,
    API_TAGS.Orders,
    API_TAGS.StylistRequests,
    API_TAGS.Coupons,
  ],
  endpoints: (builder) => ({
    // ==================== DASHBOARD ====================
    
    /**
     * Get dashboard statistics
     * TODO: Replace with actual API call
     * Endpoint: GET /admin/dashboard
     */
    getDashboardStats: builder.query<DashboardStats, void>({
      // Real API implementation:
      // query: () => API_ENDPOINTS.ADMIN.DASHBOARD,
      
      // Mock implementation:
      queryFn: async () => {
        await mockDelay(300);
        
        const totalRevenue = orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0);
        
        const ordersByStatus = orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<OrderStatus, number>);
        
        const lowStockProducts = products.filter(
          p => p.sizes.some(s => s.stock < 10)
        ).length;
        
        const stats: DashboardStats = {
          totalRevenue,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalProducts: products.length,
          pendingStylistRequests: stylistRequests.filter(r => r.status === 'pending').length,
          lowStockProducts,
          recentOrders: orders.slice(0, 5),
          ordersByStatus,
          revenueByMonth: [
            { month: 'Jan', revenue: 12500 },
            { month: 'Feb', revenue: 15800 },
            { month: 'Mar', revenue: 18200 },
            { month: 'Apr', revenue: 16500 },
            { month: 'May', revenue: 21000 },
            { month: 'Jun', revenue: totalRevenue },
          ],
          topProducts: products.slice(0, 5).map((p, i) => ({
            product: p,
            sales: Math.floor(Math.random() * 100) + 20,
          })),
        };
        
        return { data: stats };
      },
      providesTags: [API_TAGS.Dashboard],
    }),

    // ==================== USERS ====================
    
    /**
     * Get all users
     * TODO: Replace with actual API call
     * Endpoint: GET /admin/users
     */
    getUsers: builder.query<PaginatedResponse<User>, { page?: number; role?: string } | void>({
      queryFn: async (params = {}) => {
        await mockDelay(300);
        
        let filteredUsers = [...users];
        
        if (params?.role) {
          filteredUsers = filteredUsers.filter(u => u.role === params.role);
        }
        
        const page = params?.page || 1;
        const perPage = 10;
        const start = (page - 1) * perPage;
        const paginatedUsers = filteredUsers.slice(start, start + perPage);
        
        return {
          data: {
            data: paginatedUsers,
            meta: {
              currentPage: page,
              lastPage: Math.ceil(filteredUsers.length / perPage),
              perPage,
              total: filteredUsers.length,
              from: start + 1,
              to: Math.min(start + perPage, filteredUsers.length),
            },
          },
        };
      },
      providesTags: [API_TAGS.Users],
    }),

    /**
     * Update user role
     * TODO: Replace with actual API call
     * Endpoint: PATCH /admin/users/:id/role
     */
    updateUserRole: builder.mutation<User, { userId: string; role: string }>({
      queryFn: async ({ userId, role }) => {
        await mockDelay(200);
        
        const user = users.find(u => u.id === userId);
        
        if (!user) {
          return {
            error: {
              status: 404,
              data: { message: 'User not found' },
            },
          };
        }
        
        user.role = role as User['role'];
        
        return { data: user };
      },
      invalidatesTags: [API_TAGS.Users],
    }),

    // ==================== ORDERS ====================
    
    /**
     * Get all orders (admin)
     * TODO: Replace with actual API call
     * Endpoint: GET /admin/orders
     */
    getAdminOrders: builder.query<PaginatedResponse<Order>, { page?: number; status?: string } | void>({
      queryFn: async (params = {}) => {
        await mockDelay(300);
        
        let filteredOrders = [...orders];
        
        if (params?.status) {
          filteredOrders = filteredOrders.filter(o => o.status === params.status);
        }
        
        filteredOrders.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const page = params?.page || 1;
        const perPage = 10;
        const start = (page - 1) * perPage;
        const paginatedOrders = filteredOrders.slice(start, start + perPage);
        
        return {
          data: {
            data: paginatedOrders,
            meta: {
              currentPage: page,
              lastPage: Math.ceil(filteredOrders.length / perPage),
              perPage,
              total: filteredOrders.length,
              from: start + 1,
              to: Math.min(start + perPage, filteredOrders.length),
            },
          },
        };
      },
      providesTags: [API_TAGS.Orders],
    }),

    /**
     * Update order status
     * TODO: Replace with actual API call
     * Endpoint: PATCH /admin/orders/:id/status
     */
    updateOrderStatus: builder.mutation<Order, { orderId: string; status: OrderStatus }>({
      queryFn: async ({ orderId, status }) => {
        await mockDelay(200);
        
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
          return {
            error: {
              status: 404,
              data: { message: 'Order not found' },
            },
          };
        }
        
        order.status = status;
        order.updatedAt = new Date().toISOString();
        
        return { data: order };
      },
      invalidatesTags: (result, error, { orderId }) => [
        { type: API_TAGS.Order, id: orderId },
        API_TAGS.Orders,
        API_TAGS.Dashboard,
      ],
    }),

    // ==================== STYLIST REQUESTS ====================
    
    /**
     * Get stylist requests
     * TODO: Replace with actual API call
     * Endpoint: GET /admin/stylist-requests
     */
    getStylistRequests: builder.query<StylistRequest[], { status?: string } | void>({
      queryFn: async (params = {}) => {
        await mockDelay(300);
        
        let filtered = [...stylistRequests];
        
        if (params?.status) {
          filtered = filtered.filter(r => r.status === params.status);
        }
        
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        return { data: filtered };
      },
      providesTags: [API_TAGS.StylistRequests],
    }),

    /**
     * Review stylist request (approve/reject)
     * TODO: Replace with actual API call
     * Endpoint: POST /admin/stylist-requests/:id/review
     */
    reviewStylistRequest: builder.mutation<StylistRequest, { 
      requestId: string; 
      action: 'approve' | 'reject';
      reason?: string;
    }>({
      queryFn: async ({ requestId, action, reason }) => {
        await mockDelay(200);
        
        const request = stylistRequests.find(r => r.id === requestId);
        
        if (!request) {
          return {
            error: {
              status: 404,
              data: { message: 'Request not found' },
            },
          };
        }
        
        request.status = action === 'approve' ? 'approved' : 'rejected';
        request.reviewedAt = new Date().toISOString();
        
        if (action === 'reject' && reason) {
          request.rejectionReason = reason;
        }
        
        // If approved, update user role
        if (action === 'approve') {
          const user = users.find(u => u.id === request.userId);
          if (user) {
            user.role = 'stylist';
          }
        }
        
        return { data: request };
      },
      invalidatesTags: [API_TAGS.StylistRequests, API_TAGS.Users, API_TAGS.Dashboard],
    }),

    // ==================== COUPONS ====================
    
    /**
     * Get all coupons (admin)
     * TODO: Replace with actual API call
     * Endpoint: GET /admin/coupons
     */
    getAdminCoupons: builder.query<Coupon[], void>({
      queryFn: async () => {
        await mockDelay(300);
        return { data: coupons };
      },
      providesTags: [API_TAGS.Coupons],
    }),

    /**
     * Create coupon
     * TODO: Replace with actual API call
     * Endpoint: POST /admin/coupons
     */
    createCoupon: builder.mutation<Coupon, Omit<Coupon, 'id' | 'usedCount' | 'status'>>({
      queryFn: async (data) => {
        await mockDelay(200);
        
        const newCoupon: Coupon = {
          ...data,
          id: `coupon-${Date.now()}`,
          usedCount: 0,
          status: 'active',
        };
        
        coupons.push(newCoupon);
        
        return { data: newCoupon };
      },
      invalidatesTags: [API_TAGS.Coupons],
    }),

    /**
     * Toggle coupon active status
     * TODO: Replace with actual API call
     * Endpoint: POST /admin/coupons/:id/toggle
     */
    toggleCoupon: builder.mutation<Coupon, string>({
      queryFn: async (couponId) => {
        await mockDelay(200);
        
        const coupon = coupons.find(c => c.id === couponId);
        
        if (!coupon) {
          return {
            error: {
              status: 404,
              data: { message: 'Coupon not found' },
            },
          };
        }
        
        coupon.isActive = !coupon.isActive;
        coupon.status = coupon.isActive ? 'active' : 'inactive';
        
        return { data: coupon };
      },
      invalidatesTags: [API_TAGS.Coupons],
    }),
  }),
});

// Export hooks
export const {
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
} = adminApi;
