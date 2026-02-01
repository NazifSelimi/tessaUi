'use client';

import Link from 'next/link';
import { 
  Scissors, 
  BadgePercent, 
  Package, 
  TrendingUp,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { orders } from '@/lib/mock-data';

export default function StylistPortalPage() {
  const { currentUser, currentRole } = useStore();

  // Check if user is a stylist
  if (currentRole !== 'stylist' && currentRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
            <Scissors className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Stylist Portal</h1>
          <p className="text-muted-foreground mb-6">
            This area is for verified stylists only. Apply to become a Tessa Pro stylist to access exclusive pricing and benefits.
          </p>
          <Button asChild>
            <Link href="/stylist/request">Apply Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Mock stats for stylist dashboard
  const userOrders = orders.filter(o => o.userId === currentUser?.id);
  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
  const totalSaved = userOrders.reduce((sum, o) => sum + o.subtotal * 0.25, 0); // Estimated 25% savings

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Stylist Portal
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name}! You have access to exclusive stylist pricing.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userOrders.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estimated Savings
            </CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">${totalSaved.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your Discount
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">20-30%</p>
            <p className="text-xs text-muted-foreground">Below retail</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-accent" />
              Shop Products
            </CardTitle>
            <CardDescription>
              Browse our catalog with your exclusive stylist pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                Shop Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              Order History
            </CardTitle>
            <CardDescription>
              View your past orders and track current shipments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/account/orders">
                View Orders
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgePercent className="h-5 w-5 text-accent" />
              Special Offers
            </CardTitle>
            <CardDescription>
              Exclusive promotions and bulk order discounts for stylists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/?sale=true">
                View Offers
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How Pricing Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Stylist Pricing Works</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <p>
            As a verified Tessa Pro stylist, you automatically see discounted pricing on all products. 
            Your stylist price is displayed throughout the shop, and you will always pay the lower professional rate.
          </p>
          <ul className="mt-4 space-y-2">
            <li>Stylist prices are typically 20-30% below retail prices</li>
            <li>Free shipping on all orders over $50 (vs $75 for regular customers)</li>
            <li>Access to bulk order discounts for larger purchases</li>
            <li>Early access to new product launches and exclusive stylist-only products</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
