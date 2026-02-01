'use client';

import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/lib/store';
import type { UserRole } from '@/lib/types';

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: 'guest', label: 'Guest', description: 'Not logged in' },
  { value: 'user', label: 'User', description: 'Regular customer' },
  { value: 'stylist', label: 'Stylist', description: 'Professional pricing' },
  { value: 'distributor', label: 'Distributor', description: 'Manages stylists' },
  { value: 'admin', label: 'Admin', description: 'Full access' },
];

export function RoleSwitcher() {
  const { currentRole, setRole } = useStore();

  // In production, this component would not be rendered
  // if (process.env.NODE_ENV === 'production') return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-dashed bg-transparent"
          aria-label="Dev: Switch user role"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <span className="text-xs bg-warning/20 text-warning-foreground px-1.5 py-0.5 rounded">
            DEV
          </span>
          Role Switcher
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map(role => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => setRole(role.value)}
            className="flex flex-col items-start"
          >
            <div className="flex items-center gap-2 w-full">
              <span className={currentRole === role.value ? 'font-medium' : ''}>
                {role.label}
              </span>
              {currentRole === role.value && (
                <span className="ml-auto text-xs text-accent">Active</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{role.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
