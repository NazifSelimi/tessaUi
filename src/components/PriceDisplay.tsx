import { Typography, Space } from 'antd';
import { useApp } from '@/store/AppContext';
import type { ProductSize } from '@/types';

const { Text } = Typography;

interface PriceDisplayProps {
  size: ProductSize;
  showBothPrices?: boolean;
  large?: boolean;
}

export default function PriceDisplay({ size, showBothPrices = false, large = false }: PriceDisplayProps) {
  const { currentRole } = useApp();
  
  const fontSize = large ? 24 : 16;
  const smallFontSize = large ? 16 : 12;

  // Distributor and admin always see both prices
  if (showBothPrices || currentRole === 'distributor' || currentRole === 'admin') {
    return (
      <Space direction="vertical" size={0}>
        <Text style={{ fontSize: smallFontSize }} type="secondary">
          Retail: <span style={{ textDecoration: 'none' }}>${size.retailPrice.toFixed(2)}</span>
        </Text>
        <Text style={{ fontSize, fontWeight: 600, color: '#16a34a' }}>
          Stylist: ${size.stylistPrice.toFixed(2)}
        </Text>
      </Space>
    );
  }

  // Stylist sees stylist price with crossed out retail
  if (currentRole === 'stylist') {
    return (
      <Space size={8} align="baseline">
        <Text className="price-crossed" style={{ fontSize: smallFontSize }}>
          ${size.retailPrice.toFixed(2)}
        </Text>
        <Text className="price-stylist" style={{ fontSize }}>
          ${size.stylistPrice.toFixed(2)}
        </Text>
      </Space>
    );
  }

  // Guest/User sees retail price
  return (
    <Text className="price-retail" style={{ fontSize }}>
      ${size.retailPrice.toFixed(2)}
    </Text>
  );
}
