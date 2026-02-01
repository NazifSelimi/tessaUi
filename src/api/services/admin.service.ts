/**
 * Admin Service
 * 
 * Handles all admin-related API calls including:
 * - Dashboard statistics
 * - Product management (CRUD)
 * - Order management
 * - User management
 * - Stylist request handling
 * - Coupon management
 * - Distributor management
 * 
 * Security Note: All these endpoints should be protected by admin role
 * verification on the backend.
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { 
  Product, Order, User, UserRole, StylistRequest, 
  StylistCode, Coupon, Category, Brand, ProductSize 
} from '@/types';

// Mock data
import { 
  products, orders, users, stylistRequests, 
  stylistCodes, coupons, categories, brands 
} from '@/mock/data';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== DASHBOARD ====================

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingStylistRequests: number;
  recentOrders: Order[];
  ordersByStatus: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

/**
 * Get dashboard statistics
 * 
 * TODO: API endpoint - GET /api/admin/dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<DashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD);
  // return response.data;
  
  const ordersByStatus: Record<string, number> = {};
  orders.forEach(o => {
    ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
  });
  
  return {
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    totalUsers: users.length,
    totalProducts: products.length,
    pendingStylistRequests: stylistRequests.filter(r => r.status === 'pending').length,
    recentOrders: orders.slice(0, 5),
    ordersByStatus,
    revenueByMonth: [
      { month: 'Jan', revenue: 4500 },
      { month: 'Feb', revenue: 5200 },
      { month: 'Mar', revenue: 4800 },
      { month: 'Apr', revenue: 6100 },
      { month: 'May', revenue: 5800 },
      { month: 'Jun', revenue: 7200 },
    ],
  };
}

// ==================== PRODUCTS ====================

interface CreateProductData {
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  sizes: Omit<ProductSize, 'id'>[];
  featured?: boolean;
}

interface UpdateProductData extends Partial<CreateProductData> {
  inStock?: boolean;
}

/**
 * Get all products (admin view with all details)
 * 
 * TODO: API endpoint - GET /api/admin/products
 */
export async function getAdminProducts(): Promise<Product[]> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<{ data: Product[] }>(API_ENDPOINTS.ADMIN.PRODUCTS.LIST);
  // return response.data.data;
  
  return products;
}

/**
 * Create a new product
 * 
 * TODO: API endpoint - POST /api/admin/products
 */
export async function createProduct(data: CreateProductData): Promise<Product> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post<Product>(API_ENDPOINTS.ADMIN.PRODUCTS.CREATE, data);
  // return response.data;
  
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    name: data.name,
    brand: data.brand,
    category: data.category,
    description: data.description,
    images: data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&h=500&fit=crop'],
    sizes: data.sizes.map((s, i) => ({ ...s, id: `size_${Date.now()}_${i}` })),
    inStock: true,
    featured: data.featured || false,
  };
  
  return newProduct;
}

/**
 * Update an existing product
 * 
 * TODO: API endpoint - PUT /api/admin/products/:id
 */
export async function updateProduct(productId: string, data: UpdateProductData): Promise<Product> {
  await delay(500);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.put<Product>(API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(productId), data);
  // return response.data;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  return { ...product, ...data };
}

/**
 * Delete a product
 * 
 * TODO: API endpoint - DELETE /api/admin/products/:id
 */
export async function deleteProduct(productId: string): Promise<void> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // await apiClient.delete(API_ENDPOINTS.ADMIN.PRODUCTS.DELETE(productId));
  
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }
}

/**
 * Update product stock
 * 
 * TODO: API endpoint - PATCH /api/admin/products/:id/stock
 */
export async function updateProductStock(
  productId: string, 
  sizeId: string, 
  stock: number
): Promise<Product> {
  await delay(300);
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  const updatedSizes = product.sizes.map(s => 
    s.id === sizeId ? { ...s, stock } : s
  );
  
  return { ...product, sizes: updatedSizes };
}

// ==================== ORDERS ====================

/**
 * Get all orders (admin view)
 * 
 * TODO: API endpoint - GET /api/admin/orders
 */
export async function getAdminOrders(): Promise<Order[]> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<{ data: Order[] }>(API_ENDPOINTS.ADMIN.ORDERS.LIST);
  // return response.data.data;
  
  return orders;
}

/**
 * Update order status
 * 
 * TODO: API endpoint - PATCH /api/admin/orders/:id/status
 */
export async function updateOrderStatus(
  orderId: string, 
  status: Order['status']
): Promise<Order> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.patch<Order>(
  //   API_ENDPOINTS.ADMIN.ORDERS.UPDATE_STATUS(orderId),
  //   { status }
  // );
  // return response.data;
  
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  return { ...order, status, updatedAt: new Date().toISOString() };
}

/**
 * Update payment status
 * 
 * TODO: API endpoint - PATCH /api/admin/orders/:id/payment
 */
export async function updatePaymentStatus(
  orderId: string, 
  paymentStatus: Order['paymentStatus']
): Promise<Order> {
  await delay(300);
  
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  return { ...order, paymentStatus, updatedAt: new Date().toISOString() };
}

// ==================== USERS ====================

/**
 * Get all users
 * 
 * TODO: API endpoint - GET /api/admin/users
 */
export async function getAdminUsers(): Promise<User[]> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<{ data: User[] }>(API_ENDPOINTS.ADMIN.USERS.LIST);
  // return response.data.data;
  
  return users;
}

