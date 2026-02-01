/**
 * Product Card Component
 * 
 * Displays a product in a grid/list format with:
 * - Product image with hover effect
 * - Brand and name
 * - Price (role-aware)
 * - Featured/Out of Stock badges
 * - Quick add to cart
 */

import { Link } from 'react-router-dom';
import { Card, Typography, Tag, Button, Space, message } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import PriceDisplay from './PriceDisplay';
import { useCart } from '@/contexts';
import type { Product } from '@/types';

const { Text, Title } = Typography;

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

export default function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
  const { addItem } = useCart();
  
  // Get lowest price size for "From $X" display
  const lowestPrice = product.sizes.reduce(
    (min, size) => Math.min(min, size.retailPrice),
    product.sizes[0]?.retailPrice || 0
  );
  const lowestSize = product.sizes.find(s => s.retailPrice === lowestPrice) || product.sizes[0];
  
  // Check stock status
  const inStock = product.sizes.some(s => s.stock > 0);
  const firstAvailableSize = product.sizes.find(s => s.stock > 0);

  // Handle quick add to cart
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstAvailableSize) {
      message.warning('This product is out of stock');
      return;
    }
    
    addItem(product, firstAvailableSize, 1);
    message.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Card
        hoverable
        style={{ 
          height: '100%',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        styles={{
          body: { padding: 16 },
          cover: { overflow: 'hidden' },
        }}
        cover={
          <div style={{ 
            position: 'relative', 
            paddingTop: '100%', 
            background: '#f5f5f5',
            overflow: 'hidden',
          }}>
            {/* Product Image */}
            <img
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => {
                (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLImageElement).style.transform = 'scale(1)';
              }}
            />
            
            {/* Badges */}
            <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {product.featured && (
                <Tag color="gold" style={{ margin: 0, fontWeight: 500 }}>
                  Featured
                </Tag>
              )}
            </div>
            
            {/* Out of Stock Overlay */}
            {!inStock && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Tag color="default" style={{ fontSize: 14, padding: '6px 16px' }}>
                  Out of Stock
                </Tag>
              </div>
            )}

            {/* Quick Actions (on hover) */}
            {showQuickAdd && inStock && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                opacity: 0,
                transition: 'opacity 0.2s ease',
              }}
              className="product-card-actions"
              >
                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleQuickAdd}
                    style={{ background: '#fff', color: '#1a1a1a', borderColor: '#fff' }}
                  >
                    Quick Add
                  </Button>
                  <Button 
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    ghost
                    style={{ borderColor: '#fff', color: '#fff' }}
                  >
                    View
                  </Button>
                </Space>
              </div>
            )}
          </div>
        }
      >
        {/* Brand */}
        <Text 
          type="secondary" 
          style={{ 
            fontSize: 12, 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            display: 'block',
          }}
        >
          {product.brand}
        </Text>
        
        {/* Product Name */}
        <Title 
          level={5} 
          style={{ 
            margin: '6px 0 12px', 
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.4,
          }} 
          ellipsis={{ rows: 2 }}
        >
          {product.name}
        </Title>
        
        {/* Price & Add Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
        }}>
          <div>
            {product.sizes.length > 1 && (
              <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                From
              </Text>
            )}
            <PriceDisplay size={lowestSize} />
          </div>
          
          {showQuickAdd && (
            <Button 
              type="primary" 
              size="small" 
              icon={<ShoppingCartOutlined />}
              disabled={!inStock}
              onClick={handleQuickAdd}
            >
              Add
            </Button>
          )}
        </div>
      </Card>

      {/* CSS for hover effect */}
      <style>{`
        .ant-card:hover .product-card-actions {
          opacity: 1 !important;
        }
      `}</style>
    </Link>
  );
}
