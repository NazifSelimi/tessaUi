import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import RoleSwitcher from '@/components/RoleSwitcher';
import CartDrawer from '@/components/CartDrawer';

// Pages
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import AccountPage from '@/pages/account/AccountPage';
import OrdersPage from '@/pages/account/OrdersPage';
import OrderDetailPage from '@/pages/account/OrderDetailPage';
import StylistRequestPage from '@/pages/stylist/StylistRequestPage';
import DistributorPortalPage from '@/pages/distributor/DistributorPortalPage';
import DistributorCodesPage from '@/pages/distributor/DistributorCodesPage';
import DistributorProductsPage from '@/pages/distributor/DistributorProductsPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminStylistRequestsPage from '@/pages/admin/AdminStylistRequestsPage';
import AdminCouponsPage from '@/pages/admin/AdminCouponsPage';
import AdminDistributorsPage from '@/pages/admin/AdminDistributorsPage';

function App() {
  return (
    <>
      <Routes>
        {/* Main shop routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/account/orders/:id" element={<OrderDetailPage />} />
          <Route path="/stylist/request" element={<StylistRequestPage />} />
          <Route path="/distributor" element={<DistributorPortalPage />} />
          <Route path="/distributor/codes" element={<DistributorCodesPage />} />
          <Route path="/distributor/products" element={<DistributorProductsPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="stylist-requests" element={<AdminStylistRequestsPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="distributors" element={<AdminDistributorsPage />} />
        </Route>
      </Routes>

      <CartDrawer />
      <RoleSwitcher />
    </>
  );
}

export default App;
