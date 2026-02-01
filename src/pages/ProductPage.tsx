/**
 * Product Detail Page
 * 
 * Displays full product information including:
 * - Image gallery
 * - Variant/size selector
 * - Price display (role-aware)
 * - Add to cart functionality
 * - Product description
 * - Related products
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Row, Col, Typography, Button, InputNumber, Radio, Space, 
  Tag, Spin, message, Breadcrumb, Divider, Collapse, Card,
  Alert,
} from 'antd';
import { 
  ShoppingCartOutlined, ArrowLeftOutlined, HeartOutlined,
  ShareAltOutlined, CheckCircleOutlined, TruckOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import PriceDisplay from '@/components/PriceDisplay';
import ProductCard from '@/components/ProductCard';
import { useCart, useAuth } from '@/contexts';
import { getProductBySlug, getRelatedProducts } from '@/api/services';
import type { Product, ProductSize } from '@/types';

const { Title, Text, Paragraph } = Typography;

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isProfessional } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Load product data
  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      
      const productData = await getProductBySlug(slug);
      if (productData) {
        setProduct(productData);
        // Select first in-stock size by default
        const defaultSize = productData.sizes.find(s => s.stock > 0) || productData.sizes[0];
        setSelectedSize(defaultSize || null);
        
        // Load related products
        const related = await getRelatedProducts(productData.id);
        setRelatedProducts(related);
      }
      
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addItem(product, selectedSize, quantity);
    message.success({
      content: (
        <span>
          Added <strong>{product.name}</strong> to cart
        </span>
      ),
      icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={4}>Product not found</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          The product you're looking for doesn't exist or has been removed.
        </Text>
        <Button type="primary" onClick={() => navigate('/')}>
          Back to Shop
        </Button>
      </div>
    );
  }

  const inStock = selectedSize ? selectedSize.stock > 0 : false;
  const lowStock = selectedSize && selectedSize.stock > 0 && selectedSize.stock <= 5;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb 
        style={{ marginBottom: 24 }}
        items={[
          { title: <Link to="/">Shop</Link> },
          { title: product.brand },
          { title: product.name },
        ]}
      />

      <Row gutter={[48, 32]}>
        {/* Product Images */}
        <Col xs={24} md={12}>
          {/* Main Image */}
          <div style={{ 
            background: '#f5f5f5', 
            borderRadius: 12, 
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            <img
              src={product.images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              style={{ 
                width: '100%', 
                height: 'auto', 
                aspectRatio: '1', 
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          
          {/* Thumbnail Gallery */}
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
                      border: idx === selectedImage 
                        ? '2px solid #1a1a1a' 
                        : '2px solid transparent',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <img
                      src={img || '/placeholder.svg'}
                      alt={`${product.name} ${idx + 1}`}
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        aspectRatio: '1', 
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* Product Info */}
        <Col xs={24} md={12}>
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            {/* Brand */}
            <Text 
              type="secondary" 
              style={{ 
                fontSize: 14, 
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {product.brand}
            </Text>
            
            {/* Title */}
            <Title level={2} style={{ marginTop: 4, marginBottom: 12 }}>
              {product.name}
            </Title>
            
            {/* Tags */}
            <Space style={{ marginBottom: 16 }}>
              {product.featured && <Tag color="gold">Featured</Tag>}
              <Tag>{product.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Tag>
            </Space>

            <Divider style={{ margin: '16px 0' }} />

            {/* Size Selection */}
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 12 }}>
                Size
              </Text>
              <Radio.Group 
                value={selectedSize?.id} 
                onChange={(e) => {
                  const size = product.sizes.find(s => s.id === e.target.value);
                  setSelectedSize(size || null);
                  setQuantity(1);
                }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {product.sizes.map(size => (
                    <Radio 
                      key={size.id} 
                      value={size.id} 
                      disabled={size.stock === 0}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        background: selectedSize?.id === size.id ? '#f9fafb' : '#fff',
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        width: '100%',
                      }}>
                        <Space>
                          <span style={{ fontWeight: 500 }}>{size.size}</span>
                          {size.stock === 0 && <Tag color="red">Out of Stock</Tag>}
                          {size.stock > 0 && size.stock <= 5 && (
                            <Tag color="orange">Only {size.stock} left</Tag>
                          )}
                        </Space>
                        <PriceDisplay size={size} showSavings={isProfessional} />
                      </div>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>

            {/* Price Display */}
            {selectedSize && (
              <div style={{ marginBottom: 24 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                  Price
                </Text>
                <PriceDisplay size={selectedSize} large showSavings />
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div style={{ 
              display: 'flex', 
              gap: 16, 
              alignItems: 'flex-end',
              marginBottom: 24,
            }}>
              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                  Quantity
                </Text>
                <InputNumber
                  min={1}
                  max={selectedSize?.stock || 1}
                  value={quantity}
                  onChange={(val) => setQuantity(val || 1)}
                  style={{ width: 100 }}
                  size="large"
                />
              </div>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                disabled={!inStock}
                onClick={handleAddToCart}
                style={{ flex: 1, height: 48 }}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button 
                size="large" 
                icon={<HeartOutlined />}
                style={{ height: 48 }}
              />
            </div>

            {/* Stock Warning */}
            {lowStock && (
              <Alert
                message={`Only ${selectedSize?.stock} left in stock`}
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Trust Badges */}
            <Space 
              split={<Divider type="vertical" />} 
              style={{ marginBottom: 24 }}
              wrap
            >
              <Space>
                <TruckOutlined style={{ color: '#6b7280' }} />
                <Text type="secondary" style={{ fontSize: 13 }}>Free shipping over $50</Text>
              </Space>
              <Space>
                <SafetyCertificateOutlined style={{ color: '#6b7280' }} />
                <Text type="secondary" style={{ fontSize: 13 }}>Authentic products</Text>
              </Space>
            </Space>

            <Divider />

            {/* Description & Details */}
            <Collapse 
              defaultActiveKey={['description']}
              ghost
              expandIconPosition="end"
              items={[
                {
                  key: 'description',
                  label: <Text strong>Description</Text>,
                  children: <Paragraph type="secondary">{product.description}</Paragraph>,
                },
                {
                  key: 'details',
                  label: <Text strong>Product Details</Text>,
                  children: (
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">Brand: {product.brand}</Text>
                      <Text type="secondary">Category: {product.category}</Text>
                      <Text type="secondary">Available Sizes: {product.sizes.map(s => s.size).join(', ')}</Text>
                    </Space>
                  ),
                },
                {
                  key: 'shipping',
                  label: <Text strong>Shipping & Returns</Text>,
                  children: (
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">Free standard shipping on orders over $50</Text>
                      <Text type="secondary">Express shipping available at checkout</Text>
                      <Text type="secondary">30-day return policy for unopened items</Text>
                    </Space>
                  ),
                },
              ]}
            />
          </Space>
        </Col>
      </Row>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <Divider />
          <Title level={4} style={{ marginBottom: 24 }}>You May Also Like</Title>
          <Row gutter={[16, 16]}>
            {relatedProducts.map(p => (
              <Col key={p.id} xs={12} sm={8} md={6}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
