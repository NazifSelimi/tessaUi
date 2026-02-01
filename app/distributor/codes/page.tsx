'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Copy, Check, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { useStore } from '@/lib/store';
import { stylistCodes as initialCodes } from '@/lib/mock-data';
import type { StylistCode } from '@/lib/types';

export default function DistributorCodesPage() {
  const { currentUser, currentRole } = useStore();
  const [codes, setCodes] = useState<StylistCode[]>(initialCodes);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [generateForm, setGenerateForm] = useState({
    count: 1,
    expiryDays: '',
  });

  // Check if user is a distributor
  if (currentRole !== 'distributor' && currentRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Access denied. Distributors only.</p>
        <Button variant="outline" asChild className="mt-4 bg-transparent">
          <Link href="/">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  const distributorCodes = codes.filter(
    c => c.distributorId === currentUser?.id || currentRole === 'admin'
  );

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // TODO: Replace with API call - POST /api/distributor/codes/generate
  const handleGenerateCodes = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCodes: StylistCode[] = Array.from({ length: generateForm.count }, (_, i) => ({
        id: `new-${Date.now()}-${i}`,
        code: `DIST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        distributorId: currentUser?.id || '2',
        status: 'unused' as const,
        expiresAt: generateForm.expiryDays 
          ? new Date(Date.now() + Number(generateForm.expiryDays) * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        createdAt: new Date().toISOString(),
      }));

      setCodes(prev => [...newCodes, ...prev]);
      setDialogOpen(false);
      setGenerateForm({ count: 1, expiryDays: '' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link 
        href="/distributor" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Portal
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Stylist Codes</h1>
          <p className="text-muted-foreground">
            Generate and manage codes for your stylist network
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Codes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Stylist Codes</DialogTitle>
              <DialogDescription>
                Create new codes that stylists can use for instant account approval.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="count">Number of Codes</Label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  max={50}
                  value={generateForm.count}
                  onChange={(e) => setGenerateForm(prev => ({ 
                    ...prev, 
                    count: Number(e.target.value) 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDays">Expiry (Days) - Optional</Label>
                <Input
                  id="expiryDays"
                  type="number"
                  min={1}
                  placeholder="Leave empty for no expiry"
                  value={generateForm.expiryDays}
                  onChange={(e) => setGenerateForm(prev => ({ 
                    ...prev, 
                    expiryDays: e.target.value 
                  }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateCodes} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{distributorCodes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Used</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">
              {distributorCodes.filter(c => c.status === 'used').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">
              {distributorCodes.filter(c => c.status === 'unused').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Codes Table */}
      {distributorCodes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <KeyRound className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">No codes yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate your first codes to start building your stylist network
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Codes
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Expires</TableHead>
                <TableHead className="hidden lg:table-cell">Used By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributorCodes.map(code => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono font-medium">{code.code}</TableCell>
                  <TableCell>
                    <StatusBadge status={code.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {new Date(code.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {code.expiresAt 
                      ? new Date(code.expiresAt).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {code.usedBy || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(code.code, code.id)}
                      disabled={code.status !== 'unused'}
                    >
                      {copiedId === code.id ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
