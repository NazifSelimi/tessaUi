'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { categories, brands } from '@/lib/mock-data';
import type { ProductFilters } from '@/lib/types';

interface FiltersSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function FiltersSidebar({ 
  filters, 
  onFiltersChange, 
  onClose,
  isMobile = false 
}: FiltersSidebarProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (slug: string) => {
    const newCategories = filters.categories.includes(slug)
      ? filters.categories.filter(c => c !== slug)
      : [...filters.categories, slug];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleBrandToggle = (slug: string) => {
    const newBrands = filters.brands.includes(slug)
      ? filters.brands.filter(b => b !== slug)
      : [...filters.brands, slug];
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleReset = () => {
    onFiltersChange({
      search: '',
      categories: [],
      brands: [],
      priceRange: [0, 100],
      inStockOnly: false,
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = 
    filters.search ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100 ||
    filters.inStockOnly;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto py-4">
        {/* Sort */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFiltersChange({ 
              ...filters, 
              sortBy: value as ProductFilters['sortBy'] 
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* In Stock Toggle */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <Label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
            In Stock Only
          </Label>
          <Switch
            id="in-stock"
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => onFiltersChange({ 
              ...filters, 
              inStockOnly: checked 
            })}
          />
        </div>

        {/* Categories */}
        <Collapsible 
          open={openSections.categories} 
          onOpenChange={() => toggleSection('categories')}
          className="mb-4"
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
              Categories
              {filters.categories.length > 0 && (
                <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded mr-2">
                  {filters.categories.length}
                </span>
              )}
              {openSections.categories ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="flex flex-col gap-2 max-h-48 overflow-auto">
              {categories.map(category => (
                <label 
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.categories.includes(category.slug)}
                    onCheckedChange={() => handleCategoryToggle(category.slug)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors flex-1">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.productCount}
                  </span>
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Brands */}
        <Collapsible 
          open={openSections.brands} 
          onOpenChange={() => toggleSection('brands')}
          className="mb-4"
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
              Brands
              {filters.brands.length > 0 && (
                <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded mr-2">
                  {filters.brands.length}
                </span>
              )}
              {openSections.brands ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="flex flex-col gap-2">
              {brands.map(brand => (
                <label 
                  key={brand.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.brands.includes(brand.slug)}
                    onCheckedChange={() => handleBrandToggle(brand.slug)}
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors flex-1">
                    {brand.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {brand.productCount}
                  </span>
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible 
          open={openSections.price} 
          onOpenChange={() => toggleSection('price')}
          className="mb-4"
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
              Price Range
              {openSections.price ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="px-1">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => onFiltersChange({ 
                  ...filters, 
                  priceRange: value as [number, number] 
                })}
                min={0}
                max={100}
                step={5}
                className="mb-4"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      priceRange: [Number(e.target.value), filters.priceRange[1]]
                    })}
                    className="h-8 text-sm"
                  />
                </div>
                <span className="text-muted-foreground mt-4">—</span>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      priceRange: [filters.priceRange[0], Number(e.target.value)]
                    })}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="pt-4 border-t border-border">
          <Button className="w-full" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}
