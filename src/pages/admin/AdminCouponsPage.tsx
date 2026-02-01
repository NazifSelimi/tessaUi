'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, Table, Tag, Input, Space, Card, Button, Modal, Form, 
  InputNumber, Select, DatePicker, message 
} from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCoupons, createCoupon } from '@/api/client';
import type { Coupon, UserRole } from '@/types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const statusColors = {
  active: 'green',
  inactive: 'default',
  expired: 'red',
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    async function loadCoupons() {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data);
      setLoading(false);
    }
    loadCoupons();
  }, []);

  const filteredCoupons = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const newCoupon = await createCoupon({
        code: values.code.toUpperCase(),
        type: values.type,
        value: values.value,
        minPurchase: values.minPurchase || 0,
        usageLimit: values.usageLimit || 100,
        audience: values.audience,
        validFrom: values.validFrom.format('YYYY-MM-DD'),
        validUntil: values.validUntil.format('YYYY-MM-DD'),
      });
      setCoupons(prev => [newCoupon, ...prev]);
      message.success('Coupon created successfully');
      setModalOpen(false);
      form.resetFields();
    } catch {
      // Validation failed
    }
  };

  const handleDelete = (couponId: string) => {
    Modal.confirm({
      title: 'Delete Coupon',
      content: 'Are you sure you want to delete this coupon?',
      onOk: () => {
        setCoupons(prev => prev.filter(c => c.id !== couponId));
        message.success('Coupon deleted');
      },
    });
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Text strong copyable>{code}</Text>,
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (_: unknown, record: Coupon) => (
        <Text>
          {record.type === 'percentage' ? `${record.value}%` : `$${record.value}`} off
        </Text>
      ),
    },
    {
      title: 'Min. Purchase',
      dataIndex: 'minPurchase',
      key: 'minPurchase',
      render: (val: number) => val > 0 ? `$${val}` : '-',
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_: unknown, record: Coupon) => (
        <Text>{record.usedCount} / {record.usageLimit}</Text>
      ),
    },
    {
      title: 'Audience',
      dataIndex: 'audience',
      key: 'audience',
      render: (audience: UserRole[]) => (
        <Space size={2} wrap>
          {audience.map(role => (
            <Tag key={role} style={{ fontSize: 11 }}>{role}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Coupon['status']) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (_: unknown, record: Coupon) => (
        <Space>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Coupons</Title>
          <Text type="secondary">{coupons.length} coupons</Text>
        </div>
        <Space>
          <Input
            placeholder="Search codes..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 180 }}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Create Coupon
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          dataSource={filteredCoupons}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Create Coupon"
        open={modalOpen}
        onOk={handleCreate}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Coupon Code" rules={[{ required: true }]}>
            <Input placeholder="e.g., SUMMER20" style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          
          <Space size="middle" style={{ display: 'flex' }}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="Select type">
                <Select.Option value="percentage">Percentage</Select.Option>
                <Select.Option value="fixed">Fixed Amount</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="value" label="Value" rules={[{ required: true }]} style={{ flex: 1 }}>
              <InputNumber min={1} style={{ width: '100%' }} placeholder="10" />
            </Form.Item>
          </Space>
          
          <Space size="middle" style={{ display: 'flex' }}>
            <Form.Item name="minPurchase" label="Min. Purchase ($)" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="50" />
            </Form.Item>
            
            <Form.Item name="usageLimit" label="Usage Limit" style={{ flex: 1 }}>
              <InputNumber min={1} style={{ width: '100%' }} placeholder="100" />
            </Form.Item>
          </Space>
          
          <Form.Item name="audience" label="Audience" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select roles">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="stylist">Stylist</Select.Option>
              <Select.Option value="distributor">Distributor</Select.Option>
            </Select>
          </Form.Item>
          
          <Space size="middle" style={{ display: 'flex' }}>
            <Form.Item name="validFrom" label="Valid From" rules={[{ required: true }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="validUntil" label="Valid Until" rules={[{ required: true }]} style={{ flex: 1 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
