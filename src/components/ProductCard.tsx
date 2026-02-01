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
    <Link to={`/product/${product.slug}`} className="product-card" aria-label={`View ${product.name}`}>
      <Card
        hoverable
        className="product-card-ant"
        styles={{
          body: { padding: 'var(--spacing-lg)' },
          cover: { overflow: 'hidden' },
        }}
        cover={
          <div className="product-card__image-wrapper">
            {/* Product Image */}
            <img
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              className="product-card__image"
              loading="lazy"
            />
            
            {/* Badges */}
            <div className="product-card__badges">
              {product.featured && (
                <Tag color="gold" style={{ margin: 0, fontWeight: 500 }}>
                  Featured
                </Tag>
              )}
            </div>
            
            {/* Out of Stock Overlay */}
            {!inStock && (
              <div className="product-card__overlay">
                <Tag color="default" style={{ fontSize: 14, padding: '6px 16px' }}>
                  Out of Stock
                </Tag>
              </div>
            )}

            {/* Quick Actions (on hover) */}
            {showQuickAdd && inStock && (
              <div className="product-card__quick-actions">
                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleQuickAdd}
                    style={{ background: '#fff', color: 'var(--color-text)', borderColor: '#fff' }}
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
        <Text className="product-card__brand">
          {product.brand}
        </Text>
        
        {/* Product Name */}
        <Title 
          level={5} 
          className="product-card__name"
          ellipsis={{ rows: 2 }}
        >
          {product.name}
        </Title>
        
        {/* Price & Add Button */}
        <div className="product-card__footer">
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
              aria-label={`Add ${product.name} to cart`}
            >
              Add
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
}
