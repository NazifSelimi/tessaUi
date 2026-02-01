/**
 * API Client for Tessa Shop
 * 
 * This file contains the API interface layer.
 * Currently uses mock data but is structured to easily connect to a Laravel backend.
 * 
 * TODO: Replace mock implementations with actual API calls to Laravel backend
 */

import { products, users, orders, stylistRequests, stylistCodes, coupons, categories, brands } from '@/mock/data';
import type { Product, User, Order, StylistRequest, StylistCode, Coupon, Category, Brand, CartItem, UserRole } from '@/types';

// Simulated delay for more realistic mock behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ Products ============

export async function getProducts(filters?: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
}): Promise<Product[]> {
  await delay(300);
  // TODO: Replace with API call: GET /api/products
  let result = [...products];
  
  if (filters?.category) {
    result = result.filter(p => p.category === filters.category);
  }
  if (filters?.brand) {
    result = result.filter(p => p.brand.toLowerCase() === filters.brand?.toLowerCase());
  }
  if (filters?.minPrice !== undefined) {
    result = result.filter(p => p.sizes.some(s => s.retailPrice >= (filters.minPrice || 0)));
  }
  if (filters?.maxPrice !== undefined) {
    result = result.filter(p => p.sizes.some(s => s.retailPrice <= (filters.maxPrice || Infinity)));
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.brand.toLowerCase().includes(searchLower)
    );
  }
  if (filters?.inStock) {
    result = result.filter(p => p.inStock && p.sizes.some(s => s.stock > 0));
  }
  
  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await delay(200);
  // TODO: Replace with API call: GET /api/products/:slug
  return products.find(p => p.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  await delay(100);
  // TODO: Replace with API call: GET /api/categories
  return categories;
}

export async function getBrands(): Promise<Brand[]> {
  await delay(100);
  // TODO: Replace with API call: GET /api/brands
  return brands;
}

// ============ Auth ============

export async function login(email: string, _password: string): Promise<User | null> {
  await delay(500);
  // TODO: Replace with API call: POST /api/auth/login
  const user = users.find(u => u.email === email);
  return user || null;
}

