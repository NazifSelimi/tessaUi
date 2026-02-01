/**
 * Mock Data for Tessa Shop
 * 
 * This file contains mock data for development.
 * All data structures match the expected API response formats.
 * 
 * TODO: Remove this file when connecting to real backend API
 */

import type { Product, User, Order, StylistRequest, StylistCode, Coupon, Category, Brand } from '@/types';

// ==================== CATEGORIES ====================
// Based on requirements: Hair Color, Shampoo, Mask, Activator, Spray, Fluid, 
// Lotion, Bleach and De Color, Tester, Filler, Color Mask, Styling, 
// Hydrogen Peroxide, Conditioner, Sets, Other

export const categories: Category[] = [
  { id: 'cat-1', name: 'Hair Color', slug: 'hair-color' },
  { id: 'cat-2', name: 'Shampoo', slug: 'shampoo' },
  { id: 'cat-3', name: 'Mask', slug: 'mask' },
  { id: 'cat-4', name: 'Activator', slug: 'activator' },
  { id: 'cat-5', name: 'Spray', slug: 'spray' },
  { id: 'cat-6', name: 'Fluid', slug: 'fluid' },
  { id: 'cat-7', name: 'Lotion', slug: 'lotion' },
  { id: 'cat-8', name: 'Bleach & De Color', slug: 'bleach-decolor' },
  { id: 'cat-9', name: 'Tester', slug: 'tester' },
  { id: 'cat-10', name: 'Filler', slug: 'filler' },
  { id: 'cat-11', name: 'Color Mask', slug: 'color-mask' },
  { id: 'cat-12', name: 'Styling', slug: 'styling' },
  { id: 'cat-13', name: 'Hydrogen Peroxide', slug: 'hydrogen-peroxide' },
  { id: 'cat-14', name: 'Conditioner', slug: 'conditioner' },
  { id: 'cat-15', name: 'Sets', slug: 'sets' },
  { id: 'cat-16', name: 'Other', slug: 'other' },
];

// ==================== BRANDS ====================
// Based on requirements: Fanola, Oro Therapy, Rr Line, No Yellow Color, Other

export const brands: Brand[] = [
  { id: 'brand-1', name: 'Fanola', slug: 'fanola' },
  { id: 'brand-2', name: 'Oro Therapy', slug: 'oro-therapy' },
  { id: 'brand-3', name: 'Rr Line', slug: 'rr-line' },
  { id: 'brand-4', name: 'No Yellow Color', slug: 'no-yellow-color' },
  { id: 'brand-5', name: 'Other', slug: 'other' },
];

// ==================== PRODUCTS ====================

