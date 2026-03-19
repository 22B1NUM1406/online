import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Menu, X, Mail,
  ChevronDown, User, Home, Heart, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { getProducts, getMarketingServices } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [printProducts, setPrintProducts] = useState([]);
  const [marketingServices, setMarketingServices] = useState([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [loadingMarketing, setLoadingMarketing] = useState(false);

  const loadPrintProducts = async () => {
    if (printProducts.length > 0) return;
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

  const loadMarketingServices = async () => {
    if (marketingServices.length > 0) return;
    try {
      setLoadingMarketing(true);
      const data = await getMarketingServices({ limit: 4 });
      setMarketingServices(data.data || []);
    } catch (error) {
      console.error('Error loading marketing services:', error);
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
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">BIZ PRINT PRO</div>
                <div className="text-xs text-gray-500">Хэвлэлийн компани</div>
              </div>
            </Link>

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
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                        <User size={18} />
                        <span className="text-sm font-medium text-gray-700">Нэвтрэх / Бүртгүүлэх</span>
                      </Link>
                    ) : (
                      <>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                          <User size={18} />
                          <span className="text-sm font-medium text-gray-700">Профайл</span>
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                            <Settings size={18} />
                            <span className="text-sm font-medium text-gray-700">Админ самбар</span>
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-red-600">
                          <LogOut size={18} />
                          <span className="text-sm font-medium">Гарах</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300">
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

        {/* Nav */}
        <nav className="hidden md:block text-black border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-8 py-3">

              {/* Эхлэл */}
              <Link to="/" className="flex items-center gap-2 hover:text-blue-400 font-medium transition-colors">
                <Home size={18} />
                Эхлэл
              </Link>

              {/* ── BIZ PRINT ── */}
              <div className="relative group" onMouseEnter={loadPrintProducts}>
                <Link to="/biz-print" className="hover:text-blue-400 font-medium transition-colors flex items-center gap-1">
                  Biz Print
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-5xl bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-8">
                    {loadingPrint ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-4 gap-6">
                          {printProducts.map((product) => (
                            <Link key={product._id} to={`/products/${product._id}`} className="group/item">
                              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all">
                                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                  <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
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
                          ))}
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

              {/* ── BIZ MARKETING ── */}
              <div className="relative group" onMouseEnter={loadMarketingServices}>
                <Link to="/biz-marketing" className="hover:text-purple-400 font-medium transition-colors flex items-center gap-1">
                  Biz Marketing
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen max-w-5xl bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-8">
                    {loadingMarketing ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-4 gap-6">
                          {marketingServices.map((service) => (
                            <Link key={service._id} to={`/services/${service.slug}`} className="group/item">
                              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-purple-400 transition-all">
                                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                  <img
                                    src={getImageUrl(service.image)}
                                    alt={service.name}
                                    className="w-full h-full object-contain group-hover/item:scale-105 transition-transform"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=Service'; }}
                                  />
                                </div>
                                <div className="p-4 border-t border-gray-100">
                                  <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1 group-hover/item:text-purple-600 transition min-h-[40px]">
                                    {service.name}
                                  </h4>
                                  {service.shortDescription && (
                                    <p className="text-xs text-gray-500 line-clamp-2">{service.shortDescription}</p>
                                  )}
                                  {service.price && (
                                    <p className="text-sm font-bold text-purple-600 mt-2">{service.price}</p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
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

              {/* ── ҮНИЙН САНАЛ ── */}
              <div className="relative group">
                <Link to="/quotation" className="hover:text-blue-400 font-medium transition-colors flex items-center gap-1">
                  Үнийн санал
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>

                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Үнийн санал авах</p>
                    <Link to="/quotation" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group/item">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17H17.01M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover/item:text-blue-600">Хэвлэлийн үнийн санал</p>
                        <p className="text-xs text-gray-400">Ном, каталог, баннер гэх мэт</p>
                      </div>
                    </Link>
                    <Link to="/quotation" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors group/item">
                      <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover/item:text-purple-600">Маркетингийн үнийн санал</p>
                        <p className="text-xs text-gray-400">SEO, SMM, брэндинг</p>
                      </div>
                    </Link>
                    <Link to="/quotation" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors group/item">
                      <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover/item:text-orange-600">Тусгай захиалга</p>
                        <p className="text-xs text-gray-400">Өвөрмөц төсөл, том хэмжээ</p>
                      </div>
                    </Link>
                    <div className="mt-3 pt-3 border-t border-gray-100 px-2">
                      <p className="text-xs text-gray-400">Утас: <span className="text-gray-700 font-medium">+976 7200-0444</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── БИДНИЙ ТУХАЙ ── */}
              <div className="relative group">
                <Link to="/about" className="hover:text-blue-400 font-medium transition-colors flex items-center gap-1">
                  Бидний тухай
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>

                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Компанийн тухай</p>
                    <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-lg mb-3">
                      {[['15+', 'Жил'], ['10,000+', 'Үйлчлүүлэгч'], ['100%', 'Чанар']].map(([num, label], i) => (
                        <div key={i} className="py-3 text-center">
                          <p className="font-bold text-gray-800 text-sm">{num}</p>
                          <p className="text-xs text-gray-400">{label}</p>
                        </div>
                      ))}
                    </div>
                    <Link to="/about" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group/item">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover/item:text-blue-600">Манай тухай</p>
                        <p className="text-xs text-gray-400">Компанийн түүх, алсын харагдлага</p>
                      </div>
                    </Link>
                    <Link to="/about" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group/item">
                      <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover/item:text-green-600">Манай баг</p>
                        <p className="text-xs text-gray-400">Мэргэжлийн хамт олон</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── ХОЛБОО БАРИХ ── */}
              <div className="relative group">
                <Link to="/contact" className="hover:text-blue-400 font-medium transition-colors flex items-center gap-1">
                  Холбоо барих
                  <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                </Link>

                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Холбоо барих</p>
                    {[
                      {
                        icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
                        bg: 'bg-blue-100', label: 'Утас', value: '+976 7200-0444'
                      },
                      {
                        icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                        bg: 'bg-purple-100', label: 'И-мэйл', value: 'bizprintpro@gmail.com'
                      },
                      {
                        icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                        bg: 'bg-red-100', label: 'Хаяг', value: 'СБД, B Center 505 тоот'
                      },
                      {
                        icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                        bg: 'bg-green-100', label: 'Ажлын цаг', value: 'Да-Ба 09:00–18:00'
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-2 py-2">
                        <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">{item.label}</p>
                          <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm">
                        Мессеж илгээх
                      </Link>
                    </div>
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
          <div className="bg-white w-80 h-full p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Цэс</h2>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <nav className="space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Эхлэл</Link>
              <Link to="/biz-print" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Biz Print</Link>
              <Link to="/biz-marketing" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Biz Marketing</Link>
              <Link to="/quotation" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Үнийн санал</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Бидний тухай</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Холбоо барих</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Профайл</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Админ</Link>}
                  <button onClick={handleLogout} className="block w-full text-left py-3 hover:bg-gray-100 rounded-lg px-4 text-red-600">Гарах</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-3 hover:bg-gray-100 rounded-lg px-4">Нэвтрэх</Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;