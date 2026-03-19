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

        {/* Navigation Bar with Mega Menus */}
        <nav className="hidden md:block text-black border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-8 py-3">
              {/* Эхлэл */}
              <Link to="/" className="flex items-center gap-2 hover:text-blue-600 font-medium transition-colors">
                <Home size={18} />
                Эхлэл
              </Link>

              {/* Biz Print - Mega Menu */}
              <div className="relative group">
                <Link to="/biz-print" className="hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                  Biz Print
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>
                
                <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Хэвлэлийн бүтээгдэхүүн</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">Ном, сурах бичиг</h4>
                        <p className="text-xs text-gray-500">Сургалтын материал</p>
                      </div>
                      <div className="p-3 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">Оффисын хэвлэл</h4>
                        <p className="text-xs text-gray-500">Бичиг баримт</p>
                      </div>
                      <div className="p-3 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">Сурталчилгаа</h4>
                        <p className="text-xs text-gray-500">Зар сурталчилгаа</p>
                      </div>
                      <div className="p-3 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">Баннер</h4>
                        <p className="text-xs text-gray-500">Томоохон хэвлэл</p>
                      </div>
                    </div>
                    <Link to="/biz-print" className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Бүгдийг үзэх →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Biz Marketing - Mega Menu */}
              <div className="relative group">
                <Link to="/biz-marketing" className="hover:text-purple-600 font-medium transition-colors flex items-center gap-1">
                  Biz Marketing
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>
                
                <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Маркетингийн үйлчилгээ</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 hover:bg-purple-50 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">Брэнд дизайн</h4>
                        <p className="text-xs text-gray-500">Лого, фирм дизайн</p>
                      </div>
                      <div className="p-3 hover:bg-purple-50 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">Сошиал медиа</h4>
                        <p className="text-xs text-gray-500">SMM үйлчилгээ</p>
                      </div>
                      <div className="p-3 hover:bg-purple-50 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">Контент</h4>
                        <p className="text-xs text-gray-500">Агуулга бүтээх</p>
                      </div>
                      <div className="p-3 hover:bg-purple-50 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-gray-900 mb-1">Зар сурталчилгаа</h4>
                        <p className="text-xs text-gray-500">Онлайн маркетинг</p>
                      </div>
                    </div>
                    <Link to="/biz-marketing" className="mt-4 block text-center text-purple-600 hover:text-purple-700 font-medium text-sm">
                      Бүгдийг үзэх →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Үнийн санал */}
              <div className="relative group">
                <Link to="/quotation" className="hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                  Үнийн санал
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>
                
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Үнийн санал авах</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Таны хэрэгцээнд тохирсон үнийн санал авахын тулд маягт бөглөнө үү.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ Үнэгүй зөвлөгөө</li>
                      <li>✓ 24 цагийн дотор хариу</li>
                      <li>✓ Тохируулах боломжтой</li>
                    </ul>
                    <Link to="/quotation" className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                      Санал авах
                    </Link>
                  </div>
                </div>
              </div>

              {/* Бидний тухай */}
              <div className="relative group">
                <Link to="/about" className="hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                  Бидний тухай
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>
                
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">BIZ PRINT PRO</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Монголд үйл ажиллагаа явуулж буй хэвлэл, маркетингийн мэргэжлийн компани.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-blue-600">✓</span>
                        <span>10+ жилийн туршлага</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-blue-600">✓</span>
                        <span>Орчин үеийн тоног төхөөрөмж</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-blue-600">✓</span>
                        <span>Мэргэжлийн баг</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Холбоо барих */}
              <div className="relative group">
                <Link to="/contact" className="hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
                  Холбоо барих
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>
                
                <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Холбогдох</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Phone size={18} className="text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Утас</p>
                          <p className="text-sm text-gray-600">+976 7200-0444</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail size={18} className="text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Имэйл</p>
                          <p className="text-sm text-gray-600">bizprintpro@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Home size={18} className="text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Хаяг</p>
                          <p className="text-sm text-gray-600">Улаанбаатар, Монгол Улс</p>
                        </div>
                      </div>
                    </div>
                    <Link to="/contact" className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                      Мессеж илгээх
                    </Link>
                  </div>
                </div>
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