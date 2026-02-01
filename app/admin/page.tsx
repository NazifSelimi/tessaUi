"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "356",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "48",
    change: "+3",
    trend: "up",
    icon: Package,
  },
  {
    title: "Customers",
    value: "2,350",
    change: "+180",
    trend: "up",
    icon: Users,
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "Maria Silva", total: 89.99, status: "pending" },
  { id: "ORD-002", customer: "John Smith", total: 245.50, status: "shipped" },
  { id: "ORD-003", customer: "Ana Costa", total: 67.00, status: "delivered" },
  { id: "ORD-004", customer: "Carlos Ruiz", total: 189.99, status: "processing" },
  { id: "ORD-005", customer: "Emma Wilson", total: 312.00, status: "pending" },
];

const pendingApprovals = [
  { id: 1, name: "Sarah Johnson", type: "Stylist", salon: "Glamour Studio", date: "2 hours ago" },
  { id: 2, name: "Michael Brown", type: "Stylist", salon: "Hair Masters", date: "5 hours ago" },
  { id: 3, name: "Beauty Supply Co.", type: "Distributor", salon: "-", date: "1 day ago" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "shipped":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "processing":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Approvals</CardTitle>
            <Badge variant="secondary">{pendingApprovals.length} pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} {item.salon !== "-" && `• ${item.salon}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/products">
              <Button variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/promo-codes">
              <Button variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Create Promo Code
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
