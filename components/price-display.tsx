'use client';

import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

interface PriceDisplayProps {
  retailPrice: number;
  stylistPrice: number;
  salePercent?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({ 
  retailPrice, 
  stylistPrice, 
  salePercent,
  size = 'md',
  className 
}: PriceDisplayProps) {
  const { currentRole, getDisplayPrice } = useStore();
  const { primary, secondary, showBoth } = getDisplayPrice(retailPrice, stylistPrice);
  
  const originalPrice = salePercent ? primary / (1 - salePercent / 100) : null;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-semibold',
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  // Distributor view - show both prices
  if (showBoth) {
    return (
      <div className={cn('flex flex-col gap-0.5', className)}>
        <div className="flex items-center gap-2">
          <span className={cn('font-medium text-foreground', sizeClasses[size])}>
            {formatPrice(primary)}
          </span>
          <span className="text-xs text-muted-foreground">Retail</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-[color:var(--stylist-price)]', sizeClasses[size])}>
            {formatPrice(secondary!)}
          </span>
          <span className="text-xs text-muted-foreground">Stylist</span>
        </div>
      </div>
    );
  }

  // Stylist view - show stylist price with optional retail crossed out
  if (currentRole === 'stylist') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className={cn('font-medium text-[color:var(--stylist-price)]', sizeClasses[size])}>
          {formatPrice(primary)}
        </span>
        {secondary && (
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(secondary)}
          </span>
        )}
      </div>
    );
  }

  // Default view - normal price with optional sale
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-medium text-foreground', sizeClasses[size])}>
        {formatPrice(primary)}
      </span>
      {originalPrice && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
      {salePercent && (
        <span className="text-xs font-medium text-[color:var(--sale)]">
          -{salePercent}%
        </span>
      )}
    </div>
  );
}
