/**
 * Account Page
 * 
 * User profile management page.
 * Shows user info, allows profile updates, and provides quick links.
 * 
 * TODO: Connect to API for profile updates
 */

import { Link } from 'react-router-dom';
import { Typography, Card, Form, Input, Button, Row, Col, message, Avatar, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, ShoppingOutlined, ScissorOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts';

const { Title, Text } = Typography;

export default function AccountPage() {
  const { user, currentRole, updateProfile, isLoading } = useAuth();
  const [form] = Form.useForm();

  const handleUpdateProfile = async (values: { name: string; email: string; phone: string }) => {
    try {
      // TODO: Replace with actual API call
      await updateProfile(values);
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (values: { currentPassword: string; newPassword: string }) => {
    try {
      // TODO: Implement password change API call
      // await authService.changePassword(values);
      message.success('Password updated successfully!');
    } catch (error) {
      message.error('Failed to update password');
    }
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

              <Button type="primary" htmlType="submit" loading={isLoading}>
                Save Changes
              </Button>
            </Form>
          </Card>

          <Card title="Change Password" style={{ marginTop: 24 }}>
            <Form layout="vertical" onFinish={handleChangePassword}>
              <Form.Item 
                name="currentPassword" 
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password placeholder="Current password" />
              </Form.Item>
              <Form.Item 
                name="newPassword" 
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
              >
                <Input.Password placeholder="New password" />
              </Form.Item>
              <Form.Item 
                name="confirmPassword" 
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>
              <Button type="primary" htmlType="submit">Update Password</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
