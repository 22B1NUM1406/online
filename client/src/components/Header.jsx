import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Phone, Search, Menu, X, Mail, Wallet, 
  ChevronDown, User, Home, Heart, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/helpers';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+976 7200-0444</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Mail size={14} />
                <span>bizprintpro@gmail.com</span>
              </div>
            </div>
            <div className="text-xs text-blue-100">
              Ажлын цаг: Даваа-Баасан 09:00-18:00
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">BIZ PRINT PRO</div>
                <div className="text-xs text-gray-500">Хэвлэлийн компани</div>
              </div>
            </Link>
            
           
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {isAuthenticated ? user?.name : 'Нэвтрэх'}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 z-50">
                    {!isAuthenticated ? (
                      <Link 
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <User size={18} />
                        <span className="text-sm font-medium text-gray-700">Нэвтрэх / Бүртгүүлэх</span>
                      </Link>
                    ) : (
                      <>
                        <Link 
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <User size={18} />
                          <span className="text-sm font-medium text-gray-700">Профайл</span>
                        </Link>
                        {isAdmin && (
                          <Link 
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                          >
                            <Settings size={18} />
                            <span className="text-sm font-medium text-gray-700">Админ самбар</span>
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-600"
                        >
                          <LogOut size={18} />
                          <span className="text-sm font-medium">Гарах</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wallet - Only for authenticated users */}
              {isAuthenticated && (
                <Link 
                  to="/wallet"
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Wallet size={20} />
                  <span className="text-sm font-medium">{formatPrice(user?.wallet || 0)}</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link 
                to="/wishlist"
                className="relative hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="relative">
                  <Heart size={20} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">Хадгалсан</span>
              </Link>
              
              {/* Cart */}
              <Link 
                to="/cart"
                className="relative group"
              >
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="relative">
                    <ShoppingCart className="text-gray-700 group-hover:text-blue-600 transition-colors" size={24} />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                        {getCartCount()}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">Сагс</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="hidden md:block bg-gray-900 text-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8 py-3">
                <Link 
                  to="/"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <Home size={18} />
                  Эхлэл
                </Link>
                <Link 
                  to="/biz-print"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Biz Print
                </Link>
                <Link 
                  to="/biz-marketing"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Biz Marketing
                </Link>
                <Link 
                  to="/quotation"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Үнийн санал
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Бидний тухай
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Холбоо барих
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Цэс</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              <Link to="/" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Эхлэл</Link>
              <Link to="/biz-print" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Biz Print</Link>
              <Link to="/biz-marketing" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Biz Marketing</Link>
              <Link to="/quotation" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Үнийн санал</Link>
              <Link to="/about" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Бидний тухай</Link>
              <Link to="/contact" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Холбоо барих</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Профайл</Link>
                  <Link to="/wallet" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Хэтэвч</Link>
                  {isAdmin && <Link to="/admin" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Админ</Link>}
                  <button onClick={handleLogout} className="block w-full text-left py-3 hover:bg-gray-100 rounded-lg px-4 text-red-600">Гарах</button>
                </>
              ) : (
                <Link to="/login" className="block py-3 hover:bg-gray-100 rounded-lg px-4">Нэвтрэх</Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;