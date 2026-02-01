'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Table, Button, Tag, Input, Space, Spin, Card } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useApp } from '@/store/AppContext';
import { getProducts } from '@/api/client';
import type { Product } from '@/types';

const { Title, Text } = Typography;

export default function DistributorProductsPage() {
  const navigate = useNavigate();
  const { currentRole } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (currentRole !== 'distributor' && currentRole !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={4}>Access Denied</Title>
        <Text type="secondary">This page is only available for distributors.</Text>
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  // Flatten products with their sizes for the table
  const tableData = filteredProducts.flatMap(product =>
    product.sizes.map(size => ({
      key: `${product.id}-${size.id}`,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      category: product.category,
      size: size.size,
      retailPrice: size.retailPrice,
      stylistPrice: size.stylistPrice,
      stock: size.stock,
      image: product.images[0],
    }))
  );

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_: unknown, record: typeof tableData[0]) => (
        <Space>
          <img
            src={record.image || "/placeholder.svg"}
            alt={record.productName}
            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
          />
          <div>
            <Text strong>{record.productName}</Text>
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
      render: (cat: string) => (
        <Tag>{cat.replace('-', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Retail Price',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      render: (price: number) => <Text>${price.toFixed(2)}</Text>,
    },
    {
      title: 'Stylist Price',
      dataIndex: 'stylistPrice',
      key: 'stylistPrice',
      render: (price: number) => <Text strong style={{ color: '#16a34a' }}>${price.toFixed(2)}</Text>,
    },
    {
      title: 'Margin',
      key: 'margin',
      render: (_: unknown, record: typeof tableData[0]) => {
        const margin = ((record.retailPrice - record.stylistPrice) / record.retailPrice * 100).toFixed(0);
        return <Text type="success">{margin}%</Text>;
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        stock > 10 ? (
          <Tag color="green">{stock} units</Tag>
        ) : stock > 0 ? (
          <Tag color="orange">{stock} units</Tag>
        ) : (
          <Tag color="red">Out of Stock</Tag>
        )
      ),
    },
  ];

  return (
    <div>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/distributor')}
        style={{ marginBottom: 16 }}
      >
        Back to Portal
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Product Catalog</Title>
          <Text type="secondary">View products with retail and stylist pricing</Text>
        </div>
        <Input
          placeholder="Search products..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
      </div>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{ pageSize: 20 }}
          />
        )}
      </Card>
    </div>
  );
}
