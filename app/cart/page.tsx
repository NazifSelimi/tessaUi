'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';

export default function CartPage() {
  const { 
    cart, 
    cartTotal, 
    removeFromCart, 
    updateCartQuantity,
    clearCart,
    currentRole,
  } = useStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const getItemPrice = (retailPrice: number, stylistPrice: number) => {
    return currentRole === 'stylist' || currentRole === 'distributor' 
      ? stylistPrice 
      : retailPrice;
  };

  // TODO: Replace with API call - POST /api/coupons/validate
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Mock coupon validation
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
      setCouponError(null);
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const discount = appliedCoupon ? cartTotal * 0.1 : 0;
  const shipping = cartTotal >= 75 ? 0 : 5.99;
  const total = cartTotal - discount + shipping;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="h-32 w-32 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you have not added any products to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shopping Cart</h1>
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-destructive"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const price = getItemPrice(
              item.selectedSize.retailPrice, 
              item.selectedSize.stylistPrice
            );
            
            return (
              <div 
                key={item.id} 
                className="flex gap-4 p-4 bg-card border border-border rounded-lg"
              >
                {/* Image */}
                <Link 
                  href={`/products/${item.product.slug}`}
                  className="relative h-24 w-24 md:h-32 md:w-32 rounded-md overflow-hidden bg-secondary flex-shrink-0"
                >
                  <Image
                    src={item.product.images[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link 
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-foreground hover:text-accent transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.product.brand} · {item.selectedSize.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          ${price.toFixed(2)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            
            {/* Coupon Input */}
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Discount Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={handleApplyCoupon}>
                  Apply
                </Button>
              </div>
              {couponError && (
                <p className="text-xs text-destructive mt-1">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="text-xs text-success mt-1">
                  Coupon {appliedCoupon} applied! 10% off
                </p>
              )}
            </div>

            <Separator className="my-4" />

            {/* Summary Lines */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${cartTotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-success">-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over $75
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full mt-2 bg-transparent">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
