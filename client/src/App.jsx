import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import HomePageBlogs from './pages/HomePageBlogs';
import BlogDetailPage from './pages/BlogDetailPage';
import BizPrintPage from './pages/BizPrintPage';
import BizMarketingPage from './pages/BizMarketingPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import WalletPaymentPage from './pages/WalletPaymentPage';
import QuotationPage from './pages/QuotationPage';
import AdminPage from './pages/AdminPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePageBlogs />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/biz-print" element={<BizPrintPage />} />
                <Route path="/biz-marketing" element={<BizMarketingPage />} />
                <Route path="/service/:slug" element={<ServiceDetailPage />} />
                <Route path="/products" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Protected Routes */}
                <Route path="/cart" element={<CartPage />} />
                <Route 
                  path="/wishlist" 
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment/:orderId" 
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/wallet" 
                  element={
                    <ProtectedRoute>
                      <WalletPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/wallet/payment" 
                  element={
                    <ProtectedRoute>
                      <WalletPaymentPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/quotation" 
                  element={
                    <ProtectedRoute>
                      <QuotationPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 */}
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                        <p className="text-gray-600 mb-6">Хуудас олдсонгүй</p>
                        <a href="/" className="text-blue-600 hover:text-blue-700">
                          Нүүр хуудас руу буцах
                        </a>
                      </div>
                    </div>
                  }
                />
              </Routes>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;