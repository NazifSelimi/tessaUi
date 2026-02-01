'use client';

import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Badge, Button, Dropdown, Space, Typography } from 'antd';
import { ShoppingCartOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useApp } from '@/store/AppContext';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const navigate = useNavigate();
  const { currentRole, user, getCartTotal, setCartDrawerOpen } = useApp();
  const { itemCount } = getCartTotal();

  const userMenuItems = user ? [
    { key: 'account', label: 'My Account', onClick: () => navigate('/account') },
    { key: 'orders', label: 'My Orders', onClick: () => navigate('/account/orders') },
    { type: 'divider' as const },
    { key: 'logout', label: 'Logout', danger: true },
  ] : [
    { key: 'login', label: 'Login', onClick: () => navigate('/login') },
    { key: 'register', label: 'Register', onClick: () => navigate('/register') },
  ];

  const navItems = [
    { key: 'shop', label: <Link to="/">Shop</Link> },
    { key: 'categories', label: 'Categories', children: [
      { key: 'shampoo', label: <Link to="/?category=shampoo">Shampoo</Link> },
      { key: 'conditioner', label: <Link to="/?category=conditioner">Conditioner</Link> },
      { key: 'hair-masks', label: <Link to="/?category=hair-masks">Hair Masks</Link> },
      { key: 'treatments', label: <Link to="/?category=treatments">Treatments</Link> },
      { key: 'styling', label: <Link to="/?category=styling">Styling</Link> },
    ]},
    { key: 'brands', label: 'Brands', children: [
      { key: 'fanola', label: <Link to="/?brand=fanola">Fanola</Link> },
      { key: 'oro-therapy', label: <Link to="/?brand=oro-therapy">Oro Therapy</Link> },
      { key: 'kerastase', label: <Link to="/?brand=kerastase">Kerastase</Link> },
      { key: 'olaplex', label: <Link to="/?brand=olaplex">Olaplex</Link> },
    ]},
  ];

  // Add role-specific nav items
  if (currentRole === 'stylist') {
    navItems.push({ key: 'stylist', label: <Link to="/stylist/request">Stylist Portal</Link> });
  }
  if (currentRole === 'distributor') {
    navItems.push({ key: 'distributor', label: <Link to="/distributor">Distributor Portal</Link> });
  }
  if (currentRole === 'admin') {
    navItems.push({ key: 'admin', label: <Link to="/admin">Admin Dashboard</Link> });
  }
  if (currentRole === 'guest' || currentRole === 'user') {
    navItems.push({ key: 'become-stylist', label: <Link to="/stylist/request">Become a Stylist</Link> });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Link to="/" style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}>
            TESSA
          </Link>
          <Menu
            mode="horizontal"
            items={navItems}
            style={{ border: 'none', minWidth: 400 }}
            selectedKeys={[]}
          />
        </div>

        <Space size="middle">
          {currentRole !== 'guest' && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Account
            </Text>
          )}
          
          <Badge count={itemCount} size="small">
            <Button 
              type="text" 
              icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
              onClick={() => setCartDrawerOpen(true)}
            />
          </Badge>

          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <Button type="text">
              <Space>
                <UserOutlined />
                {user?.name || 'Account'}
                <DownOutlined style={{ fontSize: 10 }} />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      </Header>

      <Content style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fafafa' }}>
        <Text type="secondary">
          Tessa Hair Care © {new Date().getFullYear()} | Premium Professional Products
        </Text>
      </Footer>
    </Layout>
  );
}
