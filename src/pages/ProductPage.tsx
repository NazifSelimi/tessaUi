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
  ShoppingCartOutlined, HeartOutlined,
  CheckCircleOutlined, TruckOutlined,
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
        const defaultSize = productData.sizes.find(s => s.stock > 0) || productData.sizes[0];
        setSelectedSize(defaultSize || null);
        
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
      icon: <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-state" style={{ padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="empty-state">
        <Title level={4}>Product not found</Title>
        <Text type="secondary" className="empty-state__description">
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
        style={{ marginBottom: 'var(--spacing-xl)' }}
        items={[
          { title: <Link to="/">Shop</Link> },
          { title: product.brand },
          { title: product.name },
        ]}
      />

      <div className="product-detail">
        {/* Product Images */}
        <div className="product-detail__gallery">
          {/* Main Image */}
          <div className="product-detail__main-image">
            <img
              src={product.images[selectedImage] || '/placeholder.svg'}
              alt={product.name}
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="product-detail__thumbnails">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`product-detail__thumbnail ${idx === selectedImage ? 'product-detail__thumbnail--active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img || '/placeholder.svg'}
                    alt={`${product.name} ${idx + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-detail__info">
          {/* Brand */}
          <Text className="product-detail__brand">
            {product.brand}
          </Text>
          
          {/* Title */}
          <Title level={2} className="product-detail__title">
            {product.name}
          </Title>
          
          {/* Tags */}
          <Space style={{ marginBottom: 'var(--spacing-lg)' }}>
            {product.featured && <Tag color="gold">Featured</Tag>}
            <Tag>{product.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Tag>
          </Space>

          <Divider style={{ margin: 'var(--spacing-lg) 0' }} />

          {/* Size Selection */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <Text strong style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
              Size
            </Text>
            <Radio.Group 
              value={selectedSize?.id} 
              onChange={(e) => {
                const size = product.sizes.find(s => s.id === e.target.value);
                setSelectedSize(size || null);
                setQuantity(1);
              }}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {product.sizes.map(size => (
                  <Radio 
                    key={size.id} 
                    value={size.id} 
                    disabled={size.stock === 0}
                    className={`size-option ${selectedSize?.id === size.id ? 'size-option--selected' : ''} ${size.stock === 0 ? 'size-option--disabled' : ''}`}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-md) var(--spacing-lg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      background: selectedSize?.id === size.id ? 'var(--color-background-alt)' : 'var(--color-surface)',
                      marginRight: 0,
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%',
                      flexWrap: 'wrap',
                      gap: 'var(--spacing-sm)',
                    }}>
                      <Space wrap>
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
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                Price
              </Text>
              <PriceDisplay size={selectedSize} large showSavings />
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-lg)', 
            alignItems: 'flex-end',
            marginBottom: 'var(--spacing-xl)',
            flexWrap: 'wrap',
          }}>
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                Quantity
              </Text>
              <InputNumber
                min={1}
                max={selectedSize?.stock || 1}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                style={{ width: 100 }}
                size="large"
                aria-label="Product quantity"
              />
            </div>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              disabled={!inStock}
              onClick={handleAddToCart}
              style={{ flex: 1, minWidth: 150, height: 48 }}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button 
              size="large" 
              icon={<HeartOutlined />}
              style={{ height: 48 }}
              aria-label="Add to wishlist"
            />
          </div>

          {/* Stock Warning */}
          {lowStock && (
            <Alert
              message={`Only ${selectedSize?.stock} left in stock`}
              type="warning"
              showIcon
              style={{ marginBottom: 'var(--spacing-lg)' }}
            />
          )}

          {/* Trust Badges */}
          <div className="trust-badges" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <div className="trust-badge">
              <TruckOutlined />
              <Text type="secondary" style={{ fontSize: 'var(--font-size-sm)' }}>Free shipping over $50</Text>
            </div>
            <div className="trust-badge">
              <SafetyCertificateOutlined />
              <Text type="secondary" style={{ fontSize: 'var(--font-size-sm)' }}>Authentic products</Text>
            </div>
          </div>

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
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-3xl)' }}>
          <Divider />
          <Title level={4} style={{ marginBottom: 'var(--spacing-xl)' }}>You May Also Like</Title>
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
