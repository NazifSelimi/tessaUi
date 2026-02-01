export type UserRole = 'guest' | 'user' | 'stylist' | 'distributor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface ProductSize {
  id: string;
  size: string;
  retailPrice: number;
  stylistPrice: number;
  stock: number;
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
}

export interface CartItem {
  productId: string;
  sizeId: string;
  quantity: number;
  product: Product;
  size: ProductSize;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderItem {
  productId: string;
  sizeId: string;
  productName: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  customMessage?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export type StylistRequestStatus = 'pending' | 'approved' | 'rejected';

export interface StylistRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  salonName?: string;
  salonAddress?: string;
  experience?: string;
  referralCode?: string;
  status: StylistRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface StylistCode {
  id: string;
  code: string;
  distributorId: string;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  usageLimit: number;
  usedCount: number;
  audience: UserRole[];
  validFrom: string;
  validUntil: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}
