import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Phone, Search, Menu, X, 
  User, ChevronDown, Wallet, Heart, Home,
  Printer
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount, cartTotal } = useCart();
  const { user, isAuthenticated, walletBalance, logout } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('mn-MN').format(price) + '₮';
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+976 7000-5060</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span>Ажлын цаг: Даваа-Баасан 09:00-18:00</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden md:flex items-center gap-2">
                    <Wallet size={14} />
                    <span>Хэтэвч: {formatPrice(walletBalance)}</span>
                  </div>
                  <div className="hidden md:block">Тавтай морил, {user?.name}</div>
                </>
              ) : (
                <Link to="/login" className="hover:text-blue-200 transition-colors">
                  Нэвтрэх / Бүртгүүлэх
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Printer className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">PRINT SHOP</div>
                  <div className="text-xs text-gray-500">Хэвлэлийн төв</div>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Үйлчилгээ, бүтээгдэхүүн хайх..."
                  className="w-full px-4 py-2.5 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User size={20} />
                      <span className="text-sm font-medium">{user?.name}</span>
                      <ChevronDown size={16} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                        <Link 
                          to="/admin" 
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Хувийн мэдээлэл
                        </Link>
                        {user?.role === 'admin' && (
                          <Link 
                            to="/admin/dashboard" 
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Админ панел
                          </Link>
                        )}
                        <button 
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm text-red-600"
                        >
                          Гарах
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    to="/login"
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm font-medium">Нэвтрэх</span>
                  </Link>
                )}
              </div>

              {/* Wishlist */}
              <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Heart size={20} />
                <span className="text-sm font-medium">Хадгалсан</span>
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="relative">
                    <ShoppingCart className="text-gray-700 group-hover:text-blue-600 transition-colors" size={24} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">Сагс</div>
                    <div className="text-xs text-gray-500">{formatPrice(cartTotal)}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Хайх..."
                className="w-full px-4 py-2.5 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block border-t border-gray-100">
            <div className="flex items-center gap-8 py-3">
              <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                <Home size={18} />
                Эхлэл
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Бүтээгдэхүүн
              </Link>
              <Link to="/quotation" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Үнийн санал
              </Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Админ
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 animate-slide-in">
              <div className="flex flex-col gap-3">
                <Link 
                  to="/" 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Эхлэл
                </Link>
                <Link 
                  to="/products" 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Бүтээгдэхүүн
                </Link>
                <Link 
                  to="/quotation" 
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Үнийн санал
                </Link>
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500">Тавтай морил, {user?.name}</div>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard" 
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Админ панел
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      Гарах
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Нэвтрэх
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;