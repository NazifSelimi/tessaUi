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
  
  const primaryFontSize = large ? 24 : 16;
  const secondaryFontSize = large ? 16 : 12;

  // Calculate savings percentage
  const savingsPercent = Math.round(
    ((size.retailPrice - size.stylistPrice) / size.retailPrice) * 100
  );

  // Distributor and admin always see both prices
  if (showBothPrices || isDistributor || isAdmin) {
    return (
      <Space direction="vertical" size={2}>
        <Text style={{ fontSize: secondaryFontSize }} type="secondary">
          Retail: ${size.retailPrice.toFixed(2)}
        </Text>
        <Space size={8} align="baseline">
          <Text 
            style={{ 
              fontSize: primaryFontSize, 
              fontWeight: 600, 
              color: '#10b981',
            }}
          >
            ${size.stylistPrice.toFixed(2)}
          </Text>
          {showSavings && savingsPercent > 0 && (
            <Text 
              style={{ 
                fontSize: 11, 
                background: '#dcfce7', 
                color: '#16a34a',
                padding: '2px 6px',
                borderRadius: 4,
                fontWeight: 500,
              }}
            >
              Save {savingsPercent}%
            </Text>
          )}
        </Space>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Stylist Price
        </Text>
      </Space>
    );
  }

  // Stylist sees stylist price with crossed out retail
  if (isProfessional) {
    return (
      <Space size={8} align="baseline" wrap>
        <Text 
          style={{ 
            fontSize: secondaryFontSize, 
            textDecoration: 'line-through',
            color: '#9ca3af',
          }}
        >
          ${size.retailPrice.toFixed(2)}
        </Text>
        <Text 
          style={{ 
            fontSize: primaryFontSize, 
            fontWeight: 600,
            color: '#10b981',
          }}
        >
          ${size.stylistPrice.toFixed(2)}
        </Text>
        {showSavings && savingsPercent > 0 && (
          <Text 
            style={{ 
              fontSize: 11, 
              background: '#dcfce7', 
              color: '#16a34a',
              padding: '2px 6px',
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            -{savingsPercent}%
          </Text>
        )}
      </Space>
    );
  }

  // Guest/User sees retail price only
  return (
    <Text 
      style={{ 
        fontSize: primaryFontSize, 
        fontWeight: 600,
        color: '#1a1a1a',
      }}
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
