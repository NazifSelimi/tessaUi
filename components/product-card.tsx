'use client';

import React from "react"

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/price-display';
import { useStore } from '@/lib/store';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useStore();
  const defaultSize = product.sizes[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultSize, 1);
  };

  return (
    <Link 
      href={`/products/${product.slug}`}
      className={cn(
        'group relative flex flex-col bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-lg hover:border-accent/30',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-secondary/30 overflow-hidden">
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-[color:var(--new-badge)] text-[color:var(--accent-foreground)] text-xs">
              New
            </Badge>
          )}
          {product.isSale && product.salePercent && (
            <Badge className="bg-[color:var(--sale)] text-[color:var(--destructive-foreground)] text-xs">
              -{product.salePercent}%
            </Badge>
          )}
        </div>

        {/* Quick Add Button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-3">
        {/* Brand */}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {product.brand}
        </span>

        {/* Name */}
        <h3 className="font-medium text-foreground leading-tight line-clamp-2 text-sm">
          {product.name}
        </h3>

        {/* Size Badge */}
        <div className="flex flex-wrap gap-1">
          {product.sizes.slice(0, 3).map(size => (
            <span 
              key={size.id}
              className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded"
            >
              {size.size}
            </span>
          ))}
          {product.sizes.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{product.sizes.length - 3}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <PriceDisplay 
          retailPrice={defaultSize.retailPrice}
          stylistPrice={defaultSize.stylistPrice}
          salePercent={product.isSale ? product.salePercent : undefined}
          size="sm"
          className="mt-1"
        />
      </div>
    </Link>
  );
}
