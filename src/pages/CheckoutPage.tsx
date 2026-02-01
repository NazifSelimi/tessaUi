/**
 * Checkout Page
 * 
 * Multi-step checkout process:
 * 1. Shipping information
 * 2. Payment method selection
 * 3. Order review and confirmation
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Typography, Form, Input, Button, Card, Steps, Radio, Space, 
  Divider, message, Alert, Row, Col, Result,
} from 'antd';
import { 
  ArrowLeftOutlined, CheckCircleOutlined, CreditCardOutlined,
  WalletOutlined, LockOutlined,
} from '@ant-design/icons';
import { useCart, useAuth } from '@/contexts';
import { createOrder, validateCoupon } from '@/api/services';
import type { Coupon } from '@/types';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { items, subtotal, clearCart, getItemPrice } = useCart();
  const { currentRole } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Calculate totals
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const total = subtotal + shipping - discount;

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    const coupon = await validateCoupon(couponCode, currentRole, subtotal);
    if (coupon) {
      setAppliedCoupon(coupon);
      message.success(`Coupon applied: ${coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`} off`);
    } else {
      message.error('Invalid or expired coupon code');
    }
  };

  // Submit order
  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      const order = await createOrder({
        items,
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
        },
        paymentMethod,
        customMessage: values.customMessage,
        couponCode: appliedCoupon?.code,
      }, currentRole);
      
      clearCart();
      setOrderId(order.id);
      setOrderComplete(true);
      message.success('Order placed successfully!');
    } catch (error) {
      message.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Validate step before proceeding
  const validateStep = async (step: number) => {
    if (step === 0) {
      try {
        await form.validateFields(['fullName', 'phone', 'address', 'city', 'state', 'zipCode']);
        setCurrentStep(1);
      } catch {
        // Validation failed
      }
    } else if (step === 1) {
      setCurrentStep(2);
    }
  };

  // Empty cart state
  if (items.length === 0 && !orderComplete) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={4}>Your cart is empty</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Add some products to checkout
        </Text>
        <Button type="primary" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  // Order complete state
  if (orderComplete) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto' }}>
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#10b981' }} />}
          title="Order Placed Successfully!"
          subTitle={
            <Space direction="vertical" size={4}>
              <Text>Order ID: <Text strong>{orderId}</Text></Text>
              <Text type="secondary">
                We'll send you an email confirmation shortly.
              </Text>
            </Space>
          }
          extra={[
            <Button type="primary" key="orders" onClick={() => navigate('/account/orders')}>
              View My Orders
            </Button>,
            <Button key="shop" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/cart')}
        style={{ marginBottom: 16 }}
      >
        Back to Cart
      </Button>

      <Title level={2}>Checkout</Title>

      {/* Progress Steps */}
      <Steps
        current={currentStep}
        items={[
          { title: 'Shipping' },
          { title: 'Payment' },
          { title: 'Review' },
        ]}
        style={{ marginBottom: 32 }}
      />

      <Row gutter={24}>
        {/* Main Content */}
        <Col xs={24} md={14}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Step 1: Shipping */}
            {currentStep === 0 && (
              <Card title="Shipping Information">
                <Form.Item 
                  name="fullName" 
                  label="Full Name" 
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input placeholder="John Doe" size="large" />
                </Form.Item>
                
                <Form.Item 
                  name="phone" 
                  label="Phone Number" 
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input placeholder="+1 234 567 8900" size="large" />
                </Form.Item>
                
                <Form.Item 
                  name="address" 
                  label="Street Address" 
                  rules={[{ required: true, message: 'Please enter your address' }]}
                >
                  <Input placeholder="123 Main Street, Apt 4B" size="large" />
                </Form.Item>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      name="city" 
                      label="City" 
                      rules={[{ required: true, message: 'Please enter city' }]}
                    >
                      <Input placeholder="New York" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      name="state" 
                      label="State" 
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="NY" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      name="zipCode" 
                      label="ZIP Code" 
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="10001" size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Button type="primary" size="large" onClick={() => validateStep(0)}>
                  Continue to Payment
                </Button>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <Card title="Payment Method">
                <Radio.Group 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio 
                      value="cod" 
                      style={{ 
                        padding: 16, 
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        width: '100%',
                        marginRight: 0,
                      }}
                    >
                      <Space>
                        <WalletOutlined style={{ fontSize: 20 }} />
                        <div>
                          <Text strong>Cash on Delivery (COD)</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Pay when you receive your order
                          </Text>
                        </div>
                      </Space>
                    </Radio>
                    
                    <Radio 
                      value="online" 
                      disabled
                      style={{ 
                        padding: 16, 
                        border: '1px solid #e5e7eb',
                        borderRadius: 8,
                        width: '100%',
                        marginRight: 0,
                        opacity: 0.6,
                      }}
                    >
                      <Space>
                        <CreditCardOutlined style={{ fontSize: 20 }} />
                        <div>
                          <Text strong style={{ color: '#9ca3af' }}>Online Payment</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Coming soon - Credit card, PayPal, etc.
                          </Text>
                        </div>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>

                <Divider />

                <Form.Item name="customMessage" label="Order Notes (Optional)">
                  <TextArea 
                    placeholder="Special instructions for delivery..."
                    rows={3}
                  />
                </Form.Item>

                <Space>
                  <Button onClick={() => setCurrentStep(0)}>Back</Button>
                  <Button type="primary" size="large" onClick={() => validateStep(1)}>
                    Review Order
                  </Button>
                </Space>
              </Card>
            )}

            {/* Step 3: Review */}
            {currentStep === 2 && (
              <Card title="Review Your Order">
                {/* Shipping Summary */}
                <div style={{ marginBottom: 24 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Shipping Address
                  </Text>
                  <div style={{ 
                    padding: 16, 
                    background: '#f9fafb', 
                    borderRadius: 8,
                  }}>
                    <Text>{form.getFieldValue('fullName')}</Text><br />
                    <Text type="secondary">{form.getFieldValue('phone')}</Text><br />
                    <Text type="secondary">
                      {form.getFieldValue('address')}, {form.getFieldValue('city')}, {form.getFieldValue('state')} {form.getFieldValue('zipCode')}
                    </Text>
                  </div>
                </div>

                {/* Payment Summary */}
                <div style={{ marginBottom: 24 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Payment Method
                  </Text>
                  <Text>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</Text>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: 24 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Items ({items.length})
                  </Text>
                  {items.map(item => (
                    <div 
                      key={`${item.productId}-${item.sizeId}`} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <Text>
                        {item.product.name} ({item.size.size}) x {item.quantity}
                      </Text>
                      <Text strong>
                        ${(getItemPrice(item) * item.quantity).toFixed(2)}
                      </Text>
                    </div>
                  ))}
                </div>

                <Alert
                  message={
                    <Space>
                      <LockOutlined />
                      <span>Your payment information is secure</span>
                    </Space>
                  }
                  type="info"
                  style={{ marginBottom: 16 }}
                />

                <Space>
                  <Button onClick={() => setCurrentStep(1)}>Back</Button>
                  <Button 
                    type="primary" 
                    size="large"
                    htmlType="submit" 
                    loading={loading}
                  >
                    Place Order (${total.toFixed(2)})
                  </Button>
                </Space>
              </Card>
            )}
          </Form>
        </Col>

        {/* Order Summary Sidebar */}
        <Col xs={24} md={10}>
          <Card title="Order Summary" style={{ position: 'sticky', top: 88 }}>
            {/* Items */}
            {items.map(item => (
              <div 
                key={`${item.productId}-${item.sizeId}`} 
                style={{ 
                  display: 'flex', 
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <img
                  src={item.product.images[0] || '/placeholder.svg'}
                  alt={item.product.name}
                  style={{ 
                    width: 56, 
                    height: 56, 
                    objectFit: 'cover', 
                    borderRadius: 8,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13 }}>{item.product.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.size.size} x {item.quantity}
                  </Text>
                </div>
                <Text strong>${(getItemPrice(item) * item.quantity).toFixed(2)}</Text>
              </div>
            ))}

            <Divider />

            {/* Coupon */}
            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
              <Input 
                placeholder="Coupon code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!appliedCoupon}
              />
              <Button 
                onClick={handleApplyCoupon}
                disabled={!!appliedCoupon}
              >
                Apply
              </Button>
            </Space.Compact>

            {appliedCoupon && (
              <Alert
                message={`"${appliedCoupon.code}" applied`}
                description={`${appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} off`}
                type="success"
                closable
                onClose={() => setAppliedCoupon(null)}
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Subtotal</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </div>
            
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="success">Discount</Text>
                <Text type="success">-${discount.toFixed(2)}</Text>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Shipping</Text>
              <Text>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Text>
            </div>
            
            {shipping > 0 && (
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                Free shipping on orders over $50
              </Text>
            )}
            
            <Divider style={{ margin: '12px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16 }}>Total</Text>
              <Text strong style={{ fontSize: 20 }}>${total.toFixed(2)}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
