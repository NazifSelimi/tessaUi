'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Grid3X3, LayoutList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ProductCard } from '@/components/product-card';
import { FiltersSidebar } from '@/components/filters-sidebar';
import { MobileFiltersSheet } from '@/components/mobile-filters-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { products } from '@/lib/mock-data';
import type { ProductFilters } from '@/lib/types';

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const searchParams = useSearchParams();
  
  // Initialize filters from URL params
  const initialCategory = searchParams.get('category');
  const initialBrand = searchParams.get('brand');
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState<ProductFilters>({
    search: initialSearch,
    categories: initialCategory ? [initialCategory] : [],
    brands: initialBrand ? [initialBrand] : [],
    priceRange: [0, 100],
    inStockOnly: false,
    sortBy: 'newest',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading] = useState(false);

  // TODO: Replace with API call - GET /api/products with filters
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => 
        filters.categories.some(c => 
          p.category.toLowerCase().replace(/\s+/g, '-') === c ||
          p.category.toLowerCase() === c
        )
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter(p => 
        filters.brands.some(b => 
          p.brand.toLowerCase().replace(/\s+/g, '-') === b ||
          p.brand.toLowerCase() === b
        )
      );
    }

    // Price filter
    result = result.filter(p => {
      const minPrice = Math.min(...p.sizes.map(s => s.retailPrice));
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
    });

    // In stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => 
        p.sizes.some(s => s.stock > 0)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const aPrice = Math.min(...a.sizes.map(s => s.retailPrice));
          const bPrice = Math.min(...b.sizes.map(s => s.retailPrice));
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const aPrice = Math.min(...a.sizes.map(s => s.retailPrice));
          const bPrice = Math.min(...b.sizes.map(s => s.retailPrice));
          return bPrice - aPrice;
        });
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Shop</h1>
        <p className="text-muted-foreground">
          Professional hair care products for stylists and enthusiasts
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FiltersSidebar 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filters */}
              <MobileFiltersSheet
                filters={filters}
                onFiltersChange={handleFiltersChange}
                activeFilterCount={activeFilterCount}
              />

              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-4">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </p>

          {/* Product Grid */}
          {isLoading ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'flex flex-col gap-4'
            }>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} viewMode={viewMode} />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-24 w-24 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button 
                variant="outline"
                onClick={() => handleFiltersChange({
                  search: '',
                  categories: [],
                  brands: [],
                  priceRange: [0, 100],
                  inStockOnly: false,
                  sortBy: 'newest',
                })}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'flex flex-col gap-4'
            }>
              {paginatedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 p-4 border border-border rounded-lg">
        <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-full max-w-xs" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
