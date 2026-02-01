'use client';

import { useState, useEffect } from 'react';
import { Typography, Table, Tag, Select, Input, Space, Card, Button, Modal, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getOrders, updateOrderStatus } from '@/api/client';
import type { Order, OrderStatus } from '@/types';

const { Title, Text } = Typography;

const statusColors: Record<string, string> = {
  pending: 'orange',
  confirmed: 'blue',
  processing: 'cyan',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
};

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
    message.success('Order status updated');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>{id}</Text>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_: unknown, record: Order) => (
        <div>
          <Text>{record.shippingAddress.fullName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.shippingAddress.phone}</Text>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: Order['items']) => `${items.length} item(s)`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => <Text strong>${total.toFixed(2)}</Text>,
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_: unknown, record: Order) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>{record.paymentMethod.toUpperCase()}</Text>
          <Tag color={record.paymentStatus === 'paid' ? 'green' : 'orange'} style={{ marginTop: 2 }}>
            {record.paymentStatus.toUpperCase()}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus, record: Order) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record.id, val)}
          style={{ width: 130 }}
          size="small"
        >
          {statusOptions.filter(o => o.value !== 'all').map(opt => (
            <Select.Option key={opt.value} value={opt.value}>
              <Tag color={statusColors[opt.value]}>{opt.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: Order) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => setSelectedOrder(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Orders</Title>
          <Text type="secondary">{orders.length} total orders</Text>
        </div>
        <Space>
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            style={{ width: 140 }}
          />
        </Space>
      </div>

      <Card>
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Order ${selectedOrder?.id}`}
        open={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        footer={null}
        width={600}
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Customer:</Text> {selectedOrder.shippingAddress.fullName}
              <br />
              <Text strong>Phone:</Text> {selectedOrder.shippingAddress.phone}
              <br />
              <Text strong>Address:</Text> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
            </div>
            
            <Table
              dataSource={selectedOrder.items}
              columns={[
                { title: 'Product', dataIndex: 'productName', key: 'product' },
                { title: 'Size', dataIndex: 'sizeName', key: 'size' },
                { title: 'Qty', dataIndex: 'quantity', key: 'qty' },
                { title: 'Total', dataIndex: 'total', key: 'total', render: (v: number) => `$${v.toFixed(2)}` },
              ]}
              rowKey={(r) => `${r.productId}-${r.sizeId}`}
              pagination={false}
              size="small"
            />
            
            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <Text>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</Text>
              <br />
              {selectedOrder.discount > 0 && <Text type="success">Discount: -${selectedOrder.discount.toFixed(2)}</Text>}
              {selectedOrder.discount > 0 && <br />}
              <Text>Shipping: {selectedOrder.shipping === 0 ? 'Free' : `$${selectedOrder.shipping.toFixed(2)}`}</Text>
              <br />
              <Text strong style={{ fontSize: 16 }}>Total: ${selectedOrder.total.toFixed(2)}</Text>
            </div>

            {selectedOrder.customMessage && (
              <div style={{ marginTop: 16, padding: 12, background: '#fafafa', borderRadius: 8 }}>
                <Text strong>Order Notes:</Text>
                <br />
                <Text>{selectedOrder.customMessage}</Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
