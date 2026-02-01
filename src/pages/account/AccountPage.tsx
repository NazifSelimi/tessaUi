import { Link } from 'react-router-dom';
import { Typography, Card, Form, Input, Button, Row, Col, message, Avatar, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, ShoppingOutlined, ScissorOutlined } from '@ant-design/icons';
import { useApp } from '@/store/AppContext';

const { Title, Text } = Typography;

export default function AccountPage() {
  const { user, currentRole } = useApp();
  const [form] = Form.useForm();

  const handleUpdateProfile = (values: Record<string, string>) => {
    console.log('Update profile:', values);
    message.success('Profile updated successfully!');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>My Account</Title>
      <Text type="secondary">
        Manage your account settings and preferences
      </Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
              <Title level={4} style={{ margin: 0 }}>{user?.name || 'Guest User'}</Title>
              <Text type="secondary">{currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Account</Text>
            </div>

            <Divider />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/account/orders">
                <Button icon={<ShoppingOutlined />} block>
                  My Orders
                </Button>
              </Link>
              {(currentRole === 'user' || currentRole === 'guest') && (
                <Link to="/stylist/request">
                  <Button icon={<ScissorOutlined />} block>
                    Become a Stylist
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Profile Information">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
              }}
              onFinish={handleUpdateProfile}
            >
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} placeholder="Your name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }, { type: 'email' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="your@email.com" />
              </Form.Item>

              <Form.Item name="phone" label="Phone Number">
                <Input prefix={<PhoneOutlined />} placeholder="+1 234 567 8900" />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Form>
          </Card>

          <Card title="Change Password" style={{ marginTop: 24 }}>
            <Form layout="vertical">
              <Form.Item name="currentPassword" label="Current Password">
                <Input.Password placeholder="Current password" />
              </Form.Item>
              <Form.Item name="newPassword" label="New Password">
                <Input.Password placeholder="New password" />
              </Form.Item>
              <Form.Item name="confirmPassword" label="Confirm New Password">
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>
              <Button type="primary">Update Password</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
