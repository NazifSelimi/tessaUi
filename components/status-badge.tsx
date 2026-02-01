import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { OrderStatus, StylistRequestStatus, CodeStatus } from '@/lib/types';

type StatusType = OrderStatus | StylistRequestStatus | CodeStatus | 'active' | 'inactive' | 'expired' | 'draft' | 'archived';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Order statuses
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning-foreground border-warning/30' },
  confirmed: { label: 'Confirmed', className: 'bg-info/20 text-info-foreground border-info/30' },
  processing: { label: 'Processing', className: 'bg-info/20 text-info-foreground border-info/30' },
  shipped: { label: 'Shipped', className: 'bg-accent/20 text-accent-foreground border-accent/30' },
  delivered: { label: 'Delivered', className: 'bg-success/20 text-success-foreground border-success/30' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/20 text-destructive-foreground border-destructive/30' },
  
  // Stylist request statuses
  approved: { label: 'Approved', className: 'bg-success/20 text-success-foreground border-success/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/20 text-destructive-foreground border-destructive/30' },
  
  // Code statuses
  unused: { label: 'Unused', className: 'bg-secondary text-secondary-foreground border-border' },
  used: { label: 'Used', className: 'bg-success/20 text-success-foreground border-success/30' },
  expired: { label: 'Expired', className: 'bg-muted text-muted-foreground border-border' },
  
  // General statuses
  active: { label: 'Active', className: 'bg-success/20 text-success-foreground border-success/30' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border-border' },
  draft: { label: 'Draft', className: 'bg-warning/20 text-warning-foreground border-warning/30' },
  archived: { label: 'Archived', className: 'bg-muted text-muted-foreground border-border' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };
  
  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium capitalize', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
