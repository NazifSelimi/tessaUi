'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FiltersSidebar } from '@/components/filters-sidebar';
import type { ProductFilters } from '@/lib/types';
import { useState } from 'react';

interface MobileFiltersSheetProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  activeFilterCount: number;
}

export function MobileFiltersSheet({ 
  filters, 
  onFiltersChange,
  activeFilterCount 
}: MobileFiltersSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden relative bg-transparent">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <FiltersSidebar 
          filters={filters} 
          onFiltersChange={onFiltersChange}
          onClose={() => setOpen(false)}
          isMobile
        />
      </SheetContent>
    </Sheet>
  );
}
