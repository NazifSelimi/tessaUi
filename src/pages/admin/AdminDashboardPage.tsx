/**
 * Admin Dashboard Page
 * Main dashboard with KPIs, charts, and quick actions
 * 
 * TODO: API Integration
 * - Connect to analytics endpoints for real-time data
 * - Implement dashboard refresh functionality
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Progress,
  Avatar,
  Spin,
} from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  ScissorOutlined,
  RiseOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { orders, users, stylistRequests, products } from '../../mock/data';
import type { Order } from '../../types';

const { Title, Text } = Typography;

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate dashboard metrics
  const recentOrders = orders.slice(0, 5);
  const pendingRequests = stylistRequests.filter(r => r.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => 
    p.sizes.some(s => s.stock < 10)
  ).length;

  // Calculate percentage changes (mock data)
  const revenueChange = 12.5;
  const ordersChange = 8.3;
  const usersChange = 15.2;

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <Text strong style={{ fontFamily: 'monospace' }}>{id}</Text>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_: unknown, record: Order) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{record.shippingAddress.fullName}</Text>
        </Space>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      render: (_: unknown, record: Order) => (
        <Text type="secondary">{record.items.length} item(s)</Text>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <Text strong>${total.toFixed(2)}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          delivered: 'green',
          shipped: 'blue',
          processing: 'cyan',
          confirmed: 'geekblue',
          pending: 'orange',
          cancelled: 'red',
        };
        return (
          <Tag color={colors[status] || 'default'}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: Order) => (
        <Link to={`/admin/orders/${record.id}`}>
          <Button type="link" size="small">View</Button>
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
        <Text type="secondary">Welcome back! Here's an overview of your store.</Text>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              precision={2}
              valueStyle={{ color: '#1a1a2e' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ArrowUpOutlined style={{ color: '#52c41a' }} /> {revenueChange}% from last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ArrowUpOutlined style={{ color: '#52c41a' }} /> {ordersChange}% from last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={totalUsers}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ArrowUpOutlined style={{ color: '#52c41a' }} /> {usersChange}% from last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Requests"
              value={pendingRequests}
              prefix={<ScissorOutlined style={{ color: pendingRequests > 0 ? '#faad14' : '#8c8c8c' }} />}
              valueStyle={pendingRequests > 0 ? { color: '#faad14' } : undefined}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Stylist verifications
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Recent Orders */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                <span>Recent Orders</span>
              </Space>
            }
            extra={
              <Link to="/admin/orders">
                <Button type="link">View All</Button>
              </Link>
            }
          >
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Quick Actions */}
          <Card title="Quick Actions" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Link to="/admin/products" style={{ display: 'block' }}>
                <Button icon={<ShoppingOutlined />} block>
                  Manage Products
                </Button>
              </Link>
              <Link to="/admin/orders" style={{ display: 'block' }}>
                <Button icon={<FileTextOutlined />} block>
                  View Orders
                </Button>
              </Link>
              <Link to="/admin/stylist-requests" style={{ display: 'block' }}>
                <Button
                  icon={<ScissorOutlined />}
                  block
                  type={pendingRequests > 0 ? 'primary' : 'default'}
                >
                  Stylist Requests {pendingRequests > 0 && `(${pendingRequests})`}
                </Button>
              </Link>
              <Link to="/admin/coupons" style={{ display: 'block' }}>
                <Button icon={<RiseOutlined />} block>
                  Manage Coupons
                </Button>
              </Link>
              <Link to="/admin/users" style={{ display: 'block' }}>
                <Button icon={<UserOutlined />} block>
                  User Management
                </Button>
              </Link>
            </Space>
          </Card>

          {/* Inventory Status */}
          <Card title="Inventory Status">
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Total Products</Text>
                  <Text strong>{totalProducts}</Text>
                </div>
                <Progress percent={100} showInfo={false} strokeColor="#1890ff" />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Low Stock Items</Text>
                  <Text strong style={{ color: lowStockProducts > 0 ? '#faad14' : '#52c41a' }}>
                    {lowStockProducts}
                  </Text>
                </div>
                <Progress
                  percent={Math.round((lowStockProducts / totalProducts) * 100)}
                  showInfo={false}
                  strokeColor={lowStockProducts > 0 ? '#faad14' : '#52c41a'}
                />
              </div>

              {lowStockProducts > 0 && (
                <Link to="/admin/products?filter=low-stock">
                  <Button type="link" style={{ padding: 0 }}>
                    View low stock items <ArrowDownOutlined style={{ transform: 'rotate(-90deg)' }} />
                  </Button>
                </Link>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage;
