import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Menu, X, Mail,
  ChevronDown, User, Home, Heart, LogOut, Settings,
  ArrowRight, MapPin, Clock, MessageSquare,
  Printer, TrendingUp, Award, Users, Zap, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProducts, getMarketingServices } from '../services/api';
import { getImageUrl } from '../utils/helpers';

// ── Shared product card grid ────────────────────────────────────────────────
const ProductGrid = ({ items, to, accentHover }) => (
  <div className="p-5 grid grid-cols-3 gap-3">
    {items.map((item) => (
      <Link
        key={item._id}
        to={to}
        className="group/item rounded-xl border border-transparent hover:border-gray-200 hover:shadow-md transition-all overflow-hidden bg-white"
      >
        <div className="h-28 overflow-hidden bg-gray-100">
          {item.image ? (
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.background = '#f3f4f6'; e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Printer size={28} className="text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className={`font-semibold text-gray-800 text-sm leading-tight ${accentHover} transition-colors line-clamp-1`}>
            {item.name}
          </p>
          {item.shortDescription && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.shortDescription}</p>
          )}
          {item.category && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.category}</p>
          )}
        </div>
      </Link>
    ))}
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});

  // Dropdown data from API
  const [printProducts, setPrintProducts] = useState([]);
  const [marketingServices, setMarketingServices] = useState([]);
  const [printLoaded, setPrintLoaded] = useState(false);
  const [marketingLoaded, setMarketingLoaded] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleMobile = (key) =>
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const loadPrintProducts = async () => {
    if (printLoaded) return;
    setPrintLoaded(true);
    try {
      const data = await getProducts({});
      setPrintProducts((data.data || []).slice(0, 6));
    } catch (e) {
      console.error('Header print load error:', e);
    }
  };

  const loadMarketingServices = async () => {
    if (marketingLoaded) return;
    setMarketingLoaded(true);
    try {
      const data = await getMarketingServices({});
      setMarketingServices((data.data || []).slice(0, 6));
    } catch (e) {
      console.error('Header marketing load error:', e);
    }
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

            <div className="flex items-center gap-3">
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    {!isAuthenticated ? (
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700">
                        <User size={17} /> Нэвтрэх / Бүртгүүлэх
                      </Link>
                    ) : (
                      <>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700">
                          <User size={17} /> Профайл
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-700">
                            <Settings size={17} /> Админ самбар
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-medium text-red-600">
                          <LogOut size={17} /> Гарах
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

        {/* Nav Bar */}
        <nav className="hidden md:block text-black border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2">

              <Link to="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 font-medium text-sm transition-colors">
                <Home size={16} /> Эхлэл
              </Link>

              {/* ── BIZ PRINT ── */}
              <div className="relative group" onMouseEnter={loadPrintProducts}>
                <Link to="/biz-print" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 font-medium text-sm transition-colors">
                  Biz Print
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '780px' }}>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-base">Biz Print — Хэвлэлийн бүтээгдэхүүн</p>
                        <p className="text-blue-100 text-xs mt-0.5">Өндөр чанар · Хурдан хүргэлт · Боломжийн үнэ</p>
                      </div>
                      <Printer size={28} className="text-blue-200" />
                    </div>

                    {printProducts.length > 0 ? (
                      <ProductGrid items={printProducts} to="/biz-print" accentHover="group-hover/item:text-blue-600" />
                    ) : (
                      <div className="p-5 grid grid-cols-3 gap-3">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                            <div className="h-28 bg-gray-100 animate-pulse" />
                            <div className="p-2.5 space-y-1.5">
                              <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                              <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                      <Link to="/biz-print" className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm">
                        Бүх бүтээгдэхүүн үзэх <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── BIZ MARKETING ── */}
              <div className="relative group" onMouseEnter={loadMarketingServices}>
                <Link to="/biz-marketing" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-purple-600 font-medium text-sm transition-colors">
                  Biz Marketing
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '780px' }}>
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-base">Biz Marketing — Дижитал маркетинг</p>
                        <p className="text-purple-100 text-xs mt-0.5">SEO · Сошиал медиа · Брэндинг · Контент</p>
                      </div>
                      <TrendingUp size={28} className="text-purple-200" />
                    </div>

                    {marketingServices.length > 0 ? (
                      <ProductGrid items={marketingServices} to="/services" accentHover="group-hover/item:text-purple-600" />
                    ) : (
                      <div className="p-5 grid grid-cols-3 gap-3">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                            <div className="h-28 bg-gray-100 animate-pulse" />
                            <div className="p-2.5 space-y-1.5">
                              <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                              <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="px-5 pb-4 border-t border-gray-100 pt-3">
                      <Link to="/biz-marketing" className="flex items-center justify-center gap-2 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors text-sm">
                        Бүх үйлчилгээ үзэх <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ҮНИЙН САНАЛ ── */}
              <div className="relative group">
                <Link to="/quotation" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 font-medium text-sm transition-colors">
                  Үнийн санал
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '360px' }}>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4">
                      <p className="text-white font-bold text-base">Үнийн санал авах</p>
                      <p className="text-blue-100 text-xs mt-0.5">24 цагийн дотор хариу өгнө</p>
                    </div>
                    <div className="p-4 space-y-1">
                      {[
                        { icon: <Printer size={17} />, title: 'Хэвлэлийн үнийн санал', desc: 'Ном, каталог, баннер гэх мэт', accent: 'text-blue-600 bg-blue-50' },
                        { icon: <TrendingUp size={17} />, title: 'Маркетингийн үнийн санал', desc: 'SEO, SMM, брэндинг', accent: 'text-purple-600 bg-purple-50' },
                        { icon: <Star size={17} />, title: 'Тусгай захиалга', desc: 'Өвөрмөц төсөл, том хэмжээ', accent: 'text-orange-600 bg-orange-50' },
                      ].map((item, i) => (
                        <Link key={i} to="/quotation" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.accent}`}>{item.icon}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm group-hover/item:text-blue-600 transition-colors">{item.title}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                          <ArrowRight size={14} className="text-gray-300 group-hover/item:text-blue-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                    <div className="px-4 pb-4">
                      <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-center border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Утас: <span className="text-gray-800">+976 7200-0444</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── БИДНИЙ ТУХАЙ ── */}
              <div className="relative group">
                <Link to="/about" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 font-medium text-sm transition-colors">
                  Бидний тухай
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '380px' }}>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-4">
                      <p className="text-white font-bold text-base">BIZ PRINT PRO</p>
                      <p className="text-gray-300 text-xs mt-0.5">2009 оноос хойш Монголын хэвлэлийн салбарт</p>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                      {[['15+', 'Жилийн туршлага'], ['10,000+', 'Үйлчлүүлэгч'], ['100%', 'Чанарын баталгаа']].map(([num, label], i) => (
                        <div key={i} className="py-3 text-center">
                          <p className="font-bold text-gray-800 text-sm">{num}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 space-y-1">
                      {[
                        { icon: <Award size={17} />, title: 'Манай тухай', desc: 'Компанийн түүх, алсын харагдлага', accent: 'text-blue-600 bg-blue-50' },
                        { icon: <Users size={17} />, title: 'Манай баг', desc: 'Мэргэжлийн туршлагатай хамт олон', accent: 'text-green-600 bg-green-50' },
                        { icon: <Zap size={17} />, title: 'Яагаад бидийг сонгох вэ?', desc: 'Давуу тал, ялгарах онцлог', accent: 'text-orange-600 bg-orange-50' },
                      ].map((item, i) => (
                        <Link key={i} to="/about" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.accent}`}>{item.icon}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm group-hover/item:text-blue-600 transition-colors">{item.title}</p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                          <ArrowRight size={14} className="text-gray-300 group-hover/item:text-blue-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ХОЛБОО БАРИХ ── */}
              <div className="relative group">
                <Link to="/contact" className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-600 font-medium text-sm transition-colors">
                  Холбоо барих
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '340px' }}>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4">
                      <p className="text-white font-bold text-base">Холбоо барих</p>
                      <p className="text-blue-100 text-xs mt-0.5">Бид тантай холбогдоход бэлэн</p>
                    </div>

                    <div className="p-4 space-y-3">
                      {[
                        { icon: <Phone size={16} />, label: 'Утас', value: '+976 7200-0444', accent: 'text-blue-600 bg-blue-50' },
                        { icon: <Mail size={16} />, label: 'И-мэйл', value: 'bizprintpro@gmail.com', accent: 'text-purple-600 bg-purple-50' },
                        { icon: <MapPin size={16} />, label: 'Хаяг', value: 'СБД, B Center 505 тоот', accent: 'text-red-600 bg-red-50' },
                        { icon: <Clock size={16} />, label: 'Ажлын цаг', value: 'Да-Ба 09:00 – 18:00', accent: 'text-green-600 bg-green-50' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.accent}`}>{item.icon}</div>
                          <div>
                            <p className="text-xs text-gray-400">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 pb-4">
                      <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-xl transition-opacity text-sm">
                        <MessageSquare size={15} /> Мессеж илгээх
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
          <div className="bg-white w-80 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold">Цэс</h2>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <nav className="p-4 space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm">
                <Home size={17} className="text-gray-400" /> Эхлэл
              </Link>

              {/* Biz Print */}
              <div>
                <button
                  onClick={() => { toggleMobile('print'); loadPrintProducts(); }}
                  className="w-full flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm"
                >
                  <span className="flex items-center gap-2"><Printer size={17} className="text-blue-500" /> Biz Print</span>
                  <ChevronDown size={15} className={`transition-transform ${mobileExpanded.print ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded.print && (
                  <div className="ml-4 space-y-0.5 mb-1">
                    {printProducts.length > 0 ? printProducts.map((item) => (
                      <Link key={item._id} to="/biz-print" onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-3 hover:bg-blue-50 rounded-lg text-sm text-gray-700">
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0" />
                        )}
                        <span className="line-clamp-1">{item.name}</span>
                      </Link>
                    )) : (
                      <div className="px-3 py-2 text-xs text-gray-400">Ачааллаж байна...</div>
                    )}
                    <Link to="/biz-print" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1 py-2 px-3 text-blue-600 text-sm font-medium">
                      Бүгдийг үзэх <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Biz Marketing */}
              <div>
                <button
                  onClick={() => { toggleMobile('marketing'); loadMarketingServices(); }}
                  className="w-full flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm"
                >
                  <span className="flex items-center gap-2"><TrendingUp size={17} className="text-purple-500" /> Biz Marketing</span>
                  <ChevronDown size={15} className={`transition-transform ${mobileExpanded.marketing ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded.marketing && (
                  <div className="ml-4 space-y-0.5 mb-1">
                    {marketingServices.length > 0 ? marketingServices.map((item) => (
                      <Link key={item._id} to="/biz-marketing" onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 px-3 hover:bg-purple-50 rounded-lg text-sm text-gray-700">
                        {item.image ? (
                          <img src={getImageUrl(item.image)} alt={item.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0" />
                        )}
                        <span className="line-clamp-1">{item.name}</span>
                      </Link>
                    )) : (
                      <div className="px-3 py-2 text-xs text-gray-400">Ачааллаж байна...</div>
                    )}
                    <Link to="/biz-marketing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1 py-2 px-3 text-purple-600 text-sm font-medium">
                      Бүгдийг үзэх <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/quotation" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm">
                <MessageSquare size={17} className="text-gray-400" /> Үнийн санал
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm">
                <Award size={17} className="text-gray-400" /> Бидний тухай
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm">
                <Phone size={17} className="text-gray-400" /> Холбоо барих
              </Link>

              <div className="border-t border-gray-100 pt-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm">
                      <User size={17} className="text-gray-400" /> Профайл
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm">
                        <Settings size={17} className="text-gray-400" /> Админ
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 py-3 px-3 hover:bg-red-50 rounded-lg font-medium text-sm text-red-600">
                      <LogOut size={17} /> Гарах
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 hover:bg-gray-50 rounded-lg font-medium text-sm">
                    <User size={17} className="text-gray-400" /> Нэвтрэх
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;