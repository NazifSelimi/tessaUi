/**
 * Orders Service
 * 
 * Handles all order-related API calls including:
 * - Creating orders
 * - Fetching order history
 * - Order details and tracking
 * - Coupon validation
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { Order, CartItem, UserRole, Coupon, ShippingAddress } from '@/types';

// Mock data
import { orders, coupons } from '@/mock/data';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Order creation interface
export interface CreateOrderData {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'online';
  customMessage?: string;
  couponCode?: string;
}

// Order list filters
export interface OrderFilters {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
}

/**
 * Get orders for the current user
 * 
 * TODO: API endpoint - GET /api/orders
 */
export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<{ data: Order[] }>(API_ENDPOINTS.ORDERS.LIST, {
  //   params: {
  //     status: filters?.status,
  //     payment_status: filters?.paymentStatus,
  //     date_from: filters?.dateFrom,
  //     date_to: filters?.dateTo,
  //     page: filters?.page || 1,
  //     per_page: filters?.perPage || 20,
  //   },
  // });
  // return response.data.data;
  
  let result = [...orders];
  
  if (filters?.status) {
    result = result.filter(o => o.status === filters.status);
  }
  
  if (filters?.paymentStatus) {
    result = result.filter(o => o.paymentStatus === filters.paymentStatus);
  }
  
  return result;
}

/**
 * Get orders for a specific user (used by admin or for user's own orders)
 * 
 * TODO: API endpoint - GET /api/users/:userId/orders
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  await delay(300);
  
  return orders.filter(o => o.userId === userId);
}

/**
 * Get a single order by ID
 * 
 * TODO: API endpoint - GET /api/orders/:id
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  await delay(200);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<Order>(API_ENDPOINTS.ORDERS.DETAIL(orderId));
  // return response.data;
  
  return orders.find(o => o.id === orderId) || null;
}

/**
 * Create a new order
 * 
 * TODO: API endpoint - POST /api/orders
 * Note: In production, price calculations should be done server-side for security
 */
export async function createOrder(
  data: CreateOrderData, 
  userRole: UserRole
): Promise<Order> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post<Order>(API_ENDPOINTS.ORDERS.CREATE, {
  //   items: data.items.map(item => ({
  //     product_id: item.productId,
  //     size_id: item.sizeId,
  //     quantity: item.quantity,
  //   })),
  //   shipping_address: data.shippingAddress,
  //   payment_method: data.paymentMethod,
  //   custom_message: data.customMessage,
  //   coupon_code: data.couponCode,
  // });
  // return response.data;
  
  // Mock implementation - calculate prices based on user role
  const isProfessional = userRole === 'stylist' || userRole === 'distributor';
  
  const orderItems = data.items.map(item => ({
    productId: item.productId,
    sizeId: item.sizeId,
    productName: item.product.name,
    sizeName: item.size.size,
    quantity: item.quantity,
    unitPrice: isProfessional ? item.size.stylistPrice : item.size.retailPrice,
    total: item.quantity * (isProfessional ? item.size.stylistPrice : item.size.retailPrice),
  }));
  
  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  
  // Apply coupon if provided
  let discount = 0;
  if (data.couponCode) {
    const coupon = await validateCoupon(data.couponCode, userRole, subtotal);
    if (coupon) {
      discount = coupon.type === 'percentage' 
        ? subtotal * (coupon.value / 100)
        : coupon.value;
    }
  }
  
  const newOrder: Order = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    userId: 'current_user',
    items: orderItems,
    subtotal,
    discount,
    shipping,
    total: subtotal + shipping - discount,
    status: 'pending',
    paymentMethod: data.paymentMethod,
    paymentStatus: 'pending',
    shippingAddress: data.shippingAddress,
    customMessage: data.customMessage,
    couponCode: data.couponCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return newOrder;
}

/**
 * Cancel an order
 * 
 * TODO: API endpoint - POST /api/orders/:id/cancel
 */
export async function cancelOrder(orderId: string, reason?: string): Promise<Order> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post<Order>(API_ENDPOINTS.ORDERS.CANCEL(orderId), {
  //   reason,
  // });
  // return response.data;
  
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new Error('Order cannot be cancelled at this stage');
  }
  
  return {
    ...order,
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Validate a coupon code
 * 
 * TODO: API endpoint - POST /api/coupons/validate
 */
export async function validateCoupon(
  code: string, 
  userRole: UserRole, 
  subtotal: number
): Promise<Coupon | null> {
  await delay(200);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post<{ valid: boolean; coupon?: Coupon }>(
  //   API_ENDPOINTS.COUPONS.VALIDATE,
  //   { code, subtotal }
  // );
  // return response.data.valid ? response.data.coupon : null;
  
  const now = new Date();
  const coupon = coupons.find(c => {
    const validFrom = new Date(c.validFrom);
    const validUntil = new Date(c.validUntil);
    
    return (
      c.code.toLowerCase() === code.toLowerCase() &&
      c.status === 'active' &&
      c.audience.includes(userRole) &&
      subtotal >= c.minPurchase &&
      c.usedCount < c.usageLimit &&
      now >= validFrom &&
      now <= validUntil
    );
  });
  
  return coupon || null;
}

/**
 * Calculate shipping cost
 */
export function calculateShipping(subtotal: number, address?: ShippingAddress): number {
  // Free shipping over $50
  if (subtotal >= 50) return 0;
  
  // TODO: Implement zone-based shipping calculation
  return 5.99;
}

/**
 * Estimate delivery date
 */
export function estimateDeliveryDate(shippingMethod = 'standard'): string {
  const now = new Date();
  const deliveryDays = shippingMethod === 'express' ? 2 : 5;
  now.setDate(now.getDate() + deliveryDays);
  return now.toISOString().split('T')[0];
}
