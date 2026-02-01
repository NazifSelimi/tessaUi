'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, Col, Typography, Button, InputNumber, Radio, Space, 
  Tag, Spin, message, Breadcrumb, Divider 
} from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import PriceDisplay from '@/components/PriceDisplay';
import { useApp } from '@/store/AppContext';
import { getProductBySlug } from '@/api/client';
import type { Product, ProductSize } from '@/types';

const { Title, Text, Paragraph } = Typography;

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
        setSelectedSize(data.sizes[0] || null);
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize, quantity);
    message.success('Added to cart!');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={4}>Product not found</Title>
        <Button onClick={() => navigate('/')}>Back to Shop</Button>
      </div>
    );
  }

  const inStock = selectedSize ? selectedSize.stock > 0 : false;

  return (
    <div>
      <Breadcrumb 
        style={{ marginBottom: 24 }}
        items={[
          { title: <a onClick={() => navigate('/')}>Shop</a> },
          { title: product.brand },
          { title: product.name },
        ]}
      />

      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>

      <Row gutter={48}>
        {/* Product Images */}
        <Col xs={24} md={12}>
          <div style={{ 
            background: '#f5f5f5', 
            borderRadius: 12, 
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              style={{ width: '100%', height: 'auto', aspectRatio: '1', objectFit: 'cover' }}
            />
          </div>
          {product.images.length > 1 && (
            <Row gutter={8}>
              {product.images.map((img, idx) => (
                <Col key={idx} span={6}>
                  <div
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: idx === selectedImage ? '2px solid #1a1a1a' : '2px solid transparent',
                    }}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${idx + 1}`}
                      style={{ width: '100%', height: 'auto', aspectRatio: '1', objectFit: 'cover' }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* Product Info */}
        <Col xs={24} md={12}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">{product.brand}</Text>
            <Title level={2} style={{ margin: 0 }}>{product.name}</Title>
            
            <Space>
              {product.featured && <Tag color="gold">Featured</Tag>}
              <Tag>{product.category.replace('-', ' ').toUpperCase()}</Tag>
            </Space>

            <Divider />

            {/* Size Selection */}
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Size</Text>
              <Radio.Group 
                value={selectedSize?.id} 
                onChange={(e) => {
                  const size = product.sizes.find(s => s.id === e.target.value);
                  setSelectedSize(size || null);
                }}
              >
                <Space direction="vertical">
                  {product.sizes.map(size => (
                    <Radio key={size.id} value={size.id} disabled={size.stock === 0}>
                      <Space>
                        <span>{size.size}</span>
                        <PriceDisplay size={size} />
                        {size.stock === 0 && <Tag color="red">Out of Stock</Tag>}
                        {size.stock > 0 && size.stock <= 5 && (
                          <Tag color="orange">Only {size.stock} left</Tag>
                        )}
                      </Space>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>

            <Divider />

            {/* Price Display */}
            {selectedSize && (
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Price</Text>
                <PriceDisplay size={selectedSize} large />
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <Space size="middle">
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Quantity</Text>
                <InputNumber
                  min={1}
                  max={selectedSize?.stock || 1}
                  value={quantity}
                  onChange={(val) => setQuantity(val || 1)}
                  style={{ width: 100 }}
                />
              </div>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                disabled={!inStock}
                onClick={handleAddToCart}
                style={{ marginTop: 20 }}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </Space>

            <Divider />

            {/* Description */}
            <div>
              <Title level={5}>Description</Title>
              <Paragraph type="secondary">{product.description}</Paragraph>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
