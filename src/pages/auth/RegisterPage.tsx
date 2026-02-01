'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Form, Input, Button, Card, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useApp } from '@/store/AppContext';
import { register } from '@/api/client';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { 
    name: string; 
    email: string; 
    phone: string; 
    password: string 
  }) => {
    setLoading(true);
    try {
      const user = await register(values);
      setUser(user);
      message.success('Account created successfully!');
      navigate('/');
    } catch {
      message.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Create Account</Title>
          <Text type="secondary">Join Tessa for exclusive offers and professional pricing</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Full name"
              size="large"
            />
          </Form.Item>

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
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Phone number"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm password"
              size="large"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Create Account
          </Button>
        </Form>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Already have an account? </Text>
          <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}
