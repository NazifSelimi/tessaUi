'use client';

import { cn } from '@/lib/utils';
import { PriceDisplay } from '@/components/price-display';
import type { ProductSize } from '@/lib/types';

interface VariantSelectorProps {
  sizes: ProductSize[];
  selectedSize: ProductSize;
  onSelect: (size: ProductSize) => void;
  showPrice?: boolean;
  className?: string;
}

export function VariantSelector({ 
  sizes, 
  selectedSize, 
  onSelect, 
  showPrice = false,
  className 
}: VariantSelectorProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium text-foreground">
        Size
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map(size => {
          const isSelected = selectedSize.id === size.id;
          const isOutOfStock = size.stock === 0;
          
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => !isOutOfStock && onSelect(size)}
              disabled={isOutOfStock}
              className={cn(
                'relative flex flex-col items-center px-4 py-2 rounded-md border transition-all',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-accent',
                isOutOfStock && 'opacity-50 cursor-not-allowed line-through'
              )}
              aria-label={`Select size ${size.size}${isOutOfStock ? ' - Out of stock' : ''}`}
            >
              <span className="font-medium">{size.size}</span>
              {showPrice && (
                <span className={cn(
                  'text-xs mt-0.5',
                  isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  ${size.retailPrice.toFixed(2)}
                </span>
              )}
              {isOutOfStock && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-destructive text-destructive-foreground px-1 rounded">
                  Out
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Selected size price display */}
      <div className="mt-2">
        <PriceDisplay
          retailPrice={selectedSize.retailPrice}
          stylistPrice={selectedSize.stylistPrice}
          size="lg"
        />
      </div>
    </div>
  );
}
