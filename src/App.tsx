/**
 * Tessa Shop - Main Application Router
 * 
 * Defines all application routes with proper layouts.
 * Uses React Router v6 for navigation.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Result, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Components
import RoleSwitcher from '@/components/RoleSwitcher';
import CartDrawer from '@/components/CartDrawer';

// Pages - Main Shop
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';

// Pages - Auth
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Pages - Account
import AccountPage from '@/pages/account/AccountPage';
import OrdersPage from '@/pages/account/OrdersPage';
import OrderDetailPage from '@/pages/account/OrderDetailPage';

// Pages - Stylist
import StylistRequestPage from '@/pages/stylist/StylistRequestPage';

// Pages - Distributor
import DistributorPortalPage from '@/pages/distributor/DistributorPortalPage';
import DistributorCodesPage from '@/pages/distributor/DistributorCodesPage';
import DistributorProductsPage from '@/pages/distributor/DistributorProductsPage';

// Pages - Admin
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminStylistRequestsPage from '@/pages/admin/AdminStylistRequestsPage';
import AdminCouponsPage from '@/pages/admin/AdminCouponsPage';
import AdminDistributorsPage from '@/pages/admin/AdminDistributorsPage';

// Hooks
import { useAuth } from '@/contexts';

/**
 * Protected Route Component
 * Restricts access based on user role
 */
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) {
  const { currentRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!allowedRoles.includes(currentRole)) {
    return (
      <Result
        status="403"
        title="Access Denied"
        subTitle="You don't have permission to access this page."
        extra={
          <Link to="/">
            <Button type="primary">Back to Shop</Button>
          </Link>
        }
      />
    );
  }

  return <>{children}</>;
}

/**
 * 404 Not Found Page
 */
function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page Not Found"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
}

function App() {
  return (
    <>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route element={<MainLayout />}>
          {/* Shop */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Account (requires login) */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/account/orders/:id" element={<OrderDetailPage />} />
          
          {/* Stylist Request (open to all) */}
          <Route path="/stylist/request" element={<StylistRequestPage />} />
          
          {/* Distributor Portal */}
          <Route 
            path="/distributor" 
            element={
              <ProtectedRoute allowedRoles={['distributor', 'admin']}>
                <DistributorPortalPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/distributor/codes" 
            element={
              <ProtectedRoute allowedRoles={['distributor', 'admin']}>
                <DistributorCodesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/distributor/products" 
            element={
              <ProtectedRoute allowedRoles={['distributor', 'admin']}>
                <DistributorProductsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="stylist-requests" element={<AdminStylistRequestsPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="distributors" element={<AdminDistributorsPage />} />
        </Route>
      </Routes>

      {/* Global Components */}
      <CartDrawer />
      <RoleSwitcher />
    </>
  );
}

export default App;
