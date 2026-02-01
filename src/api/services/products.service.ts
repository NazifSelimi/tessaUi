/**
 * Products Service
 * 
 * Handles all product-related API calls including:
 * - Product listing with filters
 * - Product details
 * - Categories and brands
 * - Search functionality
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { Product, Category, Brand } from '@/types';

// Mock data
import { products, categories, brands } from '@/mock/data';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Filter parameters interface
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  featured?: boolean;
  sort?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'featured';
  page?: number;
  perPage?: number;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

/**
 * Get products with optional filters
 * 
 * TODO: API endpoint - GET /api/products
 * Query params: category, brand, min_price, max_price, search, in_stock, featured, sort, page, per_page
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.LIST, {
  //   params: {
  //     category: filters?.category,
  //     brand: filters?.brand,
  //     min_price: filters?.minPrice,
  //     max_price: filters?.maxPrice,
  //     search: filters?.search,
  //     in_stock: filters?.inStock,
  //     featured: filters?.featured,
  //     sort: filters?.sort,
  //     page: filters?.page || 1,
  //     per_page: filters?.perPage || 20,
  //   },
  // });
  // return response.data.data;
  
  // Mock implementation with filtering
  let result = [...products];
  
  if (filters?.category) {
    result = result.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
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
      p.brand.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters?.inStock) {
    result = result.filter(p => p.inStock && p.sizes.some(s => s.stock > 0));
  }
  
  if (filters?.featured) {
    result = result.filter(p => p.featured);
  }
  
  // Apply sorting
  if (filters?.sort) {
    result.sort((a, b) => {
      const aPrice = Math.min(...a.sizes.map(s => s.retailPrice));
      const bPrice = Math.min(...b.sizes.map(s => s.retailPrice));
      
      switch (filters.sort) {
        case 'price_asc': return aPrice - bPrice;
        case 'price_desc': return bPrice - aPrice;
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default: return 0;
      }
    });
  }
  
  return result;
}

/**
 * Get a single product by slug
 * 
 * TODO: API endpoint - GET /api/products/:slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay(200);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(slug));
  // return response.data;
  
  return products.find(p => p.slug === slug) || null;
}

/**
 * Get a single product by ID
 * 
 * TODO: API endpoint - GET /api/products/:id
 */
export async function getProductById(id: string): Promise<Product | null> {
  await delay(200);
  
  return products.find(p => p.id === id) || null;
}

/**
 * Get featured products
 * 
 * TODO: API endpoint - GET /api/products/featured
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  await delay(200);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.FEATURED, {
  //   params: { limit },
  // });
  // return response.data;
  
  return products.filter(p => p.featured).slice(0, limit);
}

/**
 * Get related products (same category or brand)
 * 
 * TODO: API endpoint - GET /api/products/:id/related
 */
export async function getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
  await delay(200);
  
  const product = products.find(p => p.id === productId);
  if (!product) return [];
  
  return products
    .filter(p => p.id !== productId && (p.category === product.category || p.brand === product.brand))
    .slice(0, limit);
}

/**
 * Search products
 * 
 * TODO: API endpoint - GET /api/products/search
 */
export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
  await delay(300);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS.SEARCH, {
  //   params: { q: query, limit },
  // });
  // return response.data;
  
  const searchLower = query.toLowerCase();
  return products
    .filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.brand.toLowerCase().includes(searchLower)
    )
    .slice(0, limit);
}

/**
 * Get all categories
 * 
 * TODO: API endpoint - GET /api/categories
 */
export async function getCategories(): Promise<Category[]> {
  await delay(100);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.LIST);
  // return response.data;
  
  return categories;
}

/**
 * Get all brands
 * 
 * TODO: API endpoint - GET /api/brands
 */
export async function getBrands(): Promise<Brand[]> {
  await delay(100);
  
  // TODO: Replace with actual API call
  // const response = await apiClient.get<Brand[]>(API_ENDPOINTS.BRANDS.LIST);
  // return response.data;
  
  return brands;
}
