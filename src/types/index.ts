/**
 * Type Definitions for Tessa Shop
 * 
 * Centralized type definitions that match the expected API responses.
 * These types should be kept in sync with the backend models.
 */

// ==================== USER & AUTH ====================

export type UserRole = 'guest' | 'user' | 'stylist' | 'distributor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

// ==================== PRODUCTS ====================

export interface ProductSize {
  id: string;
  size: string;
  retailPrice: number;
  stylistPrice: number;
  stock: number;
  sku?: string;
  barcode?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  images: string[];
  sizes: ProductSize[];
  inStock: boolean;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  productCount?: number;
}

// ==================== CART ====================

export interface CartItem {
  productId: string;
  sizeId: string;
  quantity: number;
  product: Product;
  size: ProductSize;
}

// ==================== ORDERS ====================

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface OrderItem {
  productId: string;
  sizeId: string;
  productName: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  image?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'cod' | 'online' | 'bank_transfer';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  customMessage?: string;
  internalNotes?: string;
  couponCode?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  statusHistory?: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

// ==================== STYLIST REQUESTS ====================

export type StylistRequestStatus = 'pending' | 'approved' | 'rejected';

export interface StylistRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  salonName?: string;
  salonAddress?: string;
  experience?: string;
  licenseNumber?: string;
  referralCode?: string;
  documents?: string[];
  status: StylistRequestStatus;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// ==================== DISTRIBUTOR ====================

export interface StylistCode {
  id: string;
  code: string;
  distributorId: string;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface DistributorStats {
  totalCodes: number;
  usedCodes: number;
  activeCodes: number;
  totalStylists: number;
  monthlySignups: number;
}

// ==================== COUPONS ====================

export type CouponType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'inactive' | 'expired' | 'scheduled';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  usagePerUser?: number;
  audience: UserRole[];
  excludedProducts?: string[];
  excludedCategories?: string[];
  validFrom: string;
  validUntil: string;
  status: CouponStatus;
  description?: string;
}

// ==================== NOTIFICATIONS ====================

export type NotificationType = 
  | 'order_placed' 
  | 'order_shipped' 
  | 'order_delivered'
  | 'stylist_approved'
  | 'stylist_rejected'
  | 'promotion'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// ==================== REVIEWS ====================

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title?: string;
  content: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  createdAt: string;
}

// ==================== SETTINGS ====================

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states?: string[];
  flatRate: number;
  freeShippingThreshold: number;
}

export interface StoreSettings {
  currency: string;
  currencySymbol: string;
  taxRate: number;
  shippingZones: ShippingZone[];
  orderPrefix: string;
  lowStockThreshold: number;
}

// ==================== API RESPONSES ====================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

// ==================== FORM TYPES ====================

export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  customMessage?: string;
  couponCode?: string;
  sameAsBilling?: boolean;
}

export interface StylistApplicationFormData {
  name: string;
  email: string;
  salonName?: string;
  salonAddress?: string;
  experience?: string;
  licenseNumber?: string;
  referralCode?: string;
  about?: string;
}

// ==================== DASHBOARD STATS ====================

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingStylistRequests: number;
  lowStockProducts: number;
  recentOrders: Order[];
  ordersByStatus: Record<OrderStatus, number>;
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { product: Product; sales: number }[];
}
