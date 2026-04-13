import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './routes/PrivateRoute';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentMethodPage } from './pages/PaymentMethodPage';
import { PaymentPage } from './pages/PaymentPage';
import { ReceiptPage } from './pages/ReceiptPage';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProductsPage } from './pages/AdminProductsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-method" element={<PaymentMethodPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />

        {/* Admin Routes */}
        <Route path="/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <AdminProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute>
              <AdminCategoriesPage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
