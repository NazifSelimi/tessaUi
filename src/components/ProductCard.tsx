import { Link } from 'react-router-dom';
import { Card, Typography, Tag, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import PriceDisplay from './PriceDisplay';
import type { Product } from '@/types';

const { Text, Title } = Typography;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const lowestPrice = product.sizes.reduce(
    (min, size) => Math.min(min, size.retailPrice),
    product.sizes[0]?.retailPrice || 0
  );
  const lowestSize = product.sizes.find(s => s.retailPrice === lowestPrice) || product.sizes[0];
  const inStock = product.sizes.some(s => s.stock > 0);

  return (
    <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
      <Card
        className="product-card"
        hoverable
        cover={
          <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5' }}>
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {product.featured && (
              <Tag color="gold" style={{ position: 'absolute', top: 12, left: 12 }}>
                Featured
              </Tag>
            )}
            {!inStock && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ color: '#fff', fontWeight: 600 }}>Out of Stock</Text>
              </div>
            )}
          </div>
        }
        bodyStyle={{ padding: 16 }}
      >
        <Text type="secondary" style={{ fontSize: 12 }}>{product.brand}</Text>
        <Title level={5} style={{ margin: '4px 0 8px', fontSize: 14 }} ellipsis={{ rows: 2 }}>
          {product.name}
        </Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>From</Text>
            <PriceDisplay size={lowestSize} />
          </div>
          <Button 
            type="primary" 
            size="small" 
            icon={<ShoppingCartOutlined />}
            disabled={!inStock}
          >
            Add
          </Button>
        </div>
      </Card>
    </Link>
  );
}
