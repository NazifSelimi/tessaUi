"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MoreHorizontal, Check, X, Eye, FileText, Building2 } from "lucide-react";

const distributorApplications = [
  {
    id: 1,
    company: "Beauty Supply Co.",
    contact: "James Wilson",
    email: "james@beautysupplyco.com",
    phone: "(555) 456-7890",
    taxId: "US-TAX-123456",
    status: "pending",
    appliedAt: "2026-01-22",
  },
  {
    id: 2,
    company: "Salon Wholesale Inc",
    contact: "Lisa Chen",
    email: "lisa@salonwholesale.com",
    phone: "(555) 567-8901",
    taxId: "US-TAX-234567",
    status: "pending",
    appliedAt: "2026-01-21",
  },
];

const approvedDistributors = [
  {
    id: 1,
    company: "Pro Beauty Distribution",
    contact: "Robert Martinez",
    email: "robert@probeauty.com",
    region: "West Coast",
    orders: 156,
    revenue: 45678.9,
    joinedAt: "2025-06-15",
  },
  {
    id: 2,
    company: "East Coast Hair Supply",
    contact: "Jennifer Adams",
    email: "jennifer@eastcoasthair.com",
    region: "East Coast",
    orders: 89,
    revenue: 28945.5,
    joinedAt: "2025-08-20",
  },
];

export default function AdminDistributorsPage() {
  const [search, setSearch] = useState("");

  const pendingApplications = distributorApplications.filter((a) => a.status === "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Distributors</h1>
        <p className="text-muted-foreground">Manage distributor applications and partnerships</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{approvedDistributors.length}</div>
            <p className="text-sm text-muted-foreground">Active Distributors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
            <p className="text-sm text-muted-foreground">Pending Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              ${approvedDistributors.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">
            Applications
            {pendingApplications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingApplications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="distributors">Active Distributors</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Distributor Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Tax ID</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distributorApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-accent" />
                            </div>
                            <p className="font-medium text-sm">{app.company}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{app.contact}</p>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-mono">{app.taxId}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              app.status === "approved"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : app.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View Documents
                              </DropdownMenuItem>
                              {app.status === "pending" && (
                                <>
                                  <DropdownMenuItem className="text-green-600">
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributors" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search distributors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedDistributors.map((distributor) => (
                      <TableRow key={distributor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{distributor.company}</p>
                            <p className="text-xs text-muted-foreground">{distributor.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{distributor.region}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{distributor.orders}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${distributor.revenue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(distributor.joinedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
