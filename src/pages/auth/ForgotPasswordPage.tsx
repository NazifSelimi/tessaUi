'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Form, Input, Button, Card, Result, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { forgotPassword } from '@/api/client';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
    } catch {
      message.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto' }}>
        <Card>
          <Result
            status="success"
            title="Check Your Email"
            subTitle="We've sent password reset instructions to your email address."
            extra={
              <Link to="/login">
                <Button type="primary">Back to Login</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Card>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <ArrowLeftOutlined />
          <Text>Back to login</Text>
        </Link>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Reset Password</Title>
          <Text type="secondary">
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
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

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Send Reset Link
          </Button>
        </Form>
      </Card>
    </div>
  );
}
