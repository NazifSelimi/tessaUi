'use client';

import { useNavigate } from 'react-router-dom';
import { 
  Typography, Table, Button, InputNumber, Space, Empty, Card, Divider 
} from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useApp } from '@/store/AppContext';
import type { CartItem } from '@/types';

const { Title, Text } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, getPrice } = useApp();
  const { subtotal, itemCount } = getCartTotal();

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (_: unknown, record: CartItem) => (
        <Space>
          <img
            src={record.product.images[0] || "/placeholder.svg"}
            alt={record.product.name}
            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
          />
          <div>
            <Text strong>{record.product.name}</Text>
            <br />
            <Text type="secondary">{record.product.brand} • {record.size.size}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      key: 'price',
      width: 120,
      render: (_: unknown, record: CartItem) => (
        <Text>${getPrice(record.size).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 120,
      render: (_: unknown, record: CartItem) => (
        <InputNumber
          min={1}
          max={record.size.stock}
          value={record.quantity}
          onChange={(val) => updateCartQuantity(record.productId, record.sizeId, val || 1)}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      width: 120,
      render: (_: unknown, record: CartItem) => (
        <Text strong>${(getPrice(record.size) * record.quantity).toFixed(2)}</Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.productId, record.sizeId)}
        />
      ),
    },
  ];

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Empty description="Your cart is empty" />
        <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
        style={{ marginBottom: 16 }}
      >
        Continue Shopping
      </Button>

      <Title level={2}>Shopping Cart</Title>
      <Text type="secondary">{itemCount} items in your cart</Text>

      <div style={{ marginTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <Table
            dataSource={cart}
            columns={columns}
            rowKey={(record) => `${record.productId}-${record.sizeId}`}
            pagination={false}
          />
        </div>

        <Card style={{ width: 320, height: 'fit-content' }}>
          <Title level={4}>Order Summary</Title>
          <Divider />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text>Shipping</Text>
            <Text type="secondary">Calculated at checkout</Text>
          </div>
          
          <Divider />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text strong>Estimated Total</Text>
            <Text strong style={{ fontSize: 18 }}>${subtotal.toFixed(2)}</Text>
          </div>

          <Button type="primary" size="large" block onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </Card>
      </div>
    </div>
  );
}
