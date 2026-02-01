'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  Scissors, 
  BadgePercent, 
  Truck, 
  Users,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/lib/store';

type RequestState = 'form' | 'pending' | 'instant';

const benefits = [
  {
    icon: BadgePercent,
    title: 'Exclusive Stylist Pricing',
    description: 'Access professional pricing on all products, typically 20-30% below retail.',
  },
  {
    icon: Truck,
    title: 'Priority Shipping',
    description: 'Free expedited shipping on orders over $50 with priority handling.',
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Join our exclusive stylist community for tips, trends, and early product access.',
  },
];

export default function StylistRequestPage() {
  const { currentRole, setRole } = useStore();
  const [state, setState] = useState<RequestState>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    licenseNumber: '',
    stylistCode: '',
    additionalInfo: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // TODO: Replace with actual API call - POST /api/stylist-requests
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If code provided, instant approval
      if (formData.stylistCode.trim()) {
        // Validate code - mock check
        if (formData.stylistCode.toUpperCase().startsWith('DIST-')) {
          setState('instant');
          setRole('stylist');
        } else {
          setState('pending');
        }
      } else {
        setState('pending');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Already a stylist
  if (currentRole === 'stylist') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">You are a Stylist!</h1>
        <p className="text-muted-foreground mb-6">
          You already have access to stylist pricing and benefits.
        </p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  // Instant approval state
  if (state === 'instant') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Tessa Pro!</h1>
          <p className="text-muted-foreground mb-6">
            Your stylist code has been verified and your account has been instantly upgraded.
            You now have access to exclusive stylist pricing!
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href="/">
                Start Shopping with Stylist Pricing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/stylist">View Stylist Portal</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pending approval state
  if (state === 'pending') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-warning/20 mx-auto flex items-center justify-center mb-6">
            <Clock className="h-10 w-10 text-warning-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to become a Tessa Stylist. Our team will review your application 
            and get back to you within 1-2 business days.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            You will receive an email notification once your application has been reviewed.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="h-16 w-16 rounded-full bg-accent/20 mx-auto flex items-center justify-center mb-4">
          <Scissors className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Join Tessa Pro
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock exclusive professional pricing and benefits designed for hair care professionals.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {benefits.map((benefit, i) => (
          <Card key={i} className="text-center">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-2">
                <benefit.icon className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{benefit.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Form */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Apply for Stylist Account</CardTitle>
            <CardDescription>
              Fill out the form below to apply for professional pricing access.
              If you have a stylist code from a distributor, enter it for instant approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Stylist Code */}
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <Label htmlFor="stylistCode" className="text-accent font-medium">
                  Have a Stylist Code? (Optional)
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Enter your code from a Tessa distributor for instant approval
                </p>
                <Input
                  id="stylistCode"
                  name="stylistCode"
                  value={formData.stylistCode}
                  onChange={handleInputChange}
                  placeholder="e.g., DIST-ABC123"
                  className="font-mono"
                />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business/Salon Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your Salon Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Input
                    id="businessAddress"
                    name="businessAddress"
                    required
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone *</Label>
                    <Input
                      id="businessPhone"
                      name="businessPhone"
                      type="tel"
                      required
                      value={formData.businessPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Cosmetology License # (Optional)</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="License number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Tell us about your business..."
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
