/**
 * Home Page - Shop First Design
 * 
 * Main shopping page featuring:
 * - Product grid with immediate visibility
 * - Sidebar filters (desktop) / Drawer filters (mobile)
 * - Search and sort functionality
 * - Pagination
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Row, Col, Input, Select, Slider, Checkbox, Card, Typography, 
  Space, Button, Spin, Empty, Collapse, Drawer, Pagination, Divider,
  Badge,
} from 'antd';
import { SearchOutlined, FilterOutlined, CloseOutlined } from '@ant-design/icons';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories, getBrands } from '@/api/services';
import type { Product, Category, Brand } from '@/types';

const { Title, Text } = Typography;

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
];

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // Load data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [productsData, categoriesData, brandsData] = await Promise.all([
        getProducts({ 
          category: category || undefined, 
          brand: brand || undefined,
          search: search || undefined,
          inStock: inStockOnly || undefined,
          sort: sortBy as any,
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
  }, [category, brand, search, inStockOnly, sortBy]);

  // Apply client-side price filter and pagination
  const filteredProducts = products.filter(p => {
    const minPrice = Math.min(...p.sizes.map(s => s.retailPrice));
    return minPrice >= priceRange[0] && minPrice <= priceRange[1];
  });

  const totalProducts = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Count active filters
  const activeFiltersCount = [category, brand, inStockOnly].filter(Boolean).length;

  // URL parameter handlers
  const updateUrlParam = (key: string, value: string | null) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    updateUrlParam('category', cat || null);
  };

  const handleBrandChange = (br: string) => {
    setBrand(br);
    updateUrlParam('brand', br || null);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setBrand('');
    setPriceRange([0, 100]);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filter sidebar content (shared between desktop and mobile)
  const FilterContent = () => (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      {/* Search */}
      <Input
        placeholder="Search products..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
      />

      {/* Categories */}
      <Collapse 
        defaultActiveKey={['category', 'brand', 'price']} 
        ghost
        expandIconPosition="end"
        items={[
          {
            key: 'category',
            label: <Text strong>Category</Text>,
            children: (
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
            ),
          },
          {
            key: 'brand',
            label: <Text strong>Brand</Text>,
            children: (
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
            ),
          },
          {
            key: 'price',
            label: <Text strong>Price Range</Text>,
            children: (
              <>
                <Slider
                  range
                  min={0}
                  max={100}
                  value={priceRange}
                  onChange={(val) => setPriceRange(val as [number, number])}
                  marks={{ 0: '$0', 50: '$50', 100: '$100+' }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ${priceRange[0]} - ${priceRange[1]}+
                </Text>
              </>
            ),
          },
        ]}
      />

      <Checkbox 
        checked={inStockOnly} 
        onChange={(e) => setInStockOnly(e.target.checked)}
      >
        In Stock Only
      </Checkbox>

      <Button block onClick={clearFilters} disabled={activeFiltersCount === 0 && !search}>
        Clear All Filters
      </Button>
    </Space>
  );

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>Shop All Products</Title>
        <Text type="secondary">
          Premium professional hair care products
        </Text>
      </div>

      <Row gutter={24}>
        {/* Desktop Filters Sidebar */}
        <Col xs={0} md={6}>
          <Card size="small" style={{ position: 'sticky', top: 88 }}>
            <FilterContent />
          </Card>
        </Col>

        {/* Products Grid */}
        <Col xs={24} md={18}>
          {/* Toolbar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <Space wrap>
              {/* Mobile Filter Button */}
              <Button 
                icon={<FilterOutlined />}
                onClick={() => setMobileFiltersOpen(true)}
                className="mobile-filter-btn"
                style={{ display: 'none' }}
              >
                Filters
                {activeFiltersCount > 0 && (
                  <Badge count={activeFiltersCount} size="small" style={{ marginLeft: 8 }} />
                )}
              </Button>
              
              <Text type="secondary">{totalProducts} products</Text>
              
              {/* Active filter tags */}
              {category && (
                <Button 
                  size="small" 
                  onClick={() => handleCategoryChange('')}
                  icon={<CloseOutlined />}
                >
                  {categories.find(c => c.slug === category)?.name}
                </Button>
              )}
              {brand && (
                <Button 
                  size="small" 
                  onClick={() => handleBrandChange('')}
                  icon={<CloseOutlined />}
                >
                  {brands.find(b => b.slug === brand)?.name}
                </Button>
              )}
            </Space>
            
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              style={{ width: 180 }}
              suffixIcon={<FilterOutlined />}
            />
          </div>

          {/* Products */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <Spin size="large" />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <Empty 
              description="No products found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Empty>
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {paginatedProducts.map(product => (
                  <Col key={product.id} xs={12} sm={8} lg={6}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalProducts > ITEMS_PER_PAGE && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <Pagination
                    current={currentPage}
                    total={totalProducts}
                    pageSize={ITEMS_PER_PAGE}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showTotal={(total) => `${total} products`}
                  />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      {/* Mobile Filters Drawer */}
      <Drawer
        title="Filters"
        placement="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        width={300}
      >
        <FilterContent />
      </Drawer>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
