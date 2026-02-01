'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Form, Input, Button, Card, Divider, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useApp } from '@/store/AppContext';
import { login } from '@/api/client';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(values.email, values.password);
      if (user) {
        setUser(user);
        message.success(`Welcome back, ${user.name}!`);
        navigate('/');
      } else {
        message.error('Invalid email or password');
      }
    } catch {
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Welcome Back</Title>
          <Text type="secondary">Sign in to your Tessa account</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Sign In
          </Button>
        </Form>

        <Divider>
          <Text type="secondary">Demo Accounts</Text>
        </Divider>

        <div style={{ background: '#fafafa', padding: 12, borderRadius: 8, fontSize: 12 }}>
          <Text type="secondary">
            <strong>Admin:</strong> admin@tessa.com<br />
            <strong>Distributor:</strong> distributor@tessa.com<br />
            <strong>Stylist:</strong> stylist@salon.com<br />
            <strong>User:</strong> user@email.com<br />
            <em>Any password works for demo</em>
          </Text>
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Don't have an account? </Text>
          <Link to="/register">Create one</Link>
        </div>
      </Card>
    </div>
  );
}
