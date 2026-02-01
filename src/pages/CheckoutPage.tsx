'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Form, Input, Button, Card, Steps, Radio, Space, 
  Divider, message, Alert, Row, Col 
} from 'antd';
import { useApp } from '@/store/AppContext';
import { createOrder, validateCoupon } from '@/api/client';
import type { Coupon } from '@/types';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { cart, getCartTotal, getPrice, currentRole, clearCart } = useApp();
  const { subtotal } = getCartTotal();

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const coupon = await validateCoupon(couponCode, currentRole, subtotal);
    if (coupon) {
      setAppliedCoupon(coupon);
      message.success('Coupon applied!');
    } else {
      message.error('Invalid or expired coupon');
    }
  };

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      const order = await createOrder({
        items: cart,
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
        userRole: currentRole,
      });
      
      clearCart();
      message.success('Order placed successfully!');
      navigate(`/account/orders/${order.id}`);
    } catch {
      message.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={4}>Your cart is empty</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2}>Checkout</Title>

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
        <Col xs={24} md={14}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {currentStep === 0 && (
              <Card title="Shipping Information">
                <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                  <Input placeholder="John Doe" />
                </Form.Item>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                  <Input placeholder="+1 234 567 8900" />
                </Form.Item>
                <Form.Item name="address" label="Street Address" rules={[{ required: true }]}>
                  <Input placeholder="123 Main Street" />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="city" label="City" rules={[{ required: true }]}>
                      <Input placeholder="New York" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="state" label="State" rules={[{ required: true }]}>
                      <Input placeholder="NY" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="zipCode" label="ZIP Code" rules={[{ required: true }]}>
                      <Input placeholder="10001" />
                    </Form.Item>
                  </Col>
                </Row>
                <Button type="primary" onClick={() => {
                  form.validateFields(['fullName', 'phone', 'address', 'city', 'state', 'zipCode'])
                    .then(() => setCurrentStep(1))
                    .catch(() => {});
                }}>
                  Continue to Payment
                </Button>
              </Card>
            )}

            {currentStep === 1 && (
              <Card title="Payment Method">
                <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="cod" style={{ padding: '12px 0' }}>
                      <Space direction="vertical" size={0}>
                        <Text strong>Cash on Delivery (COD)</Text>
                        <Text type="secondary">Pay when you receive your order</Text>
                      </Space>
                    </Radio>
                    <Radio value="online" disabled style={{ padding: '12px 0' }}>
                      <Space direction="vertical" size={0}>
                        <Text strong style={{ color: '#999' }}>Online Payment</Text>
                        <Text type="secondary">Coming soon</Text>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>

                <Divider />

                <Form.Item name="customMessage" label="Order Notes (Optional)">
                  <TextArea 
                    placeholder="Special instructions for your order..."
                    rows={3}
                  />
                </Form.Item>

                <Space>
                  <Button onClick={() => setCurrentStep(0)}>Back</Button>
                  <Button type="primary" onClick={() => setCurrentStep(2)}>
                    Review Order
                  </Button>
                </Space>
              </Card>
            )}

            {currentStep === 2 && (
              <Card title="Review Your Order">
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Shipping Address</Text>
                  <div style={{ marginTop: 8, padding: 12, background: '#fafafa', borderRadius: 8 }}>
                    <Text>{form.getFieldValue('fullName')}</Text><br />
                    <Text type="secondary">{form.getFieldValue('phone')}</Text><br />
                    <Text type="secondary">
                      {form.getFieldValue('address')}, {form.getFieldValue('city')}, {form.getFieldValue('state')} {form.getFieldValue('zipCode')}
                    </Text>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong>Payment Method</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</Text>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong>Items ({cart.length})</Text>
                  {cart.map(item => (
                    <div key={`${item.productId}-${item.sizeId}`} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}>
                      <Text>{item.product.name} ({item.size.size}) x {item.quantity}</Text>
                      <Text>${(getPrice(item.size) * item.quantity).toFixed(2)}</Text>
                    </div>
                  ))}
                </div>

                <Alert
                  message="By placing this order, you agree to our Terms of Service and Privacy Policy."
                  type="info"
                  style={{ marginBottom: 16 }}
                />

                <Space>
                  <Button onClick={() => setCurrentStep(1)}>Back</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Place Order (${total.toFixed(2)})
                  </Button>
                </Space>
              </Card>
            )}
          </Form>
        </Col>

        <Col xs={24} md={10}>
          <Card title="Order Summary">
            {cart.map(item => (
              <div key={`${item.productId}-${item.sizeId}`} style={{ 
                display: 'flex', 
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
              }}>
                <img
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                />
                <div style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13 }}>{item.product.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.size.size} x {item.quantity}
                  </Text>
                </div>
                <Text>${(getPrice(item.size) * item.quantity).toFixed(2)}</Text>
              </div>
            ))}

            <Divider />

            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
              <Input 
                placeholder="Coupon code" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button onClick={handleApplyCoupon}>Apply</Button>
            </Space.Compact>

            {appliedCoupon && (
              <Alert
                message={`Coupon "${appliedCoupon.code}" applied: ${appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% off` : `$${appliedCoupon.value} off`}`}
                type="success"
                closable
                onClose={() => setAppliedCoupon(null)}
                style={{ marginBottom: 16 }}
              />
            )}

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
            
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16 }}>Total</Text>
              <Text strong style={{ fontSize: 18 }}>${total.toFixed(2)}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
