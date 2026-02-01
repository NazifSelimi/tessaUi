'use client';

import React from "react"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft, CreditCard, Banknote, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';

type CheckoutStep = 'checkout' | 'success';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, currentRole } = useStore();
  const [step, setStep] = useState<CheckoutStep>('checkout');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'online',
  });

  const getItemPrice = (retailPrice: number, stylistPrice: number) => {
    return currentRole === 'stylist' || currentRole === 'distributor' 
      ? stylistPrice 
      : retailPrice;
  };

  const shipping = cartTotal >= 75 ? 0 : 5.99;
  const total = cartTotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // TODO: Replace with API call - POST /api/orders
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock order ID
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setStep('success');
    clearCart();
    setIsSubmitting(false);
  };

  if (cart.length === 0 && step !== 'success') {
    router.push('/cart');
    return null;
  }

  // Success Screen
  if (step === 'success') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="h-20 w-20 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          {orderId && (
            <p className="text-sm text-muted-foreground mb-6">
              Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground mb-8">
            You will receive a confirmation email shortly with your order details and tracking information.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/account/orders">View Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link 
        href="/cart" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Cart
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Address</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery Notes */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">Delivery Notes</h2>
              <div>
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Special instructions for delivery..."
                  rows={3}
                />
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  paymentMethod: value as 'cod' | 'online' 
                }))}
                className="grid gap-3"
              >
                <Label
                  htmlFor="cod"
                  className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <Banknote className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <span className="font-medium text-foreground">Cash on Delivery</span>
                    <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </Label>
                
                <Label
                  htmlFor="online"
                  className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-not-allowed opacity-60"
                >
                  <RadioGroupItem value="online" id="online" disabled />
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <span className="font-medium text-foreground">Pay Online</span>
                    <p className="text-xs text-muted-foreground">Credit card, debit card (Coming Soon)</p>
                  </div>
                </Label>
              </RadioGroup>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-auto mb-4">
                {cart.map(item => {
                  const price = getItemPrice(
                    item.selectedSize.retailPrice,
                    item.selectedSize.stylistPrice
                  );
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-14 w-14 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                        <Image
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedSize.size}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ${(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              {/* Summary Lines */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Secure checkout
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
