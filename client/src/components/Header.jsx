import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Search, Menu, X, Mail,
  ChevronDown, User, Home, Heart, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { getProducts, getCategories } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mega Menu States
  const [categories, setCategories] = useState([]);
  const [printProducts, setPrintProducts] = useState([]);
  const [marketingProducts, setMarketingProducts] = useState([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [loadingMarketing, setLoadingMarketing] = useState(false);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load Biz Print products on hover
  const loadPrintProducts = async () => {
    if (printProducts.length > 0) return; // Already loaded
    
    try {
      setLoadingPrint(true);
      const data = await getProducts({ limit: 4 });
      setPrintProducts(data.data || []);
    } catch (error) {
      console.error('Error loading print products:', error);
    } finally {
      setLoadingPrint(false);
    }
  };

  // Load Biz Marketing products on hover
  const loadMarketingProducts = async () => {
    if (marketingProducts.length > 0) return; // Already loaded
    
    try {
      setLoadingMarketing(true);
      const data = await getProducts({ limit: 4 });
      setMarketingProducts(data.data || []);
    } catch (error) {
      console.error('Error loading marketing products:', error);
    } finally {
      setLoadingMarketing(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="text-black py-2 border-t border-gray-100">
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
              <Link
                to="/cart"
                className="relative group"
              >
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8 py-3">
                {/* Эхлэл */}
                <Link
                  to="/"
                  className="flex items-center gap-2 hover:text-blue-400 font-medium transition-colors"
                >
                  <Home size={18} />
                  Эхлэл
                </Link>

                {/* Biz Print - BestComputers Style Mega Menu */}
                <div className="relative group" onMouseEnter={loadPrintProducts}>
                  <Link
                    to="/biz-print"
                    className="hover:text-blue-400 font-medium transition-colors flex items-center gap-1"
                  >
                    Biz Print
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                  </Link>
                  
                  {/* Large Dropdown with Real Products */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-5xl bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-8">
                      {loadingPrint ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-4 gap-6">
                            {printProducts.length > 0 ? (
                              printProducts.map((product) => (
                                <Link key={product._id} to={`/products/${product._id}`} className="group/item">
                                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all">
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                      <img 
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                                        onError={(e) => {
                                          e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                        }}
                                      />
                                    </div>
                                    <div className="p-4 border-t border-gray-100">
                                      <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover/item:text-blue-600 transition min-h-[40px]">
                                        {product.name}
                                      </h4>
                                      <div className="flex items-baseline gap-2">
                                        {product.discount ? (
                                          <>
                                            <span className="text-base font-bold text-red-600">
                                              {formatPrice(product.price * (1 - product.discount / 100))}₮
                                            </span>
                                            <span className="text-xs text-gray-400 line-through">
                                              {formatPrice(product.price)}₮
                                            </span>
                                          </>
                                        ) : (
                                          <span className="text-base font-bold text-gray-900">
                                            {formatPrice(product.price)}₮
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              // Fallback if no products
                              <>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6">
                                  <div className="text-center">
                                    <div className="text-6xl mb-2">📚</div>
                                    <div className="text-sm text-gray-600">Ном, сурах бичиг</div>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6">
                                  <div className="text-center">
                                    <div className="text-6xl mb-2">📄</div>
                                    <div className="text-sm text-gray-600">Оффисын хэвлэл</div>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6">
                                  <div className="text-center">
                                    <div className="text-6xl mb-2">📢</div>
                                    <div className="text-sm text-gray-600">Сурталчилгаа</div>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6">
                                  <div className="text-center">
                                    <div className="text-6xl mb-2">🖼️</div>
                                    <div className="text-sm text-gray-600">Баннер</div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="mt-6 text-center">
                            <Link to="/biz-print" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                              Бүгдийг үзэх →
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Biz Marketing - BestComputers Style Mega Menu */}
                <div className="relative group" onMouseEnter={loadMarketingProducts}>
                  <Link
                    to="/biz-marketing"
                    className="hover:text-purple-400 font-medium transition-colors flex items-center gap-1"
                  >
                    Biz Marketing
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                  </Link>
                  
                  {/* Large Dropdown with Real Products */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-5xl bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-8">
                      {loadingMarketing ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-4 gap-6">
                            {marketingProducts.length > 0 ? (
                              marketingProducts.map((product) => (
                                <Link key={product._id} to={`/products/${product._id}`} className="group/item">
                                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-400 transition-all">
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                      <img 
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                                        onError={(e) => {
                                          e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                        }}
                                      />
                                    </div>
                                    <div className="p-4 border-t border-gray-100">
                                      <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover/item:text-purple-600 transition min-h-[40px]">
                                        {product.name}
                                      </h4>
                                      <div className="flex items-baseline gap-2">
                                        {product.discount ? (
                                          <>
                                            <span className="text-base font-bold text-red-600">
                                              {formatPrice(product.price * (1 - product.discount / 100))}₮
                                            </span>
                                            <span className="text-xs text-gray-400 line-through">
                                              {formatPrice(product.price)}₮
                                            </span>
                                          </>
                                        ) : (
                                          <span className="text-base font-bold text-gray-900">
                                            {formatPrice(product.price)}₮
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              // Fallback if no products
                              <>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6">
                                  <div className="text-center">
                                    <div className="text-6xl mb-2">🎨</div>
                                    <div className="text-sm text-gray-600">Брэнд дизайн</div>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6">
                                  <div className="text-center">
                                    <div className="text-6xl mb-2">📱</div>
                                    <div className="text-sm text-gray-600">Сошиал медиа</div>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6">
                                  <div className="text-center">
                                    <div className="text-6xl mb-2">✍️</div>
                                    <div className="text-sm text-gray-600">Контент</div>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6">
                                  <div className="text-center">
                                    <div className="text-6xl mb-2">📊</div>
                                    <div className="text-sm text-gray-600">Зар сурталчилгаа</div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="mt-6 text-center">
                            <Link to="/biz-marketing" className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
                              Бүгдийг үзэх →
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  to="/quotation"
                  className="hover:text-blue-400 font-medium transition-colors"
                >
                  Үнийн санал
                </Link>
                <Link
                  to="/about"
                  className="hover:text-blue-400 font-medium transition-colors"
                >
                  Бидний тухай
                </Link>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 font-medium transition-colors"
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