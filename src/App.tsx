import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouterProvider, useRouter } from '@/contexts/RouterContext';
import { ToastProvider } from '@/contexts/ToastContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

import HomePage from '@/pages/HomePage';
import ProductListPage from '@/pages/ProductListPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import InstallmentCalculatorPage from '@/pages/InstallmentCalculatorPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import AccountPage from '@/pages/AccountPage';
import OrdersPage from '@/pages/OrdersPage';
import WishlistPage from '@/pages/WishlistPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PolicyPage from '@/pages/PolicyPage';
import ContactPage from '@/pages/ContactPage';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminCoupons from '@/pages/admin/AdminCoupons';
import AdminPlans from '@/pages/admin/AdminPlans';
import AdminStats from '@/pages/admin/AdminStats';
import type { AdminTab } from '@/pages/admin/AdminLayout';

const categorySlugs = ['iphone', 'samsung', 'xiaomi', 'oppo', 'realme', 'honor', 'android'];

function AppRoutes() {
  const { path, query } = useRouter();

  // Admin routes (no header/footer)
  if (path.startsWith('/admin')) {
    const tab = (query.tab as AdminTab) || 'dashboard';
    switch (tab) {
      case 'products': return <AdminProducts tab={tab} />;
      case 'orders': return <AdminOrders tab={tab} />;
      case 'customers': return <AdminCustomers tab={tab} />;
      case 'coupons': return <AdminCoupons tab={tab} />;
      case 'plans': return <AdminPlans tab={tab} />;
      case 'stats': return <AdminStats tab={tab} />;
      default: return <AdminDashboard tab={tab} />;
    }
  }

  // Regular pages with header/footer
  let page: React.ReactNode;
  if (path === '/' || path === '') {
    page = <HomePage />;
  } else if (path === '/products') {
    page = <ProductListPage />;
  } else if (categorySlugs.includes(path.slice(1))) {
    page = <ProductListPage category={path.slice(1)} />;
  } else if (path.startsWith('/product/')) {
    page = <ProductDetailPage />;
  } else if (path === '/cart') {
    page = <CartPage />;
  } else if (path === '/checkout') {
    page = <CheckoutPage />;
  } else if (path === '/installment') {
    page = <InstallmentCalculatorPage />;
  } else if (path === '/login') {
    page = <LoginPage />;
  } else if (path === '/register') {
    page = <RegisterPage />;
  } else if (path === '/forgot-password') {
    page = <ForgotPasswordPage />;
  } else if (path === '/account') {
    page = <AccountPage />;
  } else if (path === '/orders') {
    page = <OrdersPage />;
  } else if (path === '/wishlist') {
    page = <WishlistPage />;
  } else if (path.startsWith('/policy/')) {
    page = <PolicyPage />;
  } else if (path === '/contact') {
    page = <ContactPage />;
  } else {
    page = <NotFoundPage />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{page}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <RouterProvider>
                <AppRoutes />
              </RouterProvider>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