export async function register(_data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<User> {
  await delay(500);
  // TODO: Replace with API call: POST /api/auth/register
  const newUser: User = {
    id: String(Date.now()),
    email: _data.email,
    name: _data.name,
    phone: _data.phone,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  return newUser;
}

export async function forgotPassword(_email: string): Promise<boolean> {
  await delay(500);
  // TODO: Replace with API call: POST /api/auth/forgot-password
  return true;
}

// ============ Orders ============

export async function getOrders(userId?: string): Promise<Order[]> {
  await delay(300);
  // TODO: Replace with API call: GET /api/orders
  if (userId) {
    return orders.filter(o => o.userId === userId);
  }
  return orders;
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  await delay(200);
  // TODO: Replace with API call: GET /api/orders/:id
  return orders.find(o => o.id === orderId);
}

export async function createOrder(_data: {
  items: CartItem[];
  shippingAddress: Order['shippingAddress'];
  paymentMethod: 'cod' | 'online';
  customMessage?: string;
  couponCode?: string;
  userRole: UserRole;
}): Promise<Order> {
  await delay(500);
  // TODO: Replace with API call: POST /api/orders
  const newOrder: Order = {
    id: `ORD-${String(Date.now()).slice(-6)}`,
    userId: '4',
    items: _data.items.map(item => ({
      productId: item.productId,
      sizeId: item.sizeId,
      productName: item.product.name,
      sizeName: item.size.size,
      quantity: item.quantity,
      unitPrice: _data.userRole === 'stylist' || _data.userRole === 'distributor' 
        ? item.size.stylistPrice 
        : item.size.retailPrice,
      total: item.quantity * (_data.userRole === 'stylist' || _data.userRole === 'distributor' 
        ? item.size.stylistPrice 
        : item.size.retailPrice),
    })),
    subtotal: 0,
    discount: 0,
    shipping: 5.99,
    total: 0,
    status: 'pending',
    paymentMethod: _data.paymentMethod,
    paymentStatus: 'pending',
    shippingAddress: _data.shippingAddress,
    customMessage: _data.customMessage,
    couponCode: _data.couponCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  newOrder.subtotal = newOrder.items.reduce((sum, item) => sum + item.total, 0);
  newOrder.total = newOrder.subtotal + newOrder.shipping - newOrder.discount;
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | undefined> {
  await delay(300);
  // TODO: Replace with API call: PATCH /api/orders/:id/status
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
  }
  return order;
}

// ============ Users (Admin) ============

export async function getUsers(): Promise<User[]> {
  await delay(300);
  // TODO: Replace with API call: GET /api/admin/users
  return users;
}

export async function updateUserRole(userId: string, role: UserRole): Promise<User | undefined> {
  await delay(300);
  // TODO: Replace with API call: PATCH /api/admin/users/:id/role
  const user = users.find(u => u.id === userId);
  if (user) {
    user.role = role;
  }
  return user;
}

// ============ Stylist Requests ============

export async function getStylistRequests(): Promise<StylistRequest[]> {
  await delay(300);
  // TODO: Replace with API call: GET /api/admin/stylist-requests
  return stylistRequests;
}

export async function createStylistRequest(_data: {
  userId: string;
  userName: string;
  userEmail: string;
  salonName?: string;
  salonAddress?: string;
  experience?: string;
  referralCode?: string;
}): Promise<StylistRequest> {
  await delay(500);
  // TODO: Replace with API call: POST /api/stylist-requests
  const newRequest: StylistRequest = {
    id: `SR-${String(Date.now()).slice(-6)}`,
    ..._data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  return newRequest;
}

export async function reviewStylistRequest(
  requestId: string, 
  action: 'approve' | 'reject',
  _reviewerEmail: string
): Promise<StylistRequest | undefined> {
  await delay(300);
  // TODO: Replace with API call: PATCH /api/admin/stylist-requests/:id/review
  const request = stylistRequests.find(r => r.id === requestId);
  if (request) {
    request.status = action === 'approve' ? 'approved' : 'rejected';
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = _reviewerEmail;
  }
  return request;
}

// ============ Stylist Codes (Distributor) ============

export async function getStylistCodes(distributorId?: string): Promise<StylistCode[]> {
  await delay(300);
  // TODO: Replace with API call: GET /api/distributor/stylist-codes
  if (distributorId) {
    return stylistCodes.filter(c => c.distributorId === distributorId);
  }
  return stylistCodes;
}

export async function createStylistCode(distributorId: string): Promise<StylistCode> {
  await delay(300);
  // TODO: Replace with API call: POST /api/distributor/stylist-codes
  const code = `CODE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const newCode: StylistCode = {
    id: `SC-${String(Date.now()).slice(-6)}`,
    code,
    distributorId,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  return newCode;
}

// ============ Coupons ============

export async function getCoupons(): Promise<Coupon[]> {
  await delay(300);
  // TODO: Replace with API call: GET /api/admin/coupons
  return coupons;
}

export async function validateCoupon(code: string, userRole: UserRole, subtotal: number): Promise<Coupon | null> {
  await delay(200);
  // TODO: Replace with API call: POST /api/coupons/validate
  const coupon = coupons.find(c => 
    c.code === code && 
    c.status === 'active' && 
    c.audience.includes(userRole) &&
    subtotal >= c.minPurchase &&
    c.usedCount < c.usageLimit
  );
  return coupon || null;
}

export async function createCoupon(data: Omit<Coupon, 'id' | 'usedCount' | 'status'>): Promise<Coupon> {
  await delay(300);
  // TODO: Replace with API call: POST /api/admin/coupons
  const newCoupon: Coupon = {
    ...data,
    id: `C-${String(Date.now()).slice(-6)}`,
    usedCount: 0,
    status: 'active',
  };
  return newCoupon;
}
