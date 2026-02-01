'use client';

import React from "react"

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2, Circle, Package, Truck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/status-badge';
import { useStore } from '@/lib/store';
import { orders } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import type { OrderStatus } from '@/lib/types';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'pending', label: 'Order Placed', icon: Package },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { status: 'processing', label: 'Processing', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: Home },
];

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const { currentUser } = useStore();

  // TODO: Replace with API call - GET /api/orders/:id
  const order = orders.find(o => o.id === id);

  if (!order) {
    notFound();
  }

  const currentStatusIndex = statusSteps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === 'cancelled';

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h1>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link 
        href="/account/orders" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          {!isCancelled && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Order Status</h2>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" />
                <div 
                  className="absolute left-4 top-4 w-0.5 bg-accent transition-all"
                  style={{ 
                    height: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` 
                  }}
                />
                
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const isComplete = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const historyEntry = order.statusHistory.find(h => h.status === step.status);
                    
                    return (
                      <div key={step.status} className="relative flex items-start gap-4 pl-10">
                        <div className={`absolute left-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          isComplete 
                            ? 'bg-accent text-accent-foreground' 
                            : 'bg-secondary text-muted-foreground'
                        }`}>
                          {isComplete ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className={`font-medium ${isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                          {historyEntry && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(historyEntry.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    <Image
                      src={item.productImage || '/placeholder.svg'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground line-clamp-1">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.brand} · {item.size}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount {order.couponCode && `(${order.couponCode})`}
                  </span>
                  <span className="text-success">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Address</h2>
            <address className="text-sm text-muted-foreground not-italic space-y-1">
              <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2">{order.shippingAddress.phone}</p>
            </address>
          </div>

          {/* Payment Method */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
            <p className="text-sm text-muted-foreground">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent">
              Need Help?
            </Button>
            {order.status === 'delivered' && (
              <Button variant="outline" className="w-full bg-transparent">
                Reorder
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
