import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Search, Menu, X, Mail,
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
      <div className="text-black py-2 border-b border-gray-100">
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
            <div className="text-xs text-black">
              Ажлын цаг: Даваа-Баасан 09:00-17:00
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
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
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

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
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
              <Link to="/cart" className="relative group">
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300">
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

        {/* Navigation Bar with BestComputers Style Mega Menus */}
        <nav className="hidden md:block text-black border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-8 py-3">
              {/* Эхлэл */}
              <Link to="/" className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors">
                <Home size={18} />
                Эхлэл
              </Link>

              {/* Biz Print - LARGE Mega Menu with Images */}
              <div className="relative group">
                <Link to="/biz-print" className="hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                  Biz Print
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>
                
                {/* Full Width Dropdown with Product Images */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-6xl bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-4 gap-6">
                      {/* Product 1 */}
                      <Link to="/biz-print" className="group/item">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                            <img 
                              src="https://via.placeholder.com/300x300/e3f2fd/1976d2?text=Ном+Сурах+Бичиг" 
                              alt="Ном, сурах бичиг"
                              className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover/item:text-blue-600 transition">Ном, сурах бичиг</h4>
                            <p className="text-xs text-gray-500">Сургалтын материал</p>
                          </div>
                        </div>
                      </Link>

                      {/* Product 2 */}
                      <Link to="/biz-print" className="group/item">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                            <img 
                              src="https://via.placeholder.com/300x300/f3e5f5/7b1fa2?text=Оффис+Хэвлэл" 
                              alt="Оффисын хэвлэл"
                              className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover/item:text-blue-600 transition">Оффисын хэвлэл</h4>
                            <p className="text-xs text-gray-500">Бичиг баримт, хуудас</p>
                          </div>
                        </div>
                      </Link>

                      {/* Product 3 */}
                      <Link to="/biz-print" className="group/item">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                            <img 
                              src="https://via.placeholder.com/300x300/fff3e0/f57c00?text=Сурталчилгаа" 
                              alt="Сурталчилгаа"
                              className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover/item:text-blue-600 transition">Сурталчилгаа</h4>
                            <p className="text-xs text-gray-500">Зар, флаер, каталог</p>
                          </div>
                        </div>
                      </Link>

                      {/* Product 4 */}
                      <Link to="/biz-print" className="group/item">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                            <img 
                              src="https://via.placeholder.com/300x300/e8f5e9/388e3c?text=Баннер" 
                              alt="Баннер"
                              className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover/item:text-blue-600 transition">Баннер</h4>
                            <p className="text-xs text-gray-500">Томоохон хэвлэл</p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* View All Button */}
                    <div className="mt-6 text-center">
                      <Link to="/biz-print" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                        Бүх бүтээгдэхүүн үзэх →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biz Marketing - LARGE Mega Menu with Images */}
              <div className="relative group">
                <Link to="/biz-marketing" className="hover:text-purple-600 font-medium transition-colors flex items-center gap-1">
                  Biz Marketing
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>
                
                {/* Full Width Dropdown with Service Images */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-6xl bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-8">
                    <div className="grid grid-cols-4 gap-6">
                      {/* Service 1 */}
                      <Link to="/biz-marketing" className="group/item">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-400 transition-all">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                            <img 
                              src="https://via.placeholder.com/300x300/f3e5f5/8e24aa?text=Брэнд+Дизайн" 
                              alt="Брэнд дизайн"
                              className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover/item:text-purple-600 transition">Брэнд дизайн</h4>
                            <p className="text-xs text-gray-500">Лого, фирм загвар</p>
                          </div>
                        </div>
                      </Link>

                      {/* Service 2 */}
                      <Link to="/biz-marketing" className="group/item">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-400 transition-all">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                            <img 
                              src="https://via.placeholder.com/300x300/e1f5fe/0288d1?text=Сошиал+Медиа" 
                              alt="Сошиал медиа"
                              className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover/item:text-purple-600 transition">Сошиал медиа</h4>
                            <p className="text-xs text-gray-500">SMM үйлчилгээ</p>
                          </div>
                        </div>
                      </Link>

                      {/* Service 3 */}
                      <Link to="/biz-marketing" className="group/item">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-400 transition-all">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                            <img 
                              src="https://via.placeholder.com/300x300/fff9c4/f9a825?text=Контент" 
                              alt="Контент"
                              className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover/item:text-purple-600 transition">Контент</h4>
                            <p className="text-xs text-gray-500">Агуулга бүтээх</p>
                          </div>
                        </div>
                      </Link>

                      {/* Service 4 */}
                      <Link to="/biz-marketing" className="group/item">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-400 transition-all">
                          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                            <img 
                              src="https://via.placeholder.com/300x300/ffebee/d32f2f?text=Зар+Сурталчилгаа" 
                              alt="Зар сурталчилгаа"
                              className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1 group-hover/item:text-purple-600 transition">Зар сурталчилгаа</h4>
                            <p className="text-xs text-gray-500">Онлайн маркетинг</p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* View All Button */}
                    <div className="mt-6 text-center">
                      <Link to="/biz-marketing" className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
                        Бүх үйлчилгээ үзэх →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Үнийн санал */}
              <Link to="/quotation" className="hover:text-blue-600 font-medium transition-colors">
                Үнийн санал
              </Link>

              {/* Бидний тухай */}
              <Link to="/about" className="hover:text-blue-600 font-medium transition-colors">
                Бидний тухай
              </Link>

              {/* Холбоо барих */}
              <Link to="/contact" className="hover:text-blue-600 font-medium transition-colors">
                Холбоо барих
              </Link>
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