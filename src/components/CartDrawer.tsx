'use client';

import { useNavigate } from 'react-router-dom';
import { Drawer, Button, Typography, Space, InputNumber, Empty, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useApp } from '@/store/AppContext';

const { Text, Title } = Typography;

export default function CartDrawer() {
  const navigate = useNavigate();
  const { 
    cart, 
    cartDrawerOpen, 
    setCartDrawerOpen, 
    updateCartQuantity, 
    removeFromCart,
    getCartTotal,
    getPrice,
  } = useApp();

  const { subtotal, itemCount } = getCartTotal();

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setCartDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <Drawer
      title={`Shopping Cart (${itemCount})`}
      placement="right"
      open={cartDrawerOpen}
      onClose={() => setCartDrawerOpen(false)}
      width={400}
      footer={
        cart.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text strong>Subtotal:</Text>
              <Text strong style={{ fontSize: 18 }}>${subtotal.toFixed(2)}</Text>
            </div>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <Button type="primary" block size="large" onClick={handleCheckout}>
                Checkout
              </Button>
              <Button block onClick={handleViewCart}>
                View Cart
              </Button>
            </Space>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <div>
          {cart.map((item) => {
            const price = getPrice(item.size);
            return (
              <div key={`${item.productId}-${item.sizeId}`} className="cart-item" style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <img
                    src={item.product.images[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block' }}>{item.product.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.product.brand} • {item.size.size}
                    </Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <InputNumber
                        min={1}
                        max={item.size.stock}
                        value={item.quantity}
                        onChange={(val) => updateCartQuantity(item.productId, item.sizeId, val || 1)}
                        size="small"
                        style={{ width: 70 }}
                      />
                      <Space>
                        <Text strong>${(price * item.quantity).toFixed(2)}</Text>
                        <Button 
                          type="text" 
                          danger 
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeFromCart(item.productId, item.sizeId)}
                        />
                      </Space>
                    </div>
                  </div>
                </div>
                <Divider style={{ margin: '12px 0 0 0' }} />
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
}
