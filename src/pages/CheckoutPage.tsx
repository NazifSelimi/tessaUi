/**
 * Checkout Page
 * 
 * Multi-step checkout process:
 * 1. Shipping information
 * 2. Payment details
 * 3. Order review
 * 
 * Includes discount code application with role-based validation.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row, Col, Typography, Steps, Form, Input, Button, Card,
  Divider, Space, Image, message, Alert, Tag, Result,
} from 'antd';
import {
  ShoppingOutlined, CreditCardOutlined, CheckCircleOutlined,
  TagOutlined, DeleteOutlined, LoadingOutlined,
} from '@ant-design/icons';
import { useCart, useAuth, useDiscounts } from '@/contexts';

const { Title, Text, Paragraph } = Typography;

interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface PaymentFormData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, getItemPrice, getItemTotal } = useCart();
  const { isProfessional, currentRole } = useAuth();
  const { appliedCode, applyCode, removeCode, discountAmount, discountPercent, error: discountError, clearError } = useDiscounts();

  const [currentStep, setCurrentStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [discountInput, setDiscountInput] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingForm] = Form.useForm();
  const [paymentForm] = Form.useForm();

  // Shipping cost calculation
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const taxRate = 0.08;
  const tax = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + shippingCost + tax;

  // Empty cart check
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="empty-state">
        <Title level={4}>Your cart is empty</Title>
        <Text type="secondary" className="empty-state__description">
          Add some products before checking out.
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
      <Result
        status="success"
        title="Order Placed Successfully!"
        subTitle="Thank you for your order. You will receive a confirmation email shortly."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>,
          <Button key="orders" onClick={() => navigate('/profile')}>
            View Orders
          </Button>,
        ]}
      />
    );
  }

  // Handle shipping form submit
  const handleShippingSubmit = (values: ShippingFormData) => {
    setShippingData(values);
    setCurrentStep(1);
  };

  // Handle payment form submit
  const handlePaymentSubmit = (values: PaymentFormData) => {
    setPaymentData(values);
    setCurrentStep(2);
  };

  // Handle discount code application
  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    
    setApplyingDiscount(true);
    clearError();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = applyCode(discountInput.trim(), subtotal);
    
    if (success) {
      message.success('Discount code applied!');
      setDiscountInput('');
    }
    
    setApplyingDiscount(false);
  };

  // Place order
  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    clearCart();
    setOrderComplete(true);
    setPlacingOrder(false);
  };

  // Step items
  const steps = [
    { title: 'Shipping', icon: <ShoppingOutlined /> },
    { title: 'Payment', icon: <CreditCardOutlined /> },
    { title: 'Review', icon: <CheckCircleOutlined /> },
  ];

  return (
    <div className="checkout-page">
      <Title level={2} style={{ marginBottom: 'var(--spacing-xl)' }}>Checkout</Title>

      <Steps 
        current={currentStep} 
        items={steps}
        style={{ marginBottom: 'var(--spacing-2xl)' }}
        size="small"
        responsive={false}
      />

      <Row gutter={[32, 24]}>
        {/* Form Section */}
        <Col xs={24} lg={14}>
          {/* Step 1: Shipping */}
          {currentStep === 0 && (
            <Card title="Shipping Information" className="checkout-card">
              <Form
                form={shippingForm}
                layout="vertical"
                onFinish={handleShippingSubmit}
                initialValues={shippingData || undefined}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Required' },
                        { type: 'email', message: 'Invalid email' },
                      ]}
                    >
                      <Input size="large" type="email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input size="large" type="tel" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="address"
                  label="Street Address"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input size="large" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item
                      name="state"
                      label="State"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item
                      name="zip"
                      label="ZIP Code"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginBottom: 0, marginTop: 'var(--spacing-lg)' }}>
                  <Button type="primary" htmlType="submit" size="large" block>
                    Continue to Payment
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Step 2: Payment */}
          {currentStep === 1 && (
            <Card title="Payment Details" className="checkout-card">
              <Alert
                message="Demo Mode"
                description="This is a demo. No real payment will be processed."
                type="info"
                showIcon
                style={{ marginBottom: 'var(--spacing-xl)' }}
              />

              <Form
                form={paymentForm}
                layout="vertical"
                onFinish={handlePaymentSubmit}
                initialValues={paymentData || undefined}
              >
                <Form.Item
                  name="cardNumber"
                  label="Card Number"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input 
                    size="large" 
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Item
                      name="expiry"
                      label="Expiry"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input size="large" placeholder="MM/YY" maxLength={5} />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      name="cvv"
                      label="CVV"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input size="large" placeholder="123" maxLength={4} type="password" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="nameOnCard"
                  label="Name on Card"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input size="large" />
                </Form.Item>

                <Space style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}>
                  <Button onClick={() => setCurrentStep(0)} size="large">
                    Back
                  </Button>
                  <Button type="primary" htmlType="submit" size="large" style={{ flex: 1 }}>
                    Review Order
                  </Button>
                </Space>
              </Form>
            </Card>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <Card title="Order Review" className="checkout-card">
              {/* Shipping Address */}
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <Text strong style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                  Shipping Address
                </Text>
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  {shippingData?.firstName} {shippingData?.lastName}<br />
                  {shippingData?.address}<br />
                  {shippingData?.city}, {shippingData?.state} {shippingData?.zip}<br />
                  {shippingData?.email} • {shippingData?.phone}
                </Paragraph>
              </div>

              <Divider />

              {/* Payment Method */}
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <Text strong style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                  Payment Method
                </Text>
                <Text type="secondary">
                  Card ending in {paymentData?.cardNumber.slice(-4)}
                </Text>
              </div>

              <Divider />

              {/* Items */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 'var(--spacing-md)' }}>
                  Items ({items.length})
                </Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {items.map(item => (
                    <div 
                      key={`${item.productId}-${item.sizeId}`}
                      className="checkout-item"
                    >
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={60}
                        height={60}
                        style={{ 
                          objectFit: 'cover', 
                          borderRadius: 'var(--radius-md)',
                          flexShrink: 0,
                        }}
                        preview={false}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong ellipsis style={{ display: 'block' }}>{item.product.name}</Text>
                        <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                          {item.size.size} × {item.quantity}
                        </Text>
                      </div>
                      <Text strong>${getItemTotal(item).toFixed(2)}</Text>
                    </div>
                  ))}
                </Space>
              </div>

              <Divider />

              <Space style={{ width: '100%', marginTop: 'var(--spacing-lg)' }}>
                <Button onClick={() => setCurrentStep(1)} size="large">
                  Back
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handlePlaceOrder}
                  loading={placingOrder}
                  style={{ flex: 1 }}
                >
                  {placingOrder ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
                </Button>
              </Space>
            </Card>
          )}
        </Col>

        {/* Order Summary Sidebar */}
        <Col xs={24} lg={10}>
          <Card className="order-summary">
            <Title level={5} style={{ marginBottom: 'var(--spacing-lg)' }}>Order Summary</Title>

            {/* Items Preview */}
            <div className="order-summary__items">
              {items.slice(0, 3).map(item => (
                <div 
                  key={`${item.productId}-${item.sizeId}`}
                  className="order-summary__item"
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={48}
                    height={48}
                    style={{ 
                      objectFit: 'cover', 
                      borderRadius: 'var(--radius-sm)',
                      flexShrink: 0,
                    }}
                    preview={false}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text ellipsis style={{ fontSize: 'var(--font-size-sm)' }}>{item.product.name}</Text>
                    <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)', display: 'block' }}>
                      {item.size.size} × {item.quantity}
                    </Text>
                  </div>
                  <Text style={{ fontSize: 'var(--font-size-sm)' }}>${getItemTotal(item).toFixed(2)}</Text>
                </div>
              ))}
              {items.length > 3 && (
                <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)' }}>
                  +{items.length - 3} more items
                </Text>
              )}
            </div>

            <Divider />

            {/* Discount Code */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <Text strong style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                Discount Code
              </Text>
              
              {appliedCode ? (
                <div className="applied-discount">
                  <Space>
                    <TagOutlined style={{ color: 'var(--color-success)' }} />
                    <Text strong style={{ color: 'var(--color-success)' }}>
                      {appliedCode.code}
                    </Text>
                    <Tag color="green">-{appliedCode.discount}%</Tag>
                  </Space>
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={removeCode}
                    aria-label="Remove discount code"
                  />
                </div>
              ) : (
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    placeholder="Enter code"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                    onPressEnter={handleApplyDiscount}
                    prefix={<TagOutlined style={{ color: 'var(--color-text-muted)' }} />}
                  />
                  <Button 
                    onClick={handleApplyDiscount}
                    loading={applyingDiscount}
                  >
                    Apply
                  </Button>
                </Space.Compact>
              )}

              {discountError && (
                <Text type="danger" style={{ fontSize: 'var(--font-size-xs)', display: 'block', marginTop: 'var(--spacing-sm)' }}>
                  {discountError}
                </Text>
              )}

              {/* Role hint */}
              {!appliedCode && isProfessional && (
                <Text type="secondary" style={{ fontSize: 'var(--font-size-xs)', display: 'block', marginTop: 'var(--spacing-sm)' }}>
                  You may have access to professional discount codes.
                </Text>
              )}
            </div>

            <Divider />

            {/* Price Breakdown */}
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="price-row">
                <Text type="secondary">Subtotal</Text>
                <Text>${subtotal.toFixed(2)}</Text>
              </div>
              
              {discountAmount > 0 && (
                <div className="price-row">
                  <Text type="secondary">Discount ({discountPercent}%)</Text>
                  <Text style={{ color: 'var(--color-success)' }}>-${discountAmount.toFixed(2)}</Text>
                </div>
              )}
              
              <div className="price-row">
                <Text type="secondary">Shipping</Text>
                <Text>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</Text>
              </div>
              
              <div className="price-row">
                <Text type="secondary">Tax</Text>
                <Text>${tax.toFixed(2)}</Text>
              </div>
            </Space>

            <Divider />

            <div className="price-row" style={{ fontSize: 'var(--font-size-lg)' }}>
              <Text strong>Total</Text>
              <Text strong style={{ fontSize: 'var(--font-size-xl)' }}>${total.toFixed(2)}</Text>
            </div>

            {/* Free Shipping Progress */}
            {shippingCost > 0 && (
              <Alert
                message={`Add $${(50 - subtotal + discountAmount).toFixed(2)} more for free shipping`}
                type="info"
                showIcon
                style={{ marginTop: 'var(--spacing-lg)' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
