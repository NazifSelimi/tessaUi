/**
 * Main Layout Component
 * 
 * Provides the primary layout structure for the shop pages including:
 * - Responsive header with mobile menu
 * - Main content area
 * - Footer
 */

import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  Layout, Menu, Badge, Button, Dropdown, Space, Typography, Drawer,
} from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  DownOutlined,
  LogoutOutlined,
  FileTextOutlined,
  MenuOutlined,
  CloseOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useAuth, useCart } from '@/contexts';
import CartDrawer from '../CartDrawer';
import RoleSwitcher from '../RoleSwitcher';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const navigate = useNavigate();
  const { user, currentRole, logout, isAdmin, isDistributor, isStylist } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // User dropdown menu items
  const userMenuItems = user ? [
    { 
      key: 'account', 
      icon: <UserOutlined />,
      label: 'My Account', 
      onClick: () => { navigate('/account'); setMobileMenuOpen(false); }
    },
    { 
      key: 'orders', 
      icon: <FileTextOutlined />,
      label: 'My Orders', 
      onClick: () => { navigate('/account/orders'); setMobileMenuOpen(false); }
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
    { key: 'login', label: 'Sign In', onClick: () => { navigate('/login'); setMobileMenuOpen(false); } },
    { key: 'register', label: 'Create Account', onClick: () => { navigate('/register'); setMobileMenuOpen(false); } },
  ];

  // Main navigation items
  const getNavItems = () => {
    const items = [
      { key: 'shop', label: <Link to="/" onClick={() => setMobileMenuOpen(false)}>Shop</Link> },
      { 
        key: 'categories', 
        label: 'Categories', 
        children: [
          { key: 'shampoo', label: <Link to="/?category=shampoo" onClick={() => setMobileMenuOpen(false)}>Shampoo</Link> },
          { key: 'conditioner', label: <Link to="/?category=conditioner" onClick={() => setMobileMenuOpen(false)}>Conditioner</Link> },
          { key: 'mask', label: <Link to="/?category=mask" onClick={() => setMobileMenuOpen(false)}>Masks</Link> },
          { key: 'hair-color', label: <Link to="/?category=hair-color" onClick={() => setMobileMenuOpen(false)}>Hair Color</Link> },
          { key: 'styling', label: <Link to="/?category=styling" onClick={() => setMobileMenuOpen(false)}>Styling</Link> },
          { key: 'bleach-decolor', label: <Link to="/?category=bleach-decolor" onClick={() => setMobileMenuOpen(false)}>Bleach & De Color</Link> },
        ]
      },
      { 
        key: 'brands', 
        label: 'Brands', 
        children: [
          { key: 'fanola', label: <Link to="/?brand=fanola" onClick={() => setMobileMenuOpen(false)}>Fanola</Link> },
          { key: 'oro-therapy', label: <Link to="/?brand=oro-therapy" onClick={() => setMobileMenuOpen(false)}>Oro Therapy</Link> },
          { key: 'rr-line', label: <Link to="/?brand=rr-line" onClick={() => setMobileMenuOpen(false)}>Rr Line</Link> },
          { key: 'no-yellow-color', label: <Link to="/?brand=no-yellow-color" onClick={() => setMobileMenuOpen(false)}>No Yellow Color</Link> },
        ]
      },
    ];

    // Role-specific items
    if (isStylist) {
      items.push({ 
        key: 'stylist', 
        label: <Link to="/stylist/request" onClick={() => setMobileMenuOpen(false)}>Stylist Portal</Link> 
      } as any);
    }
    
    if (isDistributor) {
      items.push({ 
        key: 'distributor', 
        label: <Link to="/distributor" onClick={() => setMobileMenuOpen(false)}>Distributor Portal</Link> 
      } as any);
    }
    
    if (isAdmin) {
      items.push({ 
        key: 'admin', 
        label: <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link> 
      } as any);
    }
    
    if (currentRole === 'guest' || currentRole === 'user') {
      items.push({ 
        key: 'become-stylist', 
        label: <Link to="/stylist/request" onClick={() => setMobileMenuOpen(false)}>Become a Stylist</Link> 
      } as any);
    }

    return items;
  };

  const getRoleBadgeClass = () => {
    switch (currentRole) {
      case 'admin': return 'role-badge role-badge--admin';
      case 'distributor': return 'role-badge role-badge--distributor';
      case 'stylist': return 'role-badge role-badge--stylist';
      case 'user': return 'role-badge role-badge--user';
      default: return 'role-badge role-badge--guest';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--color-surface)' }}>
      {/* Header */}
      <Header className="site-header" style={{ 
        background: 'var(--color-surface)', 
        padding: 0, 
        height: 'var(--header-height)',
        lineHeight: 'var(--header-height)',
      }}>
        <div className="site-header__inner">
          {/* Logo */}
          <Link to="/" className="site-header__logo">
            TESSA
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="site-header__nav">
            <Menu
              mode="horizontal"
              items={getNavItems()}
              style={{ 
                border: 'none', 
                background: 'transparent',
                minWidth: 400,
              }}
              selectedKeys={[]}
            />
          </nav>

          {/* Right Side Actions */}
          <div className="site-header__actions">
            {/* Role Badge - Desktop Only */}
            {currentRole !== 'guest' && (
              <span className={`${getRoleBadgeClass()} hidden-mobile`}>
                {currentRole}
              </span>
            )}
            
            {/* Cart Button */}
            <Badge count={itemCount} size="small" offset={[-2, 2]}>
              <Button 
                type="text" 
                icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                onClick={openDrawer}
                aria-label="Shopping cart"
                style={{ width: 40, height: 40 }}
              />
            </Badge>

            {/* User Menu - Desktop */}
            <Dropdown 
              menu={{ items: userMenuItems }} 
              trigger={['click']} 
              placement="bottomRight"
              className="hidden-mobile"
            >
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

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-menu-btn"
              aria-label="Open menu"
              style={{ 
                display: 'none',
                width: 40, 
                height: 40,
              }}
            />
          </div>
        </div>
      </Header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 20 }}>TESSA</span>
            {currentRole !== 'guest' && (
              <span className={getRoleBadgeClass()}>{currentRole}</span>
            )}
          </div>
        }
        placement="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={280}
        closeIcon={<CloseOutlined />}
        styles={{ body: { padding: 0 } }}
      >
        {/* User Info */}
        {user && (
          <div style={{ 
            padding: 'var(--spacing-lg)', 
            borderBottom: '1px solid var(--color-border-light)',
            background: 'var(--color-background-alt)',
          }}>
            <Text strong style={{ display: 'block' }}>{user.name}</Text>
            <Text type="secondary" style={{ fontSize: 13 }}>{user.email}</Text>
          </div>
        )}

        {/* Mobile Navigation */}
        <Menu
          mode="inline"
          items={getNavItems()}
          style={{ border: 'none' }}
          selectedKeys={[]}
        />

        {/* Account Links */}
        <div style={{ padding: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border-light)' }}>
          {user ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                block 
                icon={<UserOutlined />}
                onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}
              >
                My Account
              </Button>
              <Button 
                block 
                icon={<FileTextOutlined />}
                onClick={() => { navigate('/account/orders'); setMobileMenuOpen(false); }}
              >
                My Orders
              </Button>
              <Button 
                block 
                danger 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Space>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                block 
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              >
                Sign In
              </Button>
              <Button 
                block 
                onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
              >
                Create Account
              </Button>
            </Space>
          )}
        </div>
      </Drawer>

      {/* Main Content */}
      <Content className="main-content">
        <Outlet />
      </Content>

      {/* Footer */}
      <Footer className="site-footer">
        <div className="site-footer__inner">
          <div>
            <Text strong style={{ fontSize: 16 }}>TESSA</Text>
            <Text type="secondary" style={{ marginLeft: 16 }}>
              Premium Professional Hair Care
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {new Date().getFullYear()} Tessa Hair Care. All rights reserved.
          </Text>
        </div>
      </Footer>

      {/* Cart Drawer */}
      <CartDrawer />
      
      {/* Role Switcher (DEV only) */}
      <RoleSwitcher />

      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 767px) {
          .site-header__nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
        @media (min-width: 768px) {
          .site-header__nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  );
}
