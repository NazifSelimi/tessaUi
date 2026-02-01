'use client';

import Link from 'next/link';
import { 
  Building2, 
  KeyRound, 
  Users,
  Package,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { stylistCodes, orders } from '@/lib/mock-data';

export default function DistributorPortalPage() {
  const { currentUser, currentRole } = useStore();

  // Check if user is a distributor
  if (currentRole !== 'distributor' && currentRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Distributor Portal</h1>
          <p className="text-muted-foreground mb-6">
            This area is for verified distributors only. Contact us to learn about becoming a Tessa distributor.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Return to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Mock stats for distributor
  const distributorCodes = stylistCodes.filter(c => c.distributorId === currentUser?.id || currentRole === 'admin');
  const usedCodes = distributorCodes.filter(c => c.status === 'used').length;
  const unusedCodes = distributorCodes.filter(c => c.status === 'unused').length;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Distributor Portal
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name}! Manage your stylist network and codes.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Codes
            </CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{distributorCodes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stylists Activated
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{usedCodes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unused Codes
            </CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">{unusedCodes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Network Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$2,450</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-accent" />
              Generate Codes
            </CardTitle>
            <CardDescription>
              Create new stylist codes for your network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/distributor/codes">
                Manage Codes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              View Products
            </CardTitle>
            <CardDescription>
              Browse products with retail and stylist pricing side-by-side
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/distributor/products">
                View Products
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              My Network
            </CardTitle>
            <CardDescription>
              View stylists who have used your codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/distributor/network">
                View Network
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
