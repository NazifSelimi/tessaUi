/**
 * Cart Drawer Component
 * 
 * Slide-out cart panel that shows:
 * - Cart items with images
 * - Quantity controls
 * - Subtotal
 * - Checkout/View Cart buttons
 */

import { useNavigate } from 'react-router-dom';
import { Drawer, Button, Typography, Space, InputNumber, Empty, Divider, Badge } from 'antd';
import { DeleteOutlined, ShoppingOutlined, CloseOutlined } from '@ant-design/icons';
import { useCart } from '@/contexts';

const { Text, Title } = Typography;

export default function CartDrawer() {
  const navigate = useNavigate();
  const { 
    items, 
    isDrawerOpen, 
    closeDrawer, 
    updateQuantity, 
    removeItem,
    itemCount,
    subtotal,
    getItemPrice,
    getItemTotal,
  } = useCart();

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <Drawer
      title={
        <Space>
          <ShoppingOutlined />
          <span>Shopping Cart</span>
          <Badge 
            count={itemCount} 
            style={{ 
              backgroundColor: '#1a1a1a',
              marginLeft: 8,
            }} 
          />
        </Space>
      }
      placement="right"
      open={isDrawerOpen}
      onClose={closeDrawer}
      width={400}
      closeIcon={<CloseOutlined />}
      styles={{
        body: { padding: 0, display: 'flex', flexDirection: 'column' },
        footer: { borderTop: '1px solid #f0f0f0' },
      }}
      footer={
        items.length > 0 ? (
          <div style={{ padding: '16px 0' }}>
            {/* Subtotal */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: 16,
              padding: '0 24px',
            }}>
              <Text style={{ fontSize: 16 }}>Subtotal</Text>
              <Text strong style={{ fontSize: 20 }}>
                ${subtotal.toFixed(2)}
              </Text>
            </div>
            
            <Text 
              type="secondary" 
              style={{ 
                display: 'block', 
                fontSize: 12, 
                textAlign: 'center',
                marginBottom: 16,
                padding: '0 24px',
              }}
            >
              Shipping calculated at checkout
            </Text>
            
            {/* Action Buttons */}
            <Space direction="vertical" style={{ width: '100%', padding: '0 24px' }} size="small">
              <Button 
                type="primary" 
                block 
                size="large" 
                onClick={handleCheckout}
                style={{ height: 48 }}
              >
                Checkout
              </Button>
              <Button 
                block 
                onClick={handleViewCart}
              >
                View Cart
              </Button>
            </Space>
          </div>
        ) : null
      }
    >
      {items.length === 0 ? (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 48,
        }}>
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" size={12}>
                <Text type="secondary">Your cart is empty</Text>
                <Button type="primary" onClick={() => { closeDrawer(); navigate('/'); }}>
                  Start Shopping
                </Button>
              </Space>
            }
          />
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px' }}>
          {items.map((item, index) => {
            const price = getItemPrice(item);
            const total = getItemTotal(item);
            
            return (
              <div key={`${item.productId}-${item.sizeId}`}>
                <div style={{ 
                  padding: '16px 0',
                  display: 'flex', 
                  gap: 16,
                }}>
                  {/* Product Image */}
                  <img
                    src={item.product.images[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    style={{ 
                      width: 80, 
                      height: 80, 
                      objectFit: 'cover', 
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  />
                  
                  {/* Product Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text 
                      strong 
                      style={{ 
                        display: 'block',
                        marginBottom: 4,
                        lineHeight: 1.3,
                      }}
                      ellipsis
                    >
                      {item.product.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.product.brand} &bull; {item.size.size}
                    </Text>
                    
                    {/* Price & Quantity Row */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginTop: 12,
                    }}>
                      <InputNumber
                        min={1}
                        max={item.size.stock}
                        value={item.quantity}
                        onChange={(val) => updateQuantity(item.productId, item.sizeId, val || 1)}
                        size="small"
                        style={{ width: 70 }}
                      />
                      <Space size="middle">
                        <Text strong>${total.toFixed(2)}</Text>
                        <Button 
                          type="text" 
                          danger 
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeItem(item.productId, item.sizeId)}
                          style={{ padding: 4 }}
                        />
                      </Space>
                    </div>
                    
                    {/* Unit Price */}
                    <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                      ${price.toFixed(2)} each
                    </Text>
                  </div>
                </div>
                
                {index < items.length - 1 && <Divider style={{ margin: 0 }} />}
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
}
