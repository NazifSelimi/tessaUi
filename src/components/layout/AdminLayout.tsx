/**
 * Admin Layout Component
 * 
 * Provides the layout structure for admin pages including:
 * - Collapsible sidebar navigation
 * - Header with breadcrumbs
 * - Main content area
 */

import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Space, Avatar, Dropdown, Badge } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  UserOutlined,
  ScissorOutlined,
  TagOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/contexts';
import { stylistRequests } from '@/mock/data';

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

// Count pending requests for badge
const pendingCount = stylistRequests.filter(r => r.status === 'pending').length;

// Sidebar menu items
const menuItems = [
  { 
    key: '/admin', 
    icon: <DashboardOutlined />, 
    label: <Link to="/admin">Dashboard</Link> 
  },
  { 
    key: '/admin/products', 
    icon: <ShoppingOutlined />, 
    label: <Link to="/admin/products">Products</Link> 
  },
  { 
    key: '/admin/orders', 
    icon: <FileTextOutlined />, 
    label: <Link to="/admin/orders">Orders</Link> 
  },
  { 
    key: '/admin/users', 
    icon: <UserOutlined />, 
    label: <Link to="/admin/users">Users</Link> 
  },
  { 
    key: '/admin/stylist-requests', 
    icon: <ScissorOutlined />, 
    label: (
      <Link to="/admin/stylist-requests">
        <Space>
          Stylist Requests
          {pendingCount > 0 && (
            <Badge count={pendingCount} size="small" />
          )}
        </Space>
      </Link>
    )
  },
  { 
    key: '/admin/coupons', 
    icon: <TagOutlined />, 
    label: <Link to="/admin/coupons">Coupons</Link> 
  },
  { 
    key: '/admin/distributors', 
    icon: <TeamOutlined />, 
    label: <Link to="/admin/distributors">Distributors</Link> 
  },
];

// Page titles mapping
const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
  '/admin/stylist-requests': 'Stylist Requests',
  '/admin/coupons': 'Coupons',
  '/admin/distributors': 'Distributors',
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Get current page title
  const currentTitle = pageTitles[location.pathname] || 'Admin';

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // User dropdown items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/account'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={260} 
        style={{ 
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ 
          padding: collapsed ? '20px 12px' : '20px 24px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
          }}>
            T
          </div>
          {!collapsed && (
            <div>
              <Title level={5} style={{ margin: 0, lineHeight: 1.2 }}>TESSA</Title>
              <Text type="secondary" style={{ fontSize: 11 }}>Admin Panel</Text>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            borderRight: 'none', 
            padding: '12px 8px',
          }}
        />

        {/* Back to Shop Link */}
        <div style={{ 
          position: 'absolute', 
          bottom: 60, 
          left: 0, 
          right: 0, 
          padding: collapsed ? '0 8px' : '0 16px',
        }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            block
            style={{ 
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: '#6b7280',
            }}
          >
            {!collapsed && 'Back to Shop'}
          </Button>
        </div>
      </Sider>

      {/* Main Area */}
      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          height: 64,
        }}>
          {/* Left: Collapse button & Title */}
          <Space size="middle">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <Title level={4} style={{ margin: 0 }}>{currentTitle}</Title>
          </Space>

          {/* Right: Notifications & User */}
          <Space size="middle">
            <Badge count={pendingCount} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                onClick={() => navigate('/admin/stylist-requests')}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  size={36} 
                  style={{ background: '#1a1a1a' }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </Avatar>
                <div style={{ lineHeight: 1.2 }}>
                  <Text strong style={{ display: 'block', fontSize: 13 }}>
                    {user?.name || 'Admin'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>Administrator</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ 
          padding: 24, 
          background: '#fafafa',
          minHeight: 'calc(100vh - 64px)',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
