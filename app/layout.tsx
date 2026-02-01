import React from "react"
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { StoreProvider } from '@/lib/store';
import { Header } from '@/components/header';
import { CartDrawer } from '@/components/cart-drawer';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Tessa - Professional Hair Care',
    template: '%s | Tessa',
  },
  description: 'Premium hair care products for stylists and enthusiasts. Shop professional-grade shampoos, masks, colors, and styling products from top brands.',
  keywords: ['hair care', 'professional', 'shampoo', 'hair color', 'stylist', 'salon'],
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1917' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <StoreProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border bg-secondary/30">
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Shop</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/" className="hover:text-accent transition-colors">All Products</a></li>
                      <li><a href="/?category=shampoo" className="hover:text-accent transition-colors">Shampoo</a></li>
                      <li><a href="/?category=mask" className="hover:text-accent transition-colors">Masks</a></li>
                      <li><a href="/?category=hair-color" className="hover:text-accent transition-colors">Hair Color</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Brands</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/?brand=fanola" className="hover:text-accent transition-colors">Fanola</a></li>
                      <li><a href="/?brand=oro-therapy" className="hover:text-accent transition-colors">Oro Therapy</a></li>
                      <li><a href="/?brand=rr-line" className="hover:text-accent transition-colors">Rr Line</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Account</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/login" className="hover:text-accent transition-colors">Sign In</a></li>
                      <li><a href="/register" className="hover:text-accent transition-colors">Register</a></li>
                      <li><a href="/stylist/request" className="hover:text-accent transition-colors">For Stylists</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Help</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Shipping Info</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Returns</a></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    © 2026 Tessa. All rights reserved.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                    <a href="#" className="hover:text-accent transition-colors">Terms</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <CartDrawer />
          <Toaster />
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  );
}
