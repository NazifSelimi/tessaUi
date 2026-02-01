/**
 * Login Page Component
 * Handles user authentication with email/password
 * 
 * TODO: API Integration
 * - Connect to your authentication endpoint
 * - Implement OAuth providers (Google, Facebook, etc.)
 * - Add rate limiting for security
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  message,
  Card,
  Space,
  Checkbox,
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to home
  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values.email, values.password, values.remember);
      message.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement OAuth login handlers
  const handleGoogleLogin = () => {
    message.info('Google login will be available soon');
    // TODO: Implement Google OAuth
    // window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    message.info('Facebook login will be available soon');
    // TODO: Implement Facebook OAuth
    // window.location.href = `${API_BASE_URL}/auth/facebook`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
      padding: '24px',
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          borderRadius: 12,
        }}
        styles={{ body: { padding: 32 } }}
      >
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/">
            <Title level={2} style={{ margin: 0, color: '#1a1a2e' }}>
              Tessa
            </Title>
          </Link>
          <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
            Sign in to your account
          </Paragraph>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="you@example.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Enter your password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password">
                <Text type="secondary" style={{ fontSize: 13 }}>Forgot password?</Text>
              </Link>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* OAuth Divider */}
        <Divider plain>
          <Text type="secondary" style={{ fontSize: 12 }}>OR CONTINUE WITH</Text>
        </Divider>

        {/* OAuth Buttons */}
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Button
            size="large"
            block
            icon={<GoogleOutlined />}
            onClick={handleGoogleLogin}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Continue with Google
          </Button>
          <Button
            size="large"
            block
            icon={<FacebookOutlined />}
            onClick={handleFacebookLogin}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Continue with Facebook
          </Button>
        </Space>

        {/* Register Link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 500 }}>
              Create account
            </Link>
          </Text>
        </div>

        {/* Demo Credentials (Remove in production) */}
        <div style={{
          marginTop: 24,
          padding: 16,
          background: '#f6ffed',
          borderRadius: 8,
          border: '1px solid #b7eb8f',
        }}>
          <Text strong style={{ fontSize: 12, color: '#52c41a' }}>Demo Credentials</Text>
          <div style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 12, display: 'block' }}>
              <strong>Admin:</strong> admin@tessa.com / admin123
            </Text>
            <Text style={{ fontSize: 12, display: 'block' }}>
              <strong>Stylist:</strong> stylist@tessa.com / stylist123
            </Text>
            <Text style={{ fontSize: 12, display: 'block' }}>
              <strong>Distributor:</strong> dist@tessa.com / dist123
            </Text>
            <Text style={{ fontSize: 12, display: 'block' }}>
              <strong>Customer:</strong> customer@tessa.com / customer123
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
