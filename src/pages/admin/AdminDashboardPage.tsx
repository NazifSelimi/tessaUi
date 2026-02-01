import { Link } from 'react-router-dom';
import { Typography, Card, Row, Col, Statistic, Table, Tag, Button } from 'antd';
import { 
  ShoppingOutlined, DollarOutlined, UserOutlined, 
  ScissorOutlined, RiseOutlined, FileTextOutlined 
} from '@ant-design/icons';
import { orders, users, stylistRequests } from '@/mock/data';

const { Title, Text } = Typography;

export default function AdminDashboardPage() {
  const recentOrders = orders.slice(0, 5);
  const pendingRequests = stylistRequests.filter(r => r.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUsers = users.length;

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>{id}</Text>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_: unknown, record: typeof orders[0]) => (
        <Text>{record.shippingAddress.fullName}</Text>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'delivered' ? 'green' : status === 'shipped' ? 'blue' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Text type="secondary">Welcome back! Here's an overview of your store.</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={orders.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Pending Requests"
              value={pendingRequests}
              prefix={<ScissorOutlined />}
              valueStyle={pendingRequests > 0 ? { color: '#faad14' } : undefined}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Orders" 
            extra={<Link to="/admin/orders"><Button type="link">View All</Button></Link>}
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

        <Col xs={24} lg={8}>
          <Card title="Quick Actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/admin/products">
                <Button icon={<ShoppingOutlined />} block>Manage Products</Button>
              </Link>
              <Link to="/admin/orders">
                <Button icon={<FileTextOutlined />} block>View Orders</Button>
              </Link>
              <Link to="/admin/stylist-requests">
                <Button icon={<ScissorOutlined />} block>
                  Stylist Requests {pendingRequests > 0 && `(${pendingRequests})`}
                </Button>
              </Link>
              <Link to="/admin/coupons">
                <Button icon={<RiseOutlined />} block>Manage Coupons</Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
