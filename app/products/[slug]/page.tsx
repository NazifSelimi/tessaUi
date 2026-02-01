'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Minus, Plus, Star, ShoppingBag, Truck, RotateCcw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { VariantSelector } from '@/components/variant-selector';
import { ProductCard } from '@/components/product-card';
import { useStore } from '@/lib/store';
import { products } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  
  // TODO: Replace with API call - GET /api/products/:slug
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    notFound();
  }

  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Related products (same category or brand)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-accent transition-colors">Shop</Link>
          </li>
          <li>/</li>
          <li>
            <Link 
              href={`/?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-accent transition-colors"
            >
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-secondary/30 rounded-lg overflow-hidden">
            <Image
              src={product.images[currentImageIndex] || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-[color:var(--new-badge)] text-[color:var(--accent-foreground)]">
                  New
                </Badge>
              )}
              {product.isSale && product.salePercent && (
                <Badge className="bg-[color:var(--sale)] text-[color:var(--destructive-foreground)]">
                  -{product.salePercent}%
                </Badge>
              )}
            </div>

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    currentImageIndex === index 
                      ? 'border-accent' 
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Name */}
          <div>
            <Link 
              href={`/?brand=${product.brand.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-muted-foreground uppercase tracking-wide hover:text-accent transition-colors"
            >
              {product.brand}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1 text-balance">
              {product.name}
            </h1>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!) 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Size Selector */}
          <VariantSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
          />

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= selectedSize.stock}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  {selectedSize.stock} in stock
                </span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full"
              onClick={handleAddToCart}
              disabled={selectedSize.stock === 0}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
            <div className="text-center">
              <Truck className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Free shipping over $75</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">30-day returns</p>
            </div>
            <div className="text-center">
              <HelpCircle className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-xs text-muted-foreground">Expert support</p>
            </div>
          </div>

          {/* Accordion Sections */}
          <Accordion type="multiple" defaultValue={['description']} className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ingredients">
              <AccordionTrigger>Ingredients & Usage</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {product.ingredients && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Ingredients</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.ingredients}
                      </p>
                    </div>
                  )}
                  {product.usage && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">How to Use</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.usage}
                      </p>
                    </div>
                  )}
                  {!product.ingredients && !product.usage && (
                    <p className="text-sm text-muted-foreground italic">
                      {/* TODO: Add ingredients and usage info from API */}
                      Product details coming soon.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery & Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Standard Delivery:</strong> 3-5 business days. Free on orders over $75.
                  </p>
                  <p>
                    <strong className="text-foreground">Express Delivery:</strong> 1-2 business days. $12.99 flat rate.
                  </p>
                  <p>
                    <strong className="text-foreground">Returns:</strong> We accept returns within 30 days of delivery for unopened products in original packaging.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq">
              <AccordionTrigger>FAQ</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Is this product suitable for color-treated hair?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, our professional products are formulated to be safe for color-treated hair. Always follow the usage instructions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">How long will one bottle last?</h4>
                    <p className="text-sm text-muted-foreground">
                      Depending on usage frequency, a 350ml bottle typically lasts 2-3 months with regular use.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