export const products: Product[] = [
  // Fanola Products
  {
    id: 'prod-1',
    slug: 'fanola-no-yellow-shampoo',
    name: 'No Yellow Shampoo',
    brand: 'Fanola',
    category: 'shampoo',
    description: 'Ideal for grey, super lightened or decolored hair. The violet pigment neutralizes unwanted yellow tones, leaving hair brighter and shinier. Professional formula for salon-quality results at home.',
    images: [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-1-350', size: '350ml', retailPrice: 18.99, stylistPrice: 14.99, stock: 50 },
      { id: 'prod-1-1000', size: '1000ml', retailPrice: 39.99, stylistPrice: 29.99, stock: 30 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-2',
    slug: 'fanola-no-orange-shampoo',
    name: 'No Orange Shampoo',
    brand: 'Fanola',
    category: 'shampoo',
    description: 'Blue pigmented shampoo that neutralizes orange and copper tones in dark blonde to light brown hair. Perfect for maintaining cool tones between salon visits.',
    images: [
      'https://images.unsplash.com/photo-1594125674956-61a9b49c8ecc?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-2-350', size: '350ml', retailPrice: 18.99, stylistPrice: 14.99, stock: 45 },
      { id: 'prod-2-1000', size: '1000ml', retailPrice: 39.99, stylistPrice: 29.99, stock: 22 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-3',
    slug: 'fanola-keratene-color-care-shampoo',
    name: 'Keratene Color Care Shampoo',
    brand: 'Fanola',
    category: 'shampoo',
    description: 'Gentle cleansing shampoo specifically formulated for color-treated hair. Preserves color vibrancy and adds brilliant shine while protecting against fading.',
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-3-350', size: '350ml', retailPrice: 16.99, stylistPrice: 12.99, stock: 40 },
      { id: 'prod-3-1000', size: '1000ml', retailPrice: 34.99, stylistPrice: 24.99, stock: 20 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-4',
    slug: 'fanola-nutri-care-restructuring-mask',
    name: 'Nutri Care Restructuring Mask',
    brand: 'Fanola',
    category: 'mask',
    description: 'Deep conditioning mask that restructures and nourishes damaged hair. Enriched with milk proteins and natural extracts for intense hydration and repair.',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-4-300', size: '300ml', retailPrice: 22.99, stylistPrice: 17.99, stock: 35 },
      { id: 'prod-4-1000', size: '1000ml', retailPrice: 44.99, stylistPrice: 32.99, stock: 18 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-5',
    slug: 'fanola-color-fixation-spray',
    name: 'Color Fixation Spray',
    brand: 'Fanola',
    category: 'spray',
    description: 'Professional spray treatment that locks in color and extends vibrancy. Creates a protective barrier against environmental damage and UV rays.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-5-200', size: '200ml', retailPrice: 24.99, stylistPrice: 18.99, stock: 28 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-6',
    slug: 'fanola-blue-bleaching-powder',
    name: 'Blue Bleaching Powder',
    brand: 'Fanola',
    category: 'bleach-decolor',
    description: 'Professional blue bleaching powder for up to 7 levels of lift. Dust-free formula with anti-yellow properties for clean, even lightening.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-6-500', size: '500g', retailPrice: 32.99, stylistPrice: 24.99, stock: 25 },
      { id: 'prod-6-1000', size: '1000g', retailPrice: 54.99, stylistPrice: 39.99, stock: 12 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-7',
    slug: 'fanola-developer-oxidizer',
    name: 'Perfumed Oxidizing Cream',
    brand: 'Fanola',
    category: 'hydrogen-peroxide',
    description: 'Professional hydrogen peroxide cream with pleasant fragrance. Available in multiple volumes for all coloring and lightening needs.',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-7-1000-10v', size: '1000ml (10 Vol)', retailPrice: 12.99, stylistPrice: 8.99, stock: 50 },
      { id: 'prod-7-1000-20v', size: '1000ml (20 Vol)', retailPrice: 12.99, stylistPrice: 8.99, stock: 60 },
      { id: 'prod-7-1000-30v', size: '1000ml (30 Vol)', retailPrice: 12.99, stylistPrice: 8.99, stock: 45 },
      { id: 'prod-7-1000-40v', size: '1000ml (40 Vol)', retailPrice: 12.99, stylistPrice: 8.99, stock: 30 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-8',
    slug: 'fanola-nourishing-conditioner',
    name: 'Nourishing Restructuring Conditioner',
    brand: 'Fanola',
    category: 'conditioner',
    description: 'Lightweight yet deeply nourishing conditioner that detangles and smooths without weighing hair down. Perfect for daily use on all hair types.',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-8-350', size: '350ml', retailPrice: 17.99, stylistPrice: 13.99, stock: 38 },
      { id: 'prod-8-1000', size: '1000ml', retailPrice: 36.99, stylistPrice: 26.99, stock: 20 },
    ],
    inStock: true,
    featured: false,
  },

  // Oro Therapy Products
  {
    id: 'prod-9',
    slug: 'oro-therapy-24k-gold-mask',
    name: '24K Gold Hair Mask',
    brand: 'Oro Therapy',
    category: 'mask',
    description: 'Luxurious restructuring mask with micro-active gold and Argan oil. Deeply nourishes and illuminates hair with brilliant shine. A premium treatment for salon-worthy results.',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-9-300', size: '300ml', retailPrice: 34.99, stylistPrice: 26.99, stock: 25 },
      { id: 'prod-9-1000', size: '1000ml', retailPrice: 74.99, stylistPrice: 54.99, stock: 15 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-10',
    slug: 'oro-therapy-illuminating-shampoo',
    name: 'Illuminating Shampoo with Argan Oil',
    brand: 'Oro Therapy',
    category: 'shampoo',
    description: 'Luxurious shampoo enriched with Argan oil and gold particles for exceptional shine and softness. Gently cleanses while nourishing from root to tip.',
    images: [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-10-300', size: '300ml', retailPrice: 28.99, stylistPrice: 21.99, stock: 32 },
      { id: 'prod-10-1000', size: '1000ml', retailPrice: 59.99, stylistPrice: 44.99, stock: 18 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-11',
    slug: 'oro-therapy-illuminating-serum',
    name: 'Illuminating Serum',
    brand: 'Oro Therapy',
    category: 'fluid',
    description: 'Lightweight serum enriched with gold particles that adds incredible shine without weighing hair down. Perfect finishing touch for any style.',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-11-100', size: '100ml', retailPrice: 29.99, stylistPrice: 22.99, stock: 30 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-12',
    slug: 'oro-therapy-24k-gold-fluid',
    name: '24K Gold Restructuring Fluid',
    brand: 'Oro Therapy',
    category: 'fluid',
    description: 'Intensive treatment fluid with 24K gold for damaged hair. Restores elasticity and strength while adding brilliant luminosity.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-12-100', size: '100ml', retailPrice: 34.99, stylistPrice: 26.99, stock: 22 },
    ],
    inStock: true,
    featured: false,
  },

  // Rr Line Products
  {
    id: 'prod-13',
    slug: 'rr-line-argan-star-shampoo',
    name: 'Argan Star Nourishing Shampoo',
    brand: 'Rr Line',
    category: 'shampoo',
    description: 'Gentle cleansing shampoo with Argan oil and star anise extract. Nourishes and protects while adding shine and softness.',
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-13-350', size: '350ml', retailPrice: 14.99, stylistPrice: 10.99, stock: 55 },
      { id: 'prod-13-1000', size: '1000ml', retailPrice: 29.99, stylistPrice: 21.99, stock: 28 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-14',
    slug: 'rr-line-macadamia-star-mask',
    name: 'Macadamia Star Nourishing Mask',
    brand: 'Rr Line',
    category: 'mask',
    description: 'Rich, creamy mask with Macadamia oil for deep nourishment. Restores dry and damaged hair to silky softness.',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-14-300', size: '300ml', retailPrice: 18.99, stylistPrice: 13.99, stock: 40 },
      { id: 'prod-14-1000', size: '1000ml', retailPrice: 38.99, stylistPrice: 28.99, stock: 22 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-15',
    slug: 'rr-line-keratin-star-lotion',
    name: 'Keratin Star Restructuring Lotion',
    brand: 'Rr Line',
    category: 'lotion',
    description: 'Intensive keratin treatment in easy-to-use ampoules. Rebuilds and strengthens damaged hair fibers for visible repair.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-15-12x10', size: '12x10ml', retailPrice: 32.99, stylistPrice: 24.99, stock: 18 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-16',
    slug: 'rr-line-color-star-conditioner',
    name: 'Color Star Protective Conditioner',
    brand: 'Rr Line',
    category: 'conditioner',
    description: 'Color-protecting conditioner that extends vibrancy and prevents fading. Detangles and adds shine to color-treated hair.',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-16-350', size: '350ml', retailPrice: 15.99, stylistPrice: 11.99, stock: 42 },
      { id: 'prod-16-1000', size: '1000ml', retailPrice: 31.99, stylistPrice: 23.99, stock: 20 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-17',
    slug: 'rr-line-styling-spray',
    name: 'Strong Hold Styling Spray',
    brand: 'Rr Line',
    category: 'styling',
    description: 'Professional-strength finishing spray with long-lasting hold. Quick-drying formula that resists humidity without stiffness.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-17-300', size: '300ml', retailPrice: 16.99, stylistPrice: 12.99, stock: 35 },
    ],
    inStock: true,
    featured: false,
  },

  // No Yellow Color Products
  {
    id: 'prod-18',
    slug: 'no-yellow-color-mask',
    name: 'No Yellow Color Mask',
    brand: 'No Yellow Color',
    category: 'color-mask',
    description: 'Intense violet color mask that neutralizes yellow tones in blonde and grey hair. Use weekly for maintenance or leave longer for toning effect.',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-18-300', size: '300ml', retailPrice: 26.99, stylistPrice: 19.99, stock: 28 },
      { id: 'prod-18-1000', size: '1000ml', retailPrice: 54.99, stylistPrice: 39.99, stock: 15 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-19',
    slug: 'no-yellow-color-silver-shampoo',
    name: 'Silver Anti-Yellow Shampoo',
    brand: 'No Yellow Color',
    category: 'shampoo',
    description: 'Extra-strength silver shampoo for intense yellow neutralization. Ideal for very blonde or grey hair that needs maximum toning power.',
    images: [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-19-350', size: '350ml', retailPrice: 22.99, stylistPrice: 16.99, stock: 32 },
      { id: 'prod-19-1000', size: '1000ml', retailPrice: 46.99, stylistPrice: 34.99, stock: 18 },
    ],
    inStock: true,
    featured: false,
  },

  // Hair Color Products
  {
    id: 'prod-20',
    slug: 'fanola-color-cream-professional',
    name: 'Professional Color Cream',
    brand: 'Fanola',
    category: 'hair-color',
    description: 'Professional permanent hair color with intense pigments and conditioning agents. Full grey coverage with vibrant, long-lasting results.',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-20-100', size: '100ml', retailPrice: 12.99, stylistPrice: 8.99, stock: 100 },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: 'prod-21',
    slug: 'oro-therapy-gold-color',
    name: 'Gold Color Professional',
    brand: 'Oro Therapy',
    category: 'hair-color',
    description: 'Premium permanent hair color enriched with gold and keratin. Exceptional coverage with brilliant shine and lasting color.',
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-21-100', size: '100ml', retailPrice: 16.99, stylistPrice: 11.99, stock: 80 },
    ],
    inStock: true,
    featured: false,
  },

  // Activator Products
  {
    id: 'prod-22',
    slug: 'fanola-color-activator',
    name: 'Color Activator Cream',
    brand: 'Fanola',
    category: 'activator',
    description: 'Professional color activator with protective formula. Ensures optimal color development and even coverage.',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-22-1000', size: '1000ml', retailPrice: 14.99, stylistPrice: 9.99, stock: 45 },
    ],
    inStock: true,
    featured: false,
  },

  // Filler Products
  {
    id: 'prod-23',
    slug: 'fanola-filler-therapy',
    name: 'Filler Therapy Treatment',
    brand: 'Fanola',
    category: 'filler',
    description: 'Advanced filler treatment that fills porosity and rebuilds damaged hair structure. Leaves hair smooth, dense, and healthy-looking.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-23-100', size: '100ml', retailPrice: 28.99, stylistPrice: 21.99, stock: 20 },
      { id: 'prod-23-6x12', size: '6x12ml', retailPrice: 36.99, stylistPrice: 27.99, stock: 15 },
    ],
    inStock: true,
    featured: false,
  },

  // Sets
  {
    id: 'prod-24',
    slug: 'fanola-no-yellow-care-set',
    name: 'No Yellow Complete Care Set',
    brand: 'Fanola',
    category: 'sets',
    description: 'Complete care set including No Yellow Shampoo, Mask, and Spray. Everything needed for maintaining beautiful blonde or grey hair.',
    images: [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-24-set', size: 'Complete Set', retailPrice: 54.99, stylistPrice: 39.99, stock: 12 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'prod-25',
    slug: 'oro-therapy-luxury-set',
    name: 'Luxury Gold Treatment Set',
    brand: 'Oro Therapy',
    category: 'sets',
    description: 'Premium gift set with 24K Gold Shampoo, Mask, and Serum. The ultimate luxury hair care experience.',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-25-set', size: 'Luxury Set', retailPrice: 89.99, stylistPrice: 64.99, stock: 8 },
    ],
    inStock: true,
    featured: true,
  },

  // Out of stock example
  {
    id: 'prod-26',
    slug: 'fanola-limited-edition-mask',
    name: 'Limited Edition Holiday Mask',
    brand: 'Fanola',
    category: 'mask',
    description: 'Special limited edition holiday mask with exclusive fragrance. Deep conditioning formula for the festive season.',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&h=500&fit=crop',
    ],
    sizes: [
      { id: 'prod-26-300', size: '300ml', retailPrice: 29.99, stylistPrice: 22.99, stock: 0 },
    ],
    inStock: false,
    featured: false,
  },
];

// ==================== USERS ====================

export const users: User[] = [
  { 
    id: '1', 
    email: 'admin@tessa.com', 
    name: 'Admin User', 
    phone: '+1234567890', 
    role: 'admin', 
    createdAt: '2024-01-01T00:00:00Z' 
  },
  { 
    id: '2', 
    email: 'distributor@tessa.com', 
    name: 'Main Distributor', 
    phone: '+1234567891', 
    role: 'distributor', 
    createdAt: '2024-01-15T00:00:00Z' 
  },
  { 
    id: '3', 
    email: 'stylist@salon.com', 
    name: 'Jane Stylist', 
    phone: '+1234567892', 
    role: 'stylist', 
    createdAt: '2024-02-01T00:00:00Z' 
  },
  { 
    id: '4', 
    email: 'user@email.com', 
    name: 'John Customer', 
    phone: '+1234567893', 
    role: 'user', 
    createdAt: '2024-02-15T00:00:00Z' 
  },
  { 
    id: '5', 
    email: 'maria@beautysalon.com', 
    name: 'Maria Garcia', 
    phone: '+1234567894', 
    role: 'stylist', 
    createdAt: '2024-03-01T00:00:00Z' 
  },
  { 
    id: '6', 
    email: 'david@email.com', 
    name: 'David Johnson', 
    phone: '+1234567895', 
    role: 'user', 
    createdAt: '2024-03-10T00:00:00Z' 
  },
];

// ==================== ORDERS ====================

export const orders: Order[] = [
  {
    id: 'ORD-001',
    userId: '4',
    items: [
      { 
        productId: 'prod-1', 
        sizeId: 'prod-1-350', 
        productName: 'No Yellow Shampoo', 
        sizeName: '350ml', 
        quantity: 2, 
        unitPrice: 18.99, 
        total: 37.98 
      },
      { 
        productId: 'prod-9', 
        sizeId: 'prod-9-300', 
        productName: '24K Gold Hair Mask', 
        sizeName: '300ml', 
        quantity: 1, 
        unitPrice: 34.99, 
        total: 34.99 
      },
    ],
    subtotal: 72.97,
    discount: 0,
    shipping: 5.99,
    total: 78.96,
    status: 'delivered',
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    shippingAddress: {
      fullName: 'John Customer',
      phone: '+1234567893',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-25T14:00:00Z',
  },
  {
    id: 'ORD-002',
    userId: '3',
    items: [
      { 
        productId: 'prod-11', 
        sizeId: 'prod-11-100', 
        productName: 'Illuminating Serum', 
        sizeName: '100ml', 
        quantity: 3, 
        unitPrice: 22.99, 
        total: 68.97 
      },
    ],
    subtotal: 68.97,
    discount: 6.90,
    shipping: 0,
    total: 62.07,
    status: 'shipped',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shippingAddress: {
      fullName: 'Jane Stylist',
      phone: '+1234567892',
      address: '456 Salon Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
    },
    couponCode: 'STYLIST10',
    createdAt: '2024-02-22T09:00:00Z',
    updatedAt: '2024-02-23T11:00:00Z',
  },
  {
    id: 'ORD-003',
    userId: '4',
    items: [
      { 
        productId: 'prod-10', 
        sizeId: 'prod-10-300', 
        productName: 'Illuminating Shampoo with Argan Oil', 
        sizeName: '300ml', 
        quantity: 1, 
        unitPrice: 28.99, 
        total: 28.99 
      },
    ],
    subtotal: 28.99,
    discount: 0,
    shipping: 5.99,
    total: 34.98,
    status: 'pending',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shippingAddress: {
      fullName: 'John Customer',
      phone: '+1234567893',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    customMessage: 'Please leave at door if not home',
    createdAt: '2024-02-25T15:00:00Z',
    updatedAt: '2024-02-25T15:00:00Z',
  },
  {
    id: 'ORD-004',
    userId: '5',
    items: [
      { 
        productId: 'prod-6', 
        sizeId: 'prod-6-1000', 
        productName: 'Blue Bleaching Powder', 
        sizeName: '1000g', 
        quantity: 2, 
        unitPrice: 39.99, 
        total: 79.98 
      },
      { 
        productId: 'prod-7', 
        sizeId: 'prod-7-1000-30v', 
        productName: 'Perfumed Oxidizing Cream', 
        sizeName: '1000ml (30 Vol)', 
        quantity: 4, 
        unitPrice: 8.99, 
        total: 35.96 
      },
    ],
    subtotal: 115.94,
    discount: 11.59,
    shipping: 0,
    total: 104.35,
    status: 'processing',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shippingAddress: {
      fullName: 'Maria Garcia',
      phone: '+1234567894',
      address: '789 Beauty Lane',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
    },
    couponCode: 'STYLIST10',
    createdAt: '2024-02-26T08:00:00Z',
    updatedAt: '2024-02-26T14:00:00Z',
  },
  {
    id: 'ORD-005',
    userId: '6',
    items: [
      { 
        productId: 'prod-24', 
        sizeId: 'prod-24-set', 
        productName: 'No Yellow Complete Care Set', 
        sizeName: 'Complete Set', 
        quantity: 1, 
        unitPrice: 54.99, 
        total: 54.99 
      },
    ],
    subtotal: 54.99,
    discount: 0,
    shipping: 0,
    total: 54.99,
    status: 'confirmed',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shippingAddress: {
      fullName: 'David Johnson',
      phone: '+1234567895',
      address: '321 Oak Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
    },
    createdAt: '2024-02-27T10:00:00Z',
    updatedAt: '2024-02-27T12:00:00Z',
  },
];

// ==================== STYLIST REQUESTS ====================

export const stylistRequests: StylistRequest[] = [
  {
    id: 'SR-001',
    userId: 'pending-1',
    userName: 'Sarah Williams',
    userEmail: 'sarah@beautysalon.com',
    salonName: 'Beauty Haven Salon',
    salonAddress: '789 Style Street, Miami, FL',
    experience: '5 years',
    referralCode: 'DIST2024',
    status: 'pending',
    createdAt: '2024-02-24T10:00:00Z',
  },
  {
    id: 'SR-002',
    userId: 'pending-2',
    userName: 'Mike Johnson',
    userEmail: 'mike@hairstudio.com',
    salonName: 'Hair Studio Pro',
    salonAddress: '321 Beauty Blvd, Chicago, IL',
    experience: '8 years',
    status: 'approved',
    createdAt: '2024-02-20T09:00:00Z',
    reviewedAt: '2024-02-21T14:00:00Z',
    reviewedBy: 'admin@tessa.com',
  },
  {
    id: 'SR-003',
    userId: 'pending-3',
    userName: 'Emily Davis',
    userEmail: 'emily@cutsalon.com',
    salonName: 'Cut & Style',
    experience: '2 years',
    status: 'rejected',
    createdAt: '2024-02-18T11:00:00Z',
    reviewedAt: '2024-02-19T10:00:00Z',
    reviewedBy: 'admin@tessa.com',
  },
  {
    id: 'SR-004',
    userId: 'pending-4',
    userName: 'Lisa Martinez',
    userEmail: 'lisa@glamoursalon.com',
    salonName: 'Glamour Hair Studio',
    salonAddress: '555 Fashion Ave, New York, NY',
    experience: '10 years',
    referralCode: 'STYLE100',
    status: 'pending',
    createdAt: '2024-02-26T16:00:00Z',
  },
];

// ==================== STYLIST CODES ====================

export const stylistCodes: StylistCode[] = [
  { 
    id: 'SC-001', 
    code: 'DIST2024', 
    distributorId: '2', 
    createdAt: '2024-01-20T10:00:00Z', 
    isActive: true 
  },
  { 
    id: 'SC-002', 
    code: 'STYLE100', 
    distributorId: '2', 
    usedBy: '3', 
    usedAt: '2024-02-01T09:00:00Z', 
    createdAt: '2024-01-21T10:00:00Z', 
    isActive: false 
  },
  { 
    id: 'SC-003', 
    code: 'NEWPRO25', 
    distributorId: '2', 
    createdAt: '2024-02-15T10:00:00Z', 
    isActive: true 
  },
  { 
    id: 'SC-004', 
    code: 'TESSA2024', 
    distributorId: '2', 
    createdAt: '2024-02-20T14:00:00Z', 
    isActive: true 
  },
  { 
    id: 'SC-005', 
    code: 'PROBEAUTY', 
    distributorId: '2', 
    usedBy: '5', 
    usedAt: '2024-03-01T11:00:00Z', 
    createdAt: '2024-02-25T09:00:00Z', 
    isActive: false 
  },
];

// ==================== COUPONS ====================

export const coupons: Coupon[] = [
  {
    id: 'C-001',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 50,
    usageLimit: 100,
    usedCount: 45,
    audience: ['user', 'stylist'],
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    status: 'active',
  },
  {
    id: 'C-002',
    code: 'STYLIST20',
    type: 'percentage',
    value: 20,
    minPurchase: 100,
    usageLimit: 50,
    usedCount: 12,
    audience: ['stylist'],
    validFrom: '2024-02-01',
    validUntil: '2024-06-30',
    status: 'active',
  },
  {
    id: 'C-003',
    code: 'FLAT15OFF',
    type: 'fixed',
    value: 15,
    minPurchase: 75,
    usageLimit: 200,
    usedCount: 200,
    audience: ['user', 'stylist', 'distributor'],
    validFrom: '2024-01-15',
    validUntil: '2024-03-15',
    status: 'expired',
  },
  {
    id: 'C-004',
    code: 'SPRING25',
    type: 'percentage',
    value: 25,
    minPurchase: 80,
    usageLimit: 75,
    usedCount: 0,
    audience: ['user', 'stylist', 'distributor'],
    validFrom: '2024-03-01',
    validUntil: '2024-05-31',
    status: 'active',
  },
  {
    id: 'C-005',
    code: 'PROSAVE30',
    type: 'percentage',
    value: 30,
    minPurchase: 200,
    usageLimit: 25,
    usedCount: 3,
    audience: ['stylist', 'distributor'],
    validFrom: '2024-02-15',
    validUntil: '2024-04-15',
    status: 'active',
  },
  {
    id: 'C-006',
    code: 'FREESHIP',
    type: 'fixed',
    value: 5.99,
    minPurchase: 30,
    usageLimit: 500,
    usedCount: 125,
    audience: ['user', 'stylist', 'distributor'],
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    status: 'active',
  },
];
