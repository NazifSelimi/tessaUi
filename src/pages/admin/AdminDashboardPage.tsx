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
  TeamOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { orders, users, stylistRequests, products } from '@/mock/data';
import type { Order } from '@/types';

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

  // Responsive columns for mobile
  const orderColumns = [
    {
      title: 'Order',
      key: 'order',
      render: (_: unknown, record: Order) => (
        <div>
          <Text strong style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}>
            {record.id}
          </Text>
          <div>
            <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
              {record.shippingAddress.fullName}
            </Text>
          </div>
        </div>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as const,
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
      responsive: ['md', 'lg', 'xl'] as const,
    },
    {
      title: 'Items',
      key: 'items',
      render: (_: unknown, record: Order) => (
        <Text type="secondary">{record.items.length} item(s)</Text>
      ),
      responsive: ['lg', 'xl'] as const,
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
          <Button type="text" size="small" icon={<EyeOutlined />} aria-label="View order" />
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="loading-state">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 'var(--spacing-xl)' }}>
        <Col xs={12} md={6}>
          <Card className="stat-card" bodyStyle={{ padding: 'var(--spacing-lg)' }}>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined style={{ color: 'var(--color-success)' }} />}
              precision={2}
              valueStyle={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-xl)' }}
            />
            <div className="stat-card__change">
              <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                <ArrowUpOutlined style={{ color: 'var(--color-success)' }} /> {revenueChange}% vs last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card" bodyStyle={{ padding: 'var(--spacing-lg)' }}>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<FileTextOutlined style={{ color: 'var(--color-primary)' }} />}
              valueStyle={{ fontSize: 'var(--font-size-xl)' }}
            />
            <div className="stat-card__change">
              <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                <ArrowUpOutlined style={{ color: 'var(--color-success)' }} /> {ordersChange}% vs last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card" bodyStyle={{ padding: 'var(--spacing-lg)' }}>
            <Statistic
              title="Total Customers"
              value={totalUsers}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ fontSize: 'var(--font-size-xl)' }}
            />
            <div className="stat-card__change">
              <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                <ArrowUpOutlined style={{ color: 'var(--color-success)' }} /> {usersChange}% vs last month
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card" bodyStyle={{ padding: 'var(--spacing-lg)' }}>
            <Statistic
              title="Pending Requests"
              value={pendingRequests}
              prefix={<ScissorOutlined style={{ color: pendingRequests > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' }} />}
              valueStyle={pendingRequests > 0 ? { color: 'var(--color-warning)', fontSize: 'var(--font-size-xl)' } : { fontSize: 'var(--font-size-xl)' }}
            />
            <div className="stat-card__change">
              <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                Stylist verifications
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Recent Orders */}
        <Col xs={24} xl={16}>
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
            bodyStyle={{ padding: 0 }}
          >
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 400 }}
            />
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} xl={8}>
          {/* Quick Actions */}
          <Card title="Quick Actions" style={{ marginBottom: 'var(--spacing-lg)' }}>
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
                <div className="inventory-row">
                  <Text>Total Products</Text>
                  <Text strong>{totalProducts}</Text>
                </div>
                <Progress percent={100} showInfo={false} strokeColor="var(--color-primary)" />
              </div>
              
              <div>
                <div className="inventory-row">
                  <Text>Low Stock Items</Text>
                  <Text strong style={{ color: lowStockProducts > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                    {lowStockProducts}
                  </Text>
                </div>
                <Progress
                  percent={Math.round((lowStockProducts / totalProducts) * 100)}
                  showInfo={false}
                  strokeColor={lowStockProducts > 0 ? 'var(--color-warning)' : 'var(--color-success)'}
                />
              </div>

              {lowStockProducts > 0 && (
                <Link to="/admin/products?filter=low-stock">
                  <Button type="link" style={{ padding: 0 }}>
                    View low stock items &rarr;
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
