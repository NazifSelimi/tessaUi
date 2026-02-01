'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/status-badge';
import { useStore } from '@/lib/store';
import { orders } from '@/lib/mock-data';

export default function OrdersPage() {
  const { currentUser } = useStore();

  // TODO: Replace with API call - GET /api/orders?userId=current
  const userOrders = orders.filter(o => o.userId === currentUser?.id || currentUser?.role === 'admin');

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to view your orders
        </p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link 
        href="/account" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Account
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Order History</h1>

      {userOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-24 w-24 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            When you place an order, it will appear here
          </p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Order Images Preview */}
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div
                        key={item.id}
                        className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary border-2 border-card"
                        style={{ zIndex: 3 - i }}
                      >
                        <Image
                          src={item.productImage || '/placeholder.svg'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="h-12 w-12 rounded-md bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <span className="font-semibold text-foreground">
                    ${order.total.toFixed(2)}
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
