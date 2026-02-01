/**
 * Price Display Component
 * 
 * Role-aware price display that shows:
 * - Retail price for guests/users
 * - Stylist price for stylists (with crossed retail)
 * - Both prices for distributors and admins
 */

import { Typography, Space } from 'antd';
import { useAuth } from '@/contexts';
import type { ProductSize } from '@/types';

const { Text } = Typography;

interface PriceDisplayProps {
  size: ProductSize;
  showBothPrices?: boolean;
  large?: boolean;
  showSavings?: boolean;
}

export default function PriceDisplay({ 
  size, 
  showBothPrices = false, 
  large = false,
  showSavings = false,
}: PriceDisplayProps) {
  const { currentRole, isProfessional, isAdmin, isDistributor } = useAuth();
  
  const primaryFontSize = large ? 'var(--font-size-2xl)' : 'var(--font-size-lg)';
  const secondaryFontSize = large ? 'var(--font-size-lg)' : 'var(--font-size-xs)';

  // Calculate savings percentage
  const savingsPercent = Math.round(
    ((size.retailPrice - size.stylistPrice) / size.retailPrice) * 100
  );

  // Distributor and admin always see both prices
  if (showBothPrices || isDistributor || isAdmin) {
    return (
      <div className="price-display">
        <Text style={{ fontSize: secondaryFontSize }} type="secondary">
          Retail: ${size.retailPrice.toFixed(2)}
        </Text>
        <Space size={8} align="baseline">
          <Text 
            className="price-display__current price-display__current--stylist"
            style={{ fontSize: primaryFontSize }}
          >
            ${size.stylistPrice.toFixed(2)}
          </Text>
          {showSavings && savingsPercent > 0 && (
            <span className="price-display__savings">
              Save {savingsPercent}%
            </span>
          )}
        </Space>
        <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
          Stylist Price
        </Text>
      </div>
    );
  }

  // Stylist sees stylist price with crossed out retail
  if (isProfessional) {
    return (
      <div className="price-display price-display--inline">
        <Text className="price-display__original" style={{ fontSize: secondaryFontSize }}>
          ${size.retailPrice.toFixed(2)}
        </Text>
        <Text 
          className="price-display__current price-display__current--stylist"
          style={{ fontSize: primaryFontSize }}
        >
          ${size.stylistPrice.toFixed(2)}
        </Text>
        {showSavings && savingsPercent > 0 && (
          <span className="price-display__savings">
            -{savingsPercent}%
          </span>
        )}
      </div>
    );
  }

  // Guest/User sees retail price only
  return (
    <Text 
      className="price-display__current"
      style={{ fontSize: primaryFontSize }}
    >
      ${size.retailPrice.toFixed(2)}
    </Text>
  );
}

/**
 * Format currency helper
 */
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
