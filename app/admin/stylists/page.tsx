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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MoreHorizontal, Check, X, Eye, FileText } from "lucide-react";

const stylistApplications = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@glamourstudio.com",
    salon: "Glamour Studio",
    phone: "(555) 123-4567",
    license: "CA-12345",
    status: "pending",
    appliedAt: "2026-01-24",
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael@hairmasters.com",
    salon: "Hair Masters",
    phone: "(555) 234-5678",
    license: "CA-23456",
    status: "pending",
    appliedAt: "2026-01-23",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@styleboutique.com",
    salon: "Style Boutique",
    phone: "(555) 345-6789",
    license: "CA-34567",
    status: "approved",
    appliedAt: "2026-01-20",
  },
];

const approvedStylists = [
  {
    id: 1,
    name: "Emily Davis",
    email: "emily@styleboutique.com",
    salon: "Style Boutique",
    orders: 24,
    totalSpent: 1890.5,
    joinedAt: "2026-01-20",
  },
  {
    id: 2,
    name: "Jessica Wilson",
    email: "jessica@cutsalon.com",
    salon: "The Cut Salon",
    orders: 18,
    totalSpent: 1245.0,
    joinedAt: "2025-12-15",
  },
  {
    id: 3,
    name: "Amanda Martinez",
    email: "amanda@luxehair.com",
    salon: "Luxe Hair Co",
    orders: 32,
    totalSpent: 2567.8,
    joinedAt: "2025-11-08",
  },
];

export default function AdminStylistsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const pendingApplications = stylistApplications.filter((a) => a.status === "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Stylists</h1>
        <p className="text-muted-foreground">Manage stylist applications and accounts</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{approvedStylists.length}</div>
            <p className="text-sm text-muted-foreground">Active Stylists</p>
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
              ${approvedStylists.reduce((sum, s) => sum + s.totalSpent, 0).toFixed(2)}
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
          <TabsTrigger value="stylists">Active Stylists</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stylist Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Salon</TableHead>
                      <TableHead>License #</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stylistApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{app.name}</p>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{app.salon}</TableCell>
                        <TableCell className="text-sm font-mono">{app.license}</TableCell>
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

        <TabsContent value="stylists" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stylists..."
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
                      <TableHead>Stylist</TableHead>
                      <TableHead>Salon</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedStylists.map((stylist) => (
                      <TableRow key={stylist.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{stylist.name}</p>
                            <p className="text-xs text-muted-foreground">{stylist.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{stylist.salon}</TableCell>
                        <TableCell className="text-sm">{stylist.orders}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${stylist.totalSpent.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(stylist.joinedAt).toLocaleDateString()}
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
