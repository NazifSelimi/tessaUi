'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';

export function CartDrawer() {
  const { 
    cart, 
    cartTotal, 
    isCartOpen, 
    setCartOpen, 
    removeFromCart, 
    updateCartQuantity,
    currentRole,
  } = useStore();

  const getItemPrice = (retailPrice: number, stylistPrice: number) => {
    return currentRole === 'stylist' || currentRole === 'distributor' 
      ? stylistPrice 
      : retailPrice;
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add some products to get started
              </p>
            </div>
            <Button onClick={() => setCartOpen(false)} asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-auto py-4">
              <div className="flex flex-col gap-4">
                {cart.map(item => {
                  const price = getItemPrice(
                    item.selectedSize.retailPrice, 
                    item.selectedSize.stylistPrice
                  );
                  
                  return (
                    <div key={item.id} className="flex gap-4">
                      {/* Image */}
                      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                        <Image
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.product.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="font-medium text-sm text-foreground hover:text-accent line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.product.brand} · {item.selectedSize.size}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 bg-transparent"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 bg-transparent"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              ${(price * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Footer */}
            <SheetFooter className="flex-col gap-4 sm:flex-col pt-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Shipping and taxes calculated at checkout
              </p>
              <div className="flex flex-col gap-2 w-full">
                <Button asChild size="lg" onClick={() => setCartOpen(false)}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button 
                  variant="outline" 
                  asChild 
                  onClick={() => setCartOpen(false)}
                >
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
