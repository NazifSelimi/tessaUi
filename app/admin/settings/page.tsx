"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="Tessa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="contact@tessa.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  defaultValue="Premium hair care products for stylists and enthusiasts."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue="USD" disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Features</CardTitle>
              <CardDescription>Enable or disable store features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Stylist Applications</p>
                  <p className="text-xs text-muted-foreground">Allow stylists to apply for accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Distributor Applications</p>
                  <p className="text-xs text-muted-foreground">Allow distributors to apply for accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Guest Checkout</p>
                  <p className="text-xs text-muted-foreground">Allow purchases without an account</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Reviews</p>
                  <p className="text-xs text-muted-foreground">Allow customers to leave reviews</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Pricing</CardTitle>
              <CardDescription>Configure discount percentages for each user role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stylistDiscount">Stylist Discount (%)</Label>
                  <Input id="stylistDiscount" type="number" defaultValue="20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distributorDiscount">Distributor Discount (%)</Label>
                  <Input id="distributorDiscount" type="number" defaultValue="40" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Minimum Order</CardTitle>
              <CardDescription>Set minimum order amounts by role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="minUser">Regular Users ($)</Label>
                  <Input id="minUser" type="number" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStylist">Stylists ($)</Label>
                  <Input id="minStylist" type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minDistributor">Distributors ($)</Label>
                  <Input id="minDistributor" type="number" defaultValue="200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
              <CardDescription>Configure shipping rates and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="standardRate">Standard Shipping ($)</Label>
                  <Input id="standardRate" type="number" step="0.01" defaultValue="5.99" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressRate">Express Shipping ($)</Label>
                  <Input id="expressRate" type="number" step="0.01" defaultValue="12.99" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeThreshold">Free Shipping Threshold ($)</Label>
                <Input id="freeThreshold" type="number" defaultValue="75" />
                <p className="text-xs text-muted-foreground">
                  Orders above this amount get free standard shipping
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">New Orders</p>
                  <p className="text-xs text-muted-foreground">Get notified of new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Stylist Applications</p>
                  <p className="text-xs text-muted-foreground">Get notified of new stylist applications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Low Stock Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when products are low on stock</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Review Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified of new product reviews</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
