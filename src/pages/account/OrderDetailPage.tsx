'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Card, Row, Col, Tag, Button, Steps, Spin, Descriptions, Table, Divider 
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getOrderById } from '@/api/client';
import type { Order } from '@/types';

const { Title, Text } = Typography;

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const statusColors: Record<string, string> = {
  pending: 'orange',
  confirmed: 'blue',
  processing: 'cyan',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data || null);
      setLoading(false);
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={4}>Order not found</Title>
        <Button onClick={() => navigate('/account/orders')}>Back to Orders</Button>
      </div>
    );
  }

  const currentStep = order.status === 'cancelled' 
    ? -1 
    : statusSteps.indexOf(order.status);

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_: unknown, record: Order['items'][0]) => (
        <div>
          <Text strong>{record.productName}</Text>
          <br />
          <Text type="secondary">{record.sizeName}</Text>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'unitPrice',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => <Text strong>${total.toFixed(2)}</Text>,
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/account/orders')}
        style={{ marginBottom: 16 }}
      >
        Back to Orders
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Order {order.id}</Title>
          <Text type="secondary">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </div>
        <Tag color={statusColors[order.status]} style={{ fontSize: 14, padding: '4px 12px' }}>
          {order.status.toUpperCase()}
        </Tag>
      </div>

      {order.status !== 'cancelled' && (
        <Card style={{ marginBottom: 24 }}>
          <Steps
            current={currentStep}
            items={[
              { title: 'Pending' },
              { title: 'Confirmed' },
              { title: 'Processing' },
              { title: 'Shipped' },
              { title: 'Delivered' },
            ]}
          />
        </Card>
      )}

      <Row gutter={24}>
        <Col xs={24} md={14}>
          <Card title="Order Items" style={{ marginBottom: 24 }}>
            <Table
              dataSource={order.items}
              columns={columns}
              rowKey={(record) => `${record.productId}-${record.sizeId}`}
              pagination={false}
            />
          </Card>

          {order.customMessage && (
            <Card title="Order Notes" style={{ marginBottom: 24 }}>
              <Text>{order.customMessage}</Text>
            </Card>
          )}
        </Col>

        <Col xs={24} md={10}>
          <Card title="Shipping Address" style={{ marginBottom: 24 }}>
            <Text strong>{order.shippingAddress.fullName}</Text>
            <br />
            <Text>{order.shippingAddress.phone}</Text>
            <br />
            <Text>
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Text>
          </Card>

          <Card title="Payment">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Method">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={order.paymentStatus === 'paid' ? 'green' : 'orange'}>
                  {order.paymentStatus.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Subtotal</Text>
              <Text>${order.subtotal.toFixed(2)}</Text>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="success">Discount {order.couponCode && `(${order.couponCode})`}</Text>
                <Text type="success">-${order.discount.toFixed(2)}</Text>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Shipping</Text>
              <Text>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</Text>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16 }}>Total</Text>
              <Text strong style={{ fontSize: 18 }}>${order.total.toFixed(2)}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
