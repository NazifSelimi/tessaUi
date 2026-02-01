'use client';

import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  UserOutlined,
  ScissorOutlined,
  TagOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
  { key: '/admin/products', icon: <ShoppingOutlined />, label: <Link to="/admin/products">Products</Link> },
  { key: '/admin/orders', icon: <FileTextOutlined />, label: <Link to="/admin/orders">Orders</Link> },
  { key: '/admin/users', icon: <UserOutlined />, label: <Link to="/admin/users">Users</Link> },
  { key: '/admin/stylist-requests', icon: <ScissorOutlined />, label: <Link to="/admin/stylist-requests">Stylist Requests</Link> },
  { key: '/admin/coupons', icon: <TagOutlined />, label: <Link to="/admin/coupons">Coupons</Link> },
  { key: '/admin/distributors', icon: <TeamOutlined />, label: <Link to="/admin/distributors">Distributors</Link> },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={240} 
        style={{ 
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>TESSA Admin</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="admin-menu"
          style={{ borderRight: 'none', padding: '8px 0' }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
          >
            Back to Shop
          </Button>
        </Header>
        <Content style={{ padding: 24, background: '#fafafa' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
