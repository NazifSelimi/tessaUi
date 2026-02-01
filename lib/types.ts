// User Types
export type UserRole = 'guest' | 'user' | 'stylist' | 'distributor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

// Product Types
export interface ProductSize {
  id: string;
  size: string; // e.g., "100ml", "250ml", "1L"
  retailPrice: number;
  stylistPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  ingredients?: string;
  usage?: string;
  images: string[];
  sizes: ProductSize[];
  isNew?: boolean;
  isSale?: boolean;
  salePercent?: number;
  rating?: number;
  reviewCount?: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

// Category and Brand
export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  productCount: number;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'cod' | 'online';
  notes?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: { status: OrderStatus; date: string; note?: string }[];
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Stylist Request
export type StylistRequestStatus = 'pending' | 'approved' | 'rejected';

export interface StylistRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  licenseNumber?: string;
  stylistCode?: string;
  status: StylistRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// Distributor Code
export type CodeStatus = 'unused' | 'used' | 'expired';

export interface StylistCode {
  id: string;
  code: string;
  distributorId: string;
  status: CodeStatus;
  usedBy?: string;
  usedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

// Coupon Types
export type CouponType = 'percent' | 'fixed';
export type CouponAudience = 'all' | 'stylist-only' | 'user-only';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  audience: CouponAudience;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
}

// Filter Types
export interface ProductFilters {
  search: string;
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'name' | 'popular';
}
