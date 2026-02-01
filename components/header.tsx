'use client';

import React from "react"

import Link from 'next/link';
import { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  ChevronDown,
  LayoutDashboard,
  Package,
  Scissors,
  Building2,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { categories } from '@/lib/mock-data';
import { RoleSwitcher } from '@/components/role-switcher';

export function Header() {
  const { currentUser, currentRole, cartCount, setCartOpen, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const getAccountLinks = () => {
    const baseLinks = [
      { href: '/account', label: 'My Account', icon: User },
      { href: '/account/orders', label: 'Orders', icon: Package },
    ];

    switch (currentRole) {
      case 'admin':
        return [{ href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard }, ...baseLinks];
      case 'distributor':
        return [{ href: '/distributor', label: 'Distributor Portal', icon: Building2 }, ...baseLinks];
      case 'stylist':
        return [{ href: '/stylist', label: 'Stylist Portal', icon: Scissors }, ...baseLinks];
      default:
        return baseLinks;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm">
        <span className="font-medium">Free shipping on orders over $75</span>
        {' '}
        <span className="hidden sm:inline">| Professional hair care for stylists and enthusiasts</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Link 
                  href="/" 
                  className="text-lg font-medium hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop All
                </Link>
                <div className="border-t border-border pt-4">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Categories
                  </span>
                  <div className="mt-2 flex flex-col gap-2">
                    {categories.slice(0, 8).map(category => (
                      <Link
                        key={category.id}
                        href={`/?category=${category.slug}`}
                        className="text-foreground hover:text-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      href="/"
                      className="text-accent font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      View All Categories
                    </Link>
                  </div>
                </div>
                {currentRole === 'guest' && (
                  <div className="border-t border-border pt-4 flex flex-col gap-2">
                    <Link href="/stylist/request" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Scissors className="h-4 w-4 mr-2" />
                        Become a Stylist
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">Tessa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Shop
            </Link>
            
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 px-2">
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map(category => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/?category=${category.slug}`} className="flex justify-between">
                      {category.name}
                      <span className="text-muted-foreground text-xs">{category.productCount}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {currentRole === 'guest' && (
              <Link 
                href="/stylist/request" 
                className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                For Stylists
              </Link>
            )}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {currentUser ? (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      <Badge variant="outline" className="mt-1 text-xs capitalize">
                        {currentRole}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    {getAccountLinks().map(link => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href} className="flex items-center">
                          <link.icon className="h-4 w-4 mr-2" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="flex items-center">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/stylist/request" className="flex items-center">
                        <Scissors className="h-4 w-4 mr-2" />
                        Become a Stylist
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>

            {/* Dev Role Switcher */}
            <RoleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
