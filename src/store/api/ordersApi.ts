/**
 * Orders API Service (RTK Query)
 * 
 * Handles all order-related API calls:
 * - Create order
 * - Get user orders
 * - Get order details
 * 
 * TODO: Replace mock implementations with real API calls
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, mockDelay, API_TAGS } from './baseApi';
import type { Order, OrderItem, ShippingAddress, PaymentMethod, PaginatedResponse } from '@/types';
import { orders } from '@/mock/data';
import { API_ENDPOINTS } from '@/api/endpoints';

// Request types
interface CreateOrderRequest {
  items: Array<{
    productId: string;
    sizeId: string;
    quantity: number;
    productName: string;
    sizeName: string;
    unitPrice: number;
    image?: string;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  customMessage?: string;
  couponCode?: string;
}

// Query params
interface OrdersQueryParams {
  page?: number;
  perPage?: number;
  status?: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [API_TAGS.Orders, API_TAGS.Order],
  endpoints: (builder) => ({
    /**
     * Get user's orders
     * TODO: Replace with actual API call
     * Endpoint: GET /orders
     */
    getOrders: builder.query<PaginatedResponse<Order>, OrdersQueryParams | void>({
      // Real API implementation:
      // query: (params = {}) => ({
      //   url: API_ENDPOINTS.ORDERS.LIST,
      //   params,
      // }),
      
      // Mock implementation:
      queryFn: async (params = {}) => {
        await mockDelay(300);
        
        let filteredOrders = [...orders];
        
        // Filter by status
        if (params?.status) {
          filteredOrders = filteredOrders.filter(o => o.status === params.status);
        }
        
        // Sort by date (newest first)
        filteredOrders.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Pagination
        const page = params?.page || 1;
        const perPage = params?.perPage || 10;
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
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: API_TAGS.Order as const, id })),
              { type: API_TAGS.Orders, id: 'LIST' },
            ]
          : [{ type: API_TAGS.Orders, id: 'LIST' }],
    }),

    /**
     * Get single order by ID
     * TODO: Replace with actual API call
     * Endpoint: GET /orders/:id
     */
    getOrderById: builder.query<Order, string>({
      // Real API implementation:
      // query: (id) => API_ENDPOINTS.ORDERS.DETAIL(id),
      
      // Mock implementation:
      queryFn: async (id) => {
        await mockDelay(200);
        
        const order = orders.find(o => o.id === id);
        
        if (!order) {
          return {
            error: {
              status: 404,
              data: { message: 'Order not found' },
            },
          };
        }
        
        return { data: order };
      },
      providesTags: (result, error, id) => [{ type: API_TAGS.Order, id }],
    }),

    /**
     * Create new order
     * TODO: Replace with actual API call
     * Endpoint: POST /orders
     */
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      // Real API implementation:
      // query: (data) => ({
      //   url: API_ENDPOINTS.ORDERS.CREATE,
      //   method: 'POST',
      //   body: data,
      // }),
      
      // Mock implementation:
      queryFn: async (data) => {
        await mockDelay(500);
        
        // Calculate totals
        const items: OrderItem[] = data.items.map(item => ({
          ...item,
          total: item.unitPrice * item.quantity,
        }));
        
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const shipping = subtotal >= 100 ? 0 : 10; // Free shipping over $100
        const discount = 0; // TODO: Apply coupon discount
        const total = subtotal + shipping - discount;
        
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          userId: 'current-user', // Would be from auth state
          items,
          subtotal,
          discount,
          shipping,
          total,
          status: 'pending',
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'pending',
          shippingAddress: data.shippingAddress,
          customMessage: data.customMessage,
          couponCode: data.couponCode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        orders.unshift(newOrder);
        
        return { data: newOrder };
      },
      invalidatesTags: [{ type: API_TAGS.Orders, id: 'LIST' }],
    }),

    /**
     * Cancel order
     * TODO: Replace with actual API call
     * Endpoint: POST /orders/:id/cancel
     */
    cancelOrder: builder.mutation<Order, string>({
      // Real API implementation:
      // query: (id) => ({
      //   url: API_ENDPOINTS.ORDERS.CANCEL(id),
      //   method: 'POST',
      // }),
      
      // Mock implementation:
      queryFn: async (id) => {
        await mockDelay(300);
        
        const order = orders.find(o => o.id === id);
        
        if (!order) {
          return {
            error: {
              status: 404,
              data: { message: 'Order not found' },
            },
          };
        }
        
        // Only allow cancellation of pending orders
        if (order.status !== 'pending' && order.status !== 'confirmed') {
          return {
            error: {
              status: 422,
              data: { message: 'Order cannot be cancelled at this stage' },
            },
          };
        }
        
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
        
        return { data: order };
      },
      invalidatesTags: (result, error, id) => [
        { type: API_TAGS.Order, id },
        { type: API_TAGS.Orders, id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
} = ordersApi;
