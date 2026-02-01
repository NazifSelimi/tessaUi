/**
 * Main Layout Component
 * 
 * Provides the primary layout structure for the shop pages including:
 * - Sticky header with navigation
 * - Main content area
 * - Footer
 */

import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Badge, Button, Dropdown, Space, Typography, Divider } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  DownOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth, useCart } from '@/contexts';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const navigate = useNavigate();
  const { user, currentRole, logout, isAdmin, isDistributor, isStylist } = useAuth();
  const { itemCount, openDrawer } = useCart();

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // User dropdown menu items
  const userMenuItems = user ? [
    { 
      key: 'account', 
      icon: <UserOutlined />,
      label: 'My Account', 
      onClick: () => navigate('/account') 
    },
    { 
      key: 'orders', 
      icon: <FileTextOutlined />,
      label: 'My Orders', 
      onClick: () => navigate('/account/orders') 
    },
    { type: 'divider' as const },
    { 
      key: 'logout', 
      icon: <LogoutOutlined />,
      label: 'Logout', 
      danger: true,
      onClick: handleLogout,
    },
  ] : [
    { key: 'login', label: 'Sign In', onClick: () => navigate('/login') },
    { key: 'register', label: 'Create Account', onClick: () => navigate('/register') },
  ];

  // Main navigation items
  const navItems = [
    { key: 'shop', label: <Link to="/">Shop</Link> },
    { 
      key: 'categories', 
      label: 'Categories', 
      children: [
        { key: 'shampoo', label: <Link to="/?category=shampoo">Shampoo</Link> },
        { key: 'conditioner', label: <Link to="/?category=conditioner">Conditioner</Link> },
        { key: 'mask', label: <Link to="/?category=mask">Masks</Link> },
        { key: 'hair-color', label: <Link to="/?category=hair-color">Hair Color</Link> },
        { key: 'styling', label: <Link to="/?category=styling">Styling</Link> },
        { key: 'bleach-decolor', label: <Link to="/?category=bleach-decolor">Bleach & De Color</Link> },
        { type: 'divider' as const },
        { key: 'all', label: <Link to="/">View All Categories</Link> },
      ]
    },
    { 
      key: 'brands', 
      label: 'Brands', 
      children: [
        { key: 'fanola', label: <Link to="/?brand=fanola">Fanola</Link> },
        { key: 'oro-therapy', label: <Link to="/?brand=oro-therapy">Oro Therapy</Link> },
        { key: 'rr-line', label: <Link to="/?brand=rr-line">Rr Line</Link> },
        { key: 'no-yellow-color', label: <Link to="/?brand=no-yellow-color">No Yellow Color</Link> },
      ]
    },
  ];

  // Add role-specific nav items
  if (isStylist) {
    navItems.push({ 
      key: 'stylist', 
      label: <Link to="/stylist/request">Stylist Portal</Link> 
    });
  }
  
  if (isDistributor) {
    navItems.push({ 
      key: 'distributor', 
      label: <Link to="/distributor">Distributor Portal</Link> 
    });
  }
  
  if (isAdmin) {
    navItems.push({ 
      key: 'admin', 
      label: <Link to="/admin">Admin Dashboard</Link> 
    });
  }
  
  // Show "Become a Stylist" for regular users
  if (currentRole === 'guest' || currentRole === 'user') {
    navItems.push({ 
      key: 'become-stylist', 
      label: <Link to="/stylist/request">Become a Stylist</Link> 
    });
  }

  // Role badge color
  const getRoleBadgeStyle = () => {
    switch (currentRole) {
      case 'admin': return { background: '#fee2e2', color: '#dc2626' };
      case 'distributor': return { background: '#fef3c7', color: '#d97706' };
      case 'stylist': return { background: '#ddd6fe', color: '#7c3aed' };
      case 'user': return { background: '#dbeafe', color: '#2563eb' };
      default: return { background: '#f3f4f6', color: '#6b7280' };
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
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
        zIndex: 100,
        height: 64,
      }}>
        {/* Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Link 
            to="/" 
            style={{ 
              fontSize: 26, 
              fontWeight: 700, 
              color: '#1a1a1a', 
              textDecoration: 'none',
              letterSpacing: '-0.5px',
            }}
          >
            TESSA
          </Link>
          <Menu
            mode="horizontal"
            items={navItems}
            style={{ 
              border: 'none', 
              minWidth: 400,
              background: 'transparent',
            }}
            selectedKeys={[]}
          />
        </div>

        {/* Right Side Actions */}
        <Space size="middle">
          {/* Role Badge */}
          {currentRole !== 'guest' && (
            <span style={{ 
              ...getRoleBadgeStyle(),
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              textTransform: 'capitalize',
            }}>
              {currentRole}
            </span>
          )}
          
          {/* Cart Button */}
          <Badge count={itemCount} size="small" offset={[-2, 2]}>
            <Button 
              type="text" 
              icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
              onClick={openDrawer}
              style={{ width: 40, height: 40 }}
            />
          </Badge>

          {/* User Menu */}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" style={{ height: 40 }}>
              <Space>
                <UserOutlined />
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Account'}
                </span>
                <DownOutlined style={{ fontSize: 10 }} />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      </Header>

      {/* Main Content */}
      <Content style={{ 
        padding: '24px', 
        maxWidth: 1400, 
        margin: '0 auto', 
        width: '100%',
        minHeight: 'calc(100vh - 64px - 70px)',
      }}>
        <Outlet />
      </Content>

      {/* Footer */}
      <Footer style={{ 
        background: '#fafafa', 
        borderTop: '1px solid #f0f0f0',
        padding: '24px 48px',
      }}>
        <div style={{ 
          maxWidth: 1400, 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <Text strong style={{ fontSize: 16 }}>TESSA</Text>
            <Text type="secondary" style={{ marginLeft: 16 }}>
              Premium Professional Hair Care
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 13 }}>
            &copy; {new Date().getFullYear()} Tessa Hair Care. All rights reserved.
          </Text>
        </div>
      </Footer>
    </Layout>
  );
}