/**
 * Update user role
 * 
 * TODO: API endpoint - PATCH /api/admin/users/:id/role
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<User> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.patch<User>(
  //   API_ENDPOINTS.ADMIN.USERS.UPDATE_ROLE(userId),
  //   { role }
  // );
  // return response.data;
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  return { ...user, role };
}

// ==================== STYLIST REQUESTS ====================

/**
 * Get all stylist requests
 * 
 * TODO: API endpoint - GET /api/admin/stylist-requests
 */
export async function getStylistRequests(): Promise<StylistRequest[]> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<{ data: StylistRequest[] }>(
  //   API_ENDPOINTS.ADMIN.STYLIST_REQUESTS.LIST
  // );
  // return response.data.data;
  
  return stylistRequests;
}

/**
 * Approve a stylist request
 * 
 * TODO: API endpoint - POST /api/admin/stylist-requests/:id/approve
 */
export async function approveStylistRequest(requestId: string): Promise<StylistRequest> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.post<StylistRequest>(
  //   API_ENDPOINTS.ADMIN.STYLIST_REQUESTS.APPROVE(requestId)
  // );
  // return response.data;
  
  const request = stylistRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('Request not found');
  }
  
  return {
    ...request,
    status: 'approved',
    reviewedAt: new Date().toISOString(),
    reviewedBy: 'admin@tessa.com',
  };
}

/**
 * Reject a stylist request
 * 
 * TODO: API endpoint - POST /api/admin/stylist-requests/:id/reject
 */
export async function rejectStylistRequest(requestId: string, reason?: string): Promise<StylistRequest> {
  await delay(300);
  
  const request = stylistRequests.find(r => r.id === requestId);
  if (!request) {
    throw new Error('Request not found');
  }
  
  return {
    ...request,
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: 'admin@tessa.com',
  };
}

// ==================== COUPONS ====================

interface CreateCouponData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  usageLimit: number;
  audience: UserRole[];
  validFrom: string;
  validUntil: string;
}

/**
 * Get all coupons
 * 
 * TODO: API endpoint - GET /api/admin/coupons
 */
export async function getAdminCoupons(): Promise<Coupon[]> {
  await delay(300);
  
  return coupons;
}

/**
 * Create a new coupon
 * 
 * TODO: API endpoint - POST /api/admin/coupons
 */
export async function createCoupon(data: CreateCouponData): Promise<Coupon> {
  await delay(300);
  
  // Check for duplicate code
  const existing = coupons.find(c => c.code.toLowerCase() === data.code.toLowerCase());
  if (existing) {
    throw new Error('Coupon code already exists');
  }
  
  const newCoupon: Coupon = {
    ...data,
    id: `coupon_${Date.now()}`,
    usedCount: 0,
    status: 'active',
  };
  
  return newCoupon;
}

/**
 * Update a coupon
 * 
 * TODO: API endpoint - PUT /api/admin/coupons/:id
 */
export async function updateCoupon(couponId: string, data: Partial<CreateCouponData>): Promise<Coupon> {
  await delay(300);
  
  const coupon = coupons.find(c => c.id === couponId);
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  
  return { ...coupon, ...data };
}

/**
 * Delete a coupon
 * 
 * TODO: API endpoint - DELETE /api/admin/coupons/:id
 */
export async function deleteCoupon(couponId: string): Promise<void> {
  await delay(300);
  
  const index = coupons.findIndex(c => c.id === couponId);
  if (index === -1) {
    throw new Error('Coupon not found');
  }
}

/**
 * Toggle coupon status
 * 
 * TODO: API endpoint - PATCH /api/admin/coupons/:id/toggle
 */
export async function toggleCouponStatus(couponId: string): Promise<Coupon> {
  await delay(300);
  
  const coupon = coupons.find(c => c.id === couponId);
  if (!coupon) {
    throw new Error('Coupon not found');
  }
  
  return {
    ...coupon,
    status: coupon.status === 'active' ? 'inactive' : 'active',
  };
}

// ==================== DISTRIBUTORS ====================

/**
 * Get all distributor codes
 * 
 * TODO: API endpoint - GET /api/admin/distributors/codes
 */
export async function getDistributorCodes(distributorId?: string): Promise<StylistCode[]> {
  await delay(300);
  
  if (distributorId) {
    return stylistCodes.filter(c => c.distributorId === distributorId);
  }
  return stylistCodes;
}

/**
 * Generate a new stylist code for a distributor
 * 
 * TODO: API endpoint - POST /api/distributor/codes/generate
 */
export async function generateStylistCode(distributorId: string): Promise<StylistCode> {
  await delay(300);
  
  const code = `TESSA${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  const newCode: StylistCode = {
    id: `code_${Date.now()}`,
    code,
    distributorId,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  
  return newCode;
}

// ==================== CATEGORIES & BRANDS ====================

/**
 * Create a new category
 * 
 * TODO: API endpoint - POST /api/admin/categories
 */
export async function createCategory(name: string): Promise<Category> {
  await delay(300);
  
  return {
    id: `cat_${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  };
}

/**
 * Create a new brand
 * 
 * TODO: API endpoint - POST /api/admin/brands
 */
export async function createBrand(name: string): Promise<Brand> {
  await delay(300);
  
  return {
    id: `brand_${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  };
}
