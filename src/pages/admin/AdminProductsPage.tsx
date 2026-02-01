'use client';

import { useState, useEffect } from 'react';
import { Typography, Table, Button, Tag, Input, Space, Card, Modal, Form, InputNumber, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { getProducts } from '@/api/client';
import type { Product } from '@/types';

const { Title, Text } = Typography;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    Modal.confirm({
      title: 'Delete Product',
      content: 'Are you sure you want to delete this product?',
      onOk: () => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        message.success('Product deleted');
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingProduct) {
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id ? { ...p, ...values } : p
        ));
        message.success('Product updated');
      } else {
        const newProduct: Product = {
          ...values,
          id: String(Date.now()),
          slug: values.name.toLowerCase().replace(/\s+/g, '-'),
          sizes: [],
          images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500&h=500&fit=crop'],
          inStock: true,
          featured: false,
        };
        setProducts(prev => [newProduct, ...prev]);
        message.success('Product created');
      }
      setModalOpen(false);
      setEditingProduct(null);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_: unknown, record: Product) => (
        <Space>
          <img
            src={record.images[0] || "/placeholder.svg"}
            alt={record.name}
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
          />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary">{record.brand}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag>{cat.replace('-', ' ').toUpperCase()}</Tag>,
    },
    {
      title: 'Sizes',
      key: 'sizes',
      render: (_: unknown, record: Product) => `${record.sizes.length} variant(s)`,
    },
    {
      title: 'Retail Price',
      key: 'retailPrice',
      render: (_: unknown, record: Product) => {
        const prices = record.sizes.map(s => s.retailPrice);
        if (prices.length === 0) return '-';
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
      },
    },
    {
      title: 'Stylist Price',
      key: 'stylistPrice',
      render: (_: unknown, record: Product) => {
        const prices = record.sizes.map(s => s.stylistPrice);
        if (prices.length === 0) return '-';
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return (
          <Text style={{ color: '#16a34a' }}>
            {min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} - $${max.toFixed(2)}`}
          </Text>
        );
      },
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (_: unknown, record: Product) => {
        const total = record.sizes.reduce((sum, s) => sum + s.stock, 0);
        return total > 10 ? (
          <Tag color="green">{total}</Tag>
        ) : total > 0 ? (
          <Tag color="orange">{total}</Tag>
        ) : (
          <Tag color="red">0</Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Products</Title>
          <Text type="secondary">{products.length} products in catalog</Text>
        </div>
        <Space>
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            Add Product
          </Button>
        </Space>
      </div>

      <Card>
        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => {
          setModalOpen(false);
          setEditingProduct(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="Product name" />
          </Form.Item>
          <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
            <Select placeholder="Select brand">
              <Select.Option value="Fanola">Fanola</Select.Option>
              <Select.Option value="Oro Therapy">Oro Therapy</Select.Option>
              <Select.Option value="Kerastase">Kerastase</Select.Option>
              <Select.Option value="Olaplex">Olaplex</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Select.Option value="shampoo">Shampoo</Select.Option>
              <Select.Option value="conditioner">Conditioner</Select.Option>
              <Select.Option value="hair-masks">Hair Masks</Select.Option>
              <Select.Option value="treatments">Treatments</Select.Option>
              <Select.Option value="styling">Styling</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Product description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
