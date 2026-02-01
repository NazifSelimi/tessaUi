/**
 * Products API Service (RTK Query)
 * 
 * Handles all product-related API calls:
 * - List products with filtering/pagination
 * - Get single product
 * - Categories and brands
 * 
 * TODO: Replace mock implementations with real API calls
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, mockDelay, API_TAGS } from './baseApi';
import type { Product, Category, Brand, PaginatedResponse } from '@/types';
import { products, categories, brands } from '@/mock/data';
import { API_ENDPOINTS } from '@/api/endpoints';

// Query params for products list
interface ProductsQueryParams {
  page?: number;
  perPage?: number;
  category?: string;
  brand?: string;
  search?: string;
  featured?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [API_TAGS.Products, API_TAGS.Product, API_TAGS.Categories, API_TAGS.Brands],
  endpoints: (builder) => ({
    /**
     * Get all products with optional filtering
     * TODO: Replace with actual API call
     * Endpoint: GET /products
     */
    getProducts: builder.query<PaginatedResponse<Product>, ProductsQueryParams | void>({
      // Real API implementation:
      // query: (params = {}) => ({
      //   url: API_ENDPOINTS.PRODUCTS.LIST,
      //   params,
      // }),
      
      // Mock implementation:
      queryFn: async (params = {}) => {
        await mockDelay(300);
        
        let filteredProducts = [...products];
        
        // Apply filters
        if (params?.category) {
          filteredProducts = filteredProducts.filter(
            p => p.category.toLowerCase() === params.category!.toLowerCase()
          );
        }
        
        if (params?.brand) {
          filteredProducts = filteredProducts.filter(
            p => p.brand.toLowerCase() === params.brand!.toLowerCase()
          );
        }
        
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            p => p.name.toLowerCase().includes(searchLower) ||
                 p.description.toLowerCase().includes(searchLower)
          );
        }
        
        if (params?.featured !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.featured === params.featured);
        }
        
        // Sorting
        if (params?.sortBy) {
          filteredProducts.sort((a, b) => {
            let comparison = 0;
            switch (params.sortBy) {
              case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
              case 'price':
                comparison = a.sizes[0].retailPrice - b.sizes[0].retailPrice;
                break;
              case 'createdAt':
                comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                break;
            }
            return params.sortOrder === 'desc' ? -comparison : comparison;
          });
        }
        
        // Pagination
        const page = params?.page || 1;
        const perPage = params?.perPage || 12;
        const start = (page - 1) * perPage;
        const paginatedProducts = filteredProducts.slice(start, start + perPage);
        
        return {
          data: {
            data: paginatedProducts,
            meta: {
              currentPage: page,
              lastPage: Math.ceil(filteredProducts.length / perPage),
              perPage,
              total: filteredProducts.length,
              from: start + 1,
              to: Math.min(start + perPage, filteredProducts.length),
            },
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: API_TAGS.Product as const, id })),
              { type: API_TAGS.Products, id: 'LIST' },
            ]
          : [{ type: API_TAGS.Products, id: 'LIST' }],
    }),

    /**
     * Get single product by slug
     * TODO: Replace with actual API call
     * Endpoint: GET /products/:slug
     */
    getProductBySlug: builder.query<Product, string>({
      // Real API implementation:
      // query: (slug) => API_ENDPOINTS.PRODUCTS.DETAIL(slug),
      
      // Mock implementation:
      queryFn: async (slug) => {
        await mockDelay(200);
        
        const product = products.find(p => p.slug === slug);
        
        if (!product) {
          return {
            error: {
              status: 404,
              data: { message: 'Product not found' },
            },
          };
        }
        
        return { data: product };
      },
      providesTags: (result, error, slug) => [{ type: API_TAGS.Product, id: slug }],
    }),

    /**
     * Get featured products
     * TODO: Replace with actual API call
     * Endpoint: GET /products/featured
     */
    getFeaturedProducts: builder.query<Product[], number | void>({
      // Real API implementation:
      // query: (limit = 8) => ({
      //   url: API_ENDPOINTS.PRODUCTS.FEATURED,
      //   params: { limit },
      // }),
      
      // Mock implementation:
      queryFn: async (limit = 8) => {
        await mockDelay(200);
        
        const featured = products.filter(p => p.featured).slice(0, limit);
        return { data: featured };
      },
      providesTags: [{ type: API_TAGS.Products, id: 'FEATURED' }],
    }),

    /**
     * Get all categories
     * TODO: Replace with actual API call
     * Endpoint: GET /categories
     */
    getCategories: builder.query<Category[], void>({
      // Real API implementation:
      // query: () => API_ENDPOINTS.CATEGORIES.LIST,
      
      // Mock implementation:
      queryFn: async () => {
        await mockDelay(200);
        return { data: categories };
      },
      providesTags: [API_TAGS.Categories],
    }),

    /**
     * Get all brands
     * TODO: Replace with actual API call
     * Endpoint: GET /brands
     */
    getBrands: builder.query<Brand[], void>({
      // Real API implementation:
      // query: () => API_ENDPOINTS.BRANDS.LIST,
      
      // Mock implementation:
      queryFn: async () => {
        await mockDelay(200);
        return { data: brands };
      },
      providesTags: [API_TAGS.Brands],
    }),

    /**
     * Search products
     * TODO: Replace with actual API call
     * Endpoint: GET /products/search
     */
    searchProducts: builder.query<Product[], string>({
      // Real API implementation:
      // query: (query) => ({
      //   url: API_ENDPOINTS.PRODUCTS.SEARCH,
      //   params: { q: query },
      // }),
      
      // Mock implementation:
      queryFn: async (query) => {
        await mockDelay(200);
        
        const searchLower = query.toLowerCase();
        const results = products.filter(
          p => p.name.toLowerCase().includes(searchLower) ||
               p.description.toLowerCase().includes(searchLower) ||
               p.brand.toLowerCase().includes(searchLower) ||
               p.category.toLowerCase().includes(searchLower)
        );
        
        return { data: results };
      },
    }),
  }),
});

// Export hooks
export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductBySlugQuery,
  useLazyGetProductBySlugQuery,
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
} = productsApi;
