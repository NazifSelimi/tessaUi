/**
 * Cart Page Component
 * Displays cart items with quantity controls and checkout summary
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Card,
  Empty,
  InputNumber,
  Space,
  Divider,
  Row,
  Col,
  Image,
  Popconfirm,
  message,
  Table,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import type { CartItem } from '../types';

const { Title, Text, Paragraph } = Typography;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (productId: string, sizeId: string, quantity: number | null) => {
    if (quantity && quantity > 0) {
      updateQuantity(productId, sizeId, quantity);
    }
  };

  const handleRemoveItem = (productId: string, sizeId: string) => {
    removeItem(productId, sizeId);
    message.success('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    message.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (!user) {
      message.info('Please log in to proceed with checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  const totals = getCartTotal();

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (_: unknown, record: CartItem) => (
        <Space>
          <Image
            src={record.product.images[0] || '/placeholder.svg'}
            alt={record.product.name}
            width={80}
            height={80}
            style={{ objectFit: 'cover', borderRadius: 8 }}
            preview={false}
            fallback="/placeholder.svg"
          />
          <div>
            <Link to={`/product/${record.product.id}`}>
              <Text strong style={{ color: '#1a1a2e' }}>{record.product.name}</Text>
            </Link>
            <br />
            <Text type="secondary">{record.product.brand}</Text>
            {record.size && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>{record.size.size}</Text>
              </>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      key: 'price',
      width: 120,
      render: (_: unknown, record: CartItem) => {
        const price = record.size?.retailPrice || record.product.retailPrice;
        return <Text>${price.toFixed(2)}</Text>;
      },
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 130,
      render: (_: unknown, record: CartItem) => (
        <InputNumber
          min={1}
          max={record.size?.stock || record.product.stock || 99}
          value={record.quantity}
          onChange={(val) => handleQuantityChange(record.product.id, record.size?.id || '', val)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: 120,
      render: (_: unknown, record: CartItem) => {
        const price = record.size?.retailPrice || record.product.retailPrice;
        return <Text strong>${(price * record.quantity).toFixed(2)}</Text>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: CartItem) => (
        <Popconfirm
          title="Remove item"
          description="Are you sure you want to remove this item?"
          onConfirm={() => handleRemoveItem(record.product.id, record.size?.id || '')}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            aria-label="Remove item"
          />
        </Popconfirm>
      ),
    },
  ];

  if (items.length === 0) {
    return (
      <div style={{ padding: '48px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <Empty
          image={<ShoppingOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />}
          description={
            <Space direction="vertical" size={8}>
              <Title level={4} style={{ margin: 0 }}>Your cart is empty</Title>
              <Paragraph type="secondary">
                Looks like you haven't added any items to your cart yet.
                Browse our collection to find something you'll love.
              </Paragraph>
            </Space>
          }
        >
          <Link to="/products">
            <Button type="primary" size="large" icon={<ShoppingOutlined />}>
              Start Shopping
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <ArrowLeftOutlined />
          <span>Continue Shopping</span>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Shopping Cart</Title>
          <Text type="secondary">{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cart Items Table */}
        <Col xs={24} lg={16}>
          <Card>
            <Table
              dataSource={items}
              columns={columns}
              rowKey={(record) => `${record.product.id}-${record.size?.id || 'default'}`}
              pagination={false}
            />
            
            {/* Clear Cart */}
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Popconfirm
                title="Clear cart"
                description="Are you sure you want to remove all items?"
                onConfirm={handleClearCart}
                okText="Yes"
                cancelText="No"
              >
                <Button type="text" danger>
                  Clear Cart
                </Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ position: 'sticky', top: 24 }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Subtotal ({totals.itemCount} items)</Text>
                <Text>${totals.subtotal.toFixed(2)}</Text>
              </div>

              {totals.savings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">Savings</Text>
                  <Text style={{ color: '#52c41a' }}>-${totals.savings.toFixed(2)}</Text>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Shipping</Text>
                <Text>{totals.subtotal >= 50 ? 'FREE' : '$5.99'}</Text>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 16 }}>Estimated Total</Text>
                <Text strong style={{ fontSize: 18, color: '#1a1a2e' }}>
                  ${(totals.subtotal + (totals.subtotal >= 50 ? 0 : 5.99)).toFixed(2)}
                </Text>
              </div>

              {totals.subtotal < 50 && (
                <div style={{ 
                  background: '#fff7e6', 
                  padding: 12, 
                  borderRadius: 8,
                  border: '1px solid #ffd591'
                }}>
                  <Text style={{ color: '#d48806', fontSize: 13 }}>
                    Add ${(50 - totals.subtotal).toFixed(2)} more for FREE shipping!
                  </Text>
                </div>
              )}

              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
                style={{ marginTop: 8 }}
              >
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <Divider style={{ margin: '16px 0 8px' }} />
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>Secure SSL Checkout</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TruckOutlined style={{ color: '#1890ff' }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>Free shipping on orders $50+</Text>
                </div>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
