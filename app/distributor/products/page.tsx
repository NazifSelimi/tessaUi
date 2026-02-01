'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { products } from '@/lib/mock-data';

export default function DistributorProductsPage() {
  const { currentRole } = useStore();
  const [search, setSearch] = useState('');

  // Check if user is a distributor
  if (currentRole !== 'distributor' && currentRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Access denied. Distributors only.</p>
        <Button variant="outline" asChild className="mt-4 bg-transparent">
          <Link href="/">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Link 
        href="/distributor" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Portal
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Product Pricing</h1>
          <p className="text-muted-foreground">
            View retail and stylist prices side-by-side
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Retail Price</TableHead>
              <TableHead className="text-right">Stylist Price</TableHead>
              <TableHead className="text-right">Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.flatMap(product =>
              product.sizes.map(size => {
                const margin = ((size.retailPrice - size.stylistPrice) / size.retailPrice * 100).toFixed(0);
                return (
                  <TableRow key={`${product.id}-${size.id}`}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary">
                        <Image
                          src={product.images[0] || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/products/${product.slug}`}
                        className="font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {product.name}
                      </Link>
                      {product.isNew && (
                        <Badge className="ml-2 text-xs" variant="secondary">New</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{size.size}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${size.retailPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-[color:var(--stylist-price)]">
                      ${size.stylistPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{margin}%</Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Showing {filteredProducts.reduce((acc, p) => acc + p.sizes.length, 0)} product variants
      </p>
    </div>
  );
}
