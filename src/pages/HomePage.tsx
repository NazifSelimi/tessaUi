'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Row, Col, Input, Select, Slider, Checkbox, Card, Typography, 
  Space, Button, Spin, Empty, Collapse 
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories, getBrands } from '@/api/client';
import type { Product, Category, Brand } from '@/types';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [productsData, categoriesData, brandsData] = await Promise.all([
        getProducts({ 
          category: category || undefined, 
          brand: brand || undefined,
          search: search || undefined,
          inStock: inStockOnly || undefined,
        }),
        getCategories(),
        getBrands(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
      setLoading(false);
    }
    loadData();
  }, [category, brand, search, inStockOnly]);

  // Apply sorting
  const sortedProducts = [...products].sort((a, b) => {
    const aPrice = Math.min(...a.sizes.map(s => s.retailPrice));
    const bPrice = Math.min(...b.sizes.map(s => s.retailPrice));
    
    switch (sortBy) {
      case 'price-asc': return aPrice - bPrice;
      case 'price-desc': return bPrice - aPrice;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      default: return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  // Apply price filter
  const filteredProducts = sortedProducts.filter(p => {
    const minPrice = Math.min(...p.sizes.map(s => s.retailPrice));
    return minPrice >= priceRange[0] && minPrice <= priceRange[1];
  });

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat) {
      searchParams.set('category', cat);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleBrandChange = (br: string) => {
    setBrand(br);
    if (br) {
      searchParams.set('brand', br);
    } else {
      searchParams.delete('brand');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setBrand('');
    setPriceRange([0, 100]);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Shop All Products</Title>
        <Text type="secondary">Premium hair care products for professionals and enthusiasts</Text>
      </div>

      <Row gutter={24}>
        {/* Filters Sidebar */}
        <Col xs={24} md={6}>
          <Card size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />

              <Collapse 
                defaultActiveKey={['category', 'brand', 'price']} 
                ghost
                expandIconPosition="end"
              >
                <Panel header={<Text strong>Category</Text>} key="category">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      type={!category ? 'primary' : 'text'} 
                      size="small" 
                      block 
                      style={{ textAlign: 'left' }}
                      onClick={() => handleCategoryChange('')}
                    >
                      All Categories
                    </Button>
                    {categories.map(cat => (
                      <Button
                        key={cat.id}
                        type={category === cat.slug ? 'primary' : 'text'}
                        size="small"
                        block
                        style={{ textAlign: 'left' }}
                        onClick={() => handleCategoryChange(cat.slug)}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </Space>
                </Panel>

                <Panel header={<Text strong>Brand</Text>} key="brand">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      type={!brand ? 'primary' : 'text'} 
                      size="small" 
                      block 
                      style={{ textAlign: 'left' }}
                      onClick={() => handleBrandChange('')}
                    >
                      All Brands
                    </Button>
                    {brands.map(br => (
                      <Button
                        key={br.id}
                        type={brand === br.slug ? 'primary' : 'text'}
                        size="small"
                        block
                        style={{ textAlign: 'left' }}
                        onClick={() => handleBrandChange(br.slug)}
                      >
                        {br.name}
                      </Button>
                    ))}
                  </Space>
                </Panel>

                <Panel header={<Text strong>Price Range</Text>} key="price">
                  <Slider
                    range
                    min={0}
                    max={100}
                    value={priceRange}
                    onChange={(val) => setPriceRange(val as [number, number])}
                    marks={{ 0: '$0', 50: '$50', 100: '$100+' }}
                  />
                </Panel>
              </Collapse>

              <Checkbox 
                checked={inStockOnly} 
                onChange={(e) => setInStockOnly(e.target.checked)}
              >
                In Stock Only
              </Checkbox>

              <Button block onClick={clearFilters}>
                Clear Filters
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col xs={24} md={18}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text type="secondary">{filteredProducts.length} products</Text>
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              style={{ width: 180 }}
              prefix={<FilterOutlined />}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <Spin size="large" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <Empty description="No products found" />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredProducts.map(product => (
                <Col key={product.id} xs={12} sm={8} lg={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
}
