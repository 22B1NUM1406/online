import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Menu, X, Mail,
  ChevronDown, User, Home, Heart, LogOut, Settings,
  MapPin, Clock, CreditCard, FileText, Image, BookOpen,
  Tag, Book, CalendarDays, Package,
  Smartphone, Search, Palette, PenLine,
  Megaphone, Globe, Video, Sparkles
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
  const [activeMenu, setActiveMenu] = useState(null);

  const [printProducts, setPrintProducts] = useState([]);
  const [marketingServices, setMarketingServices] = useState([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [loadingMarketing, setLoadingMarketing] = useState(false);

  const hideTimer = useRef(null);

  const show = (menu) => {
    clearTimeout(hideTimer.current);
    setActiveMenu(menu);
    if (menu === 'print' && printProducts.length === 0) {
      setLoadingPrint(true);
      getProducts({})
        .then(d => setPrintProducts((d.data || []).slice(0, 8)))
        .catch(() => {})
        .finally(() => setLoadingPrint(false));
    }
    if (menu === 'marketing' && marketingServices.length === 0) {
      setLoadingMarketing(true);
      getMarketingServices({})
        .then(d => setMarketingServices((d.data || []).slice(0, 8)))
        .catch(() => {})
        .finally(() => setLoadingMarketing(false));
    }
  };

  const hide = () => {
    hideTimer.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  // ── #7: Nav hover илүү мэдрэмжтэй ──
  const NavItem = ({ id, to, label, color = 'blue' }) => (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => show(id)}
      onMouseLeave={hide}
    >
      <Link
        to={to}
        className={`flex items-center gap-1 px-3 h-full text-sm font-medium border-b-2 whitespace-nowrap
          transition-colors duration-200
          ${activeMenu === id
            ? color === 'purple' ? 'text-purple-600 border-purple-500' : 'text-blue-600 border-blue-500'
            : 'text-gray-700 border-transparent hover:text-blue-600'
          }`}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${activeMenu === id ? 'rotate-180' : ''}`} />
      </Link>
    </div>
  );

  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-5 p-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
          <div className="h-20 bg-gray-100 animate-pulse" />
          <div className="p-4 space-y-1.5">
            <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
            <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 py-1.5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Phone size={11} /> +976 7200-0444</span>
            <span className="hidden md:flex items-center gap-1.5"><Mail size={11} /> bizprintpro@gmail.com</span>
          </div>
          <span>Ажлын цаг: Да–Ба 09:00–18:00</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

          {/* Mobile toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-base">B</span>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 leading-none">BIZ PRINT PRO</div>
              <div className="text-[10px] text-gray-400 leading-none mt-0.5">Хэвлэлийн компани</div>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <User size={15} />
                <span className="font-medium">{isAuthenticated ? user?.name : 'Нэвтрэх'}</span>
                <ChevronDown size={12} />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                  {!isAuthenticated ? (
                    <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                      <User size={15} /> Нэвтрэх / Бүртгүүлэх
                    </Link>
                  ) : (
                    <>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                        <User size={15} /> Профайл
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                          <Settings size={15} /> Админ самбар
                        </Link>
                      )}
                      <div className="my-1 border-t border-gray-100" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-sm text-red-500">
                        <LogOut size={15} /> Гарах
                      </button>
                    </>
                  )}
                </div>
                </>
              )}
            </div>

            <Link to="/wishlist" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors relative">
              <div className="relative">
                <Heart size={15} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold">{wishlist.length}</span>
                )}
              </div>
              <span className="font-medium">Хадгалсан</span>
            </Link>

            <Link to="/cart" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors relative">
              <div className="relative">
                <ShoppingCart size={15} />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold animate-pulse">{getCartCount()}</span>
                )}
              </div>
              <span className="hidden md:block font-medium">Сагс</span>
            </Link>
          </div>
        </div>

        {/* ── Nav ── */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="hidden md:flex items-center h-10 gap-0">

              <Link to="/" className="flex items-center gap-1.5 px-3 h-full text-sm font-medium text-gray-600 hover:text-blue-600 border-b-2 border-transparent transition-colors duration-200 whitespace-nowrap">
                <Home size={14} /> Эхлэл
              </Link>

              <NavItem id="print"     to="/biz-print"     label="Biz Print" />
              <NavItem id="marketing" to="/biz-marketing"  label="Biz Marketing" color="purple" />
              <NavItem id="quotation" to="/quotation"      label="Үнийн санал" />
              <NavItem id="about"     to="/about"          label="Бидний тухай" />
              <NavItem id="contact"   to="/contact"        label="Холбоо барих" />

            </nav>
          </div>

          {/* ════ DROPDOWNS — BestComputers.mn загвар ════ */}
          <div
            className="absolute left-0 right-0 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-40 border-t border-gray-100"
            style={{
              top: '100%',
              opacity: activeMenu ? 1 : 0,
              transform: activeMenu ? 'translateY(0px)' : 'translateY(12px)',
              pointerEvents: activeMenu ? 'auto' : 'none',
              transition: 'opacity 0.22s ease, transform 0.22s ease',
            }}
            onMouseEnter={() => clearTimeout(hideTimer.current)}
            onMouseLeave={hide}
          >

            {/* ── BIZ PRINT ── */}
            {activeMenu === 'print' && (
              <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
                {/* Зүүн: Cover зураг + "Бүгдийг үзэх" */}
                <div className="w-48 flex-shrink-0 flex flex-col gap-3">
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-400 h-36">
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <p className="text-white text-xs font-medium opacity-80">Хэвлэлийн</p>
                      <p className="text-white text-lg font-bold leading-tight">Biz Print</p>
                    </div>
                  </div>
                  <Link to="/biz-print" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg text-center transition-colors duration-200">
                    Бүгдийг үзэх →
                  </Link>
                  <Link to="/quotation" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg text-center border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    Үнийн санал авах
                  </Link>
                </div>

                {/* Баруун: Products grid */}
                <div className="flex-1">
                  {loadingPrint ? (
                    <div className="grid grid-cols-4 gap-3">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                          <div className="h-16 bg-gray-100 animate-pulse" />
                          <div className="p-2.5 space-y-1.5">
                            <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
                            <div className="h-2 bg-gray-100 rounded animate-pulse w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : printProducts.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {printProducts.map(p => (
                        <Link key={p._id} to={`/products/${p._id}`} onClick={() => setActiveMenu(null)}
                          className="group/c flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
                          <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                            <img src={getImageUrl(p.image)} alt={p.name}
                              className="w-full h-full object-contain group-hover/c:scale-110 transition-transform duration-300"
                              onError={e => { e.target.src = 'https://via.placeholder.com/80x80?text=P'; }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-700 line-clamp-1 group-hover/c:text-blue-600 transition-colors">{p.name}</p>
                            <p className="text-xs font-bold text-blue-600 mt-0.5">
                              {p.discount
                                ? formatPrice(p.price * (1 - p.discount / 100)) + '₮'
                                : formatPrice(p.price) + '₮'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    /* Статик subcategory grid — API хоосон үед */
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'Визит карт',  Icon: CreditCard,    color: 'text-blue-500',   bg: 'bg-blue-50'   },
                        { name: 'Флаер',        Icon: FileText,      color: 'text-sky-500',    bg: 'bg-sky-50'    },
                        { name: 'Баннер',       Icon: Image,         color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { name: 'Каталог',      Icon: BookOpen,      color: 'text-violet-500', bg: 'bg-violet-50' },
                        { name: 'Наклейк',      Icon: Tag,           color: 'text-pink-500',   bg: 'bg-pink-50'   },
                        { name: 'Ном',          Icon: Book,          color: 'text-rose-500',   bg: 'bg-rose-50'   },
                        { name: 'Хуанли',       Icon: CalendarDays,  color: 'text-orange-500', bg: 'bg-orange-50' },
                        { name: 'Бусад',        Icon: Package,       color: 'text-gray-500',   bg: 'bg-gray-50'   },
                      ].map(({ name, Icon, color, bg }) => (
                        <Link key={name} to="/biz-print" onClick={() => setActiveMenu(null)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group">
                          <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center ${bg}`}>
                            <Icon size={16} className={color} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── BIZ MARKETING ── */}
            {activeMenu === 'marketing' && (
              <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
                {/* Зүүн: Cover */}
                <div className="w-48 flex-shrink-0 flex flex-col gap-3">
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-400 h-36">
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <p className="text-white text-xs font-medium opacity-80">Дижитал</p>
                      <p className="text-white text-lg font-bold leading-tight">Biz Marketing</p>
                    </div>
                  </div>
                  <Link to="/biz-marketing" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg text-center transition-colors duration-200">
                    Бүгдийг үзэх →
                  </Link>
                  <Link to="/quotation" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg text-center border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    Үнийн санал авах
                  </Link>
                </div>

                {/* Баруун: Services grid */}
                <div className="flex-1">
                  {loadingMarketing ? (
                    <div className="grid grid-cols-4 gap-3">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                          <div className="h-16 bg-gray-100 animate-pulse" />
                          <div className="p-2.5 space-y-1.5">
                            <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : marketingServices.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {marketingServices.map(s => (
                        <Link key={s._id} to={`/services/${s.slug}`} onClick={() => setActiveMenu(null)}
                          className="group/c flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200">
                          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden">
                            {s.image
                              ? <img src={getImageUrl(s.image)} alt={s.name} className="w-full h-full object-cover group-hover/c:scale-110 transition-transform duration-300" onError={e => { e.target.src = 'https://via.placeholder.com/80x80?text=S'; }} />
                              : <div className="w-full h-full" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-700 line-clamp-1 group-hover/c:text-purple-600 transition-colors">{s.name}</p>
                            {s.price && <p className="text-xs font-bold text-purple-600 mt-0.5">{s.price}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'SMM',              Icon: Smartphone,  color: 'text-purple-500', bg: 'bg-purple-50' },
                        { name: 'SEO',              Icon: Search,      color: 'text-blue-500',   bg: 'bg-blue-50'   },
                        { name: 'Брэнд дизайн',     Icon: Palette,     color: 'text-pink-500',   bg: 'bg-pink-50'   },
                        { name: 'Контент',          Icon: PenLine,     color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { name: 'Зар сурталчилгаа', Icon: Megaphone,   color: 'text-orange-500', bg: 'bg-orange-50' },
                        { name: 'Вэбсайт',          Icon: Globe,       color: 'text-sky-500',    bg: 'bg-sky-50'    },
                        { name: 'Видео',             Icon: Video,       color: 'text-rose-500',   bg: 'bg-rose-50'   },
                        { name: 'Бусад',             Icon: Sparkles,    color: 'text-gray-500',   bg: 'bg-gray-50'   },
                      ].map(({ name, Icon, color, bg }) => (
                        <Link key={name} to="/biz-marketing" onClick={() => setActiveMenu(null)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 group">
                          <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center ${bg}`}>
                            <Icon size={16} className={color} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">{name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ҮНИЙН САНАЛ ── */}
            {activeMenu === 'quotation' && (
              <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
                {/* Зүүн: Cover */}
                <div className="w-48 flex-shrink-0 flex flex-col gap-3">
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-orange-500 to-yellow-400 h-36">
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <p className="text-white text-xs font-medium opacity-80">Хямд, хурдан</p>
                      <p className="text-white text-lg font-bold leading-tight">Үнийн санал</p>
                    </div>
                  </div>
                  <Link to="/contact" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg text-center transition-colors duration-200">
                    Мессеж илгээх
                  </Link>
                  <Link to="/quotation" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg text-center border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    Үнийн санал авах
                  </Link>
                </div>
                {/* Баруун: Картууд */}
                <div className="flex-1 grid grid-cols-3 gap-3 content-start">
                  {[
                    { title: 'Хэвлэлийн үнийн санал', desc: 'Ном, каталог, флаер, баннер болон бусад хэвлэлийн бүтээгдэхүүн', Icon: FileText,  iconColor: 'text-blue-500',   iconBg: 'bg-blue-50',   accent: 'hover:border-blue-300 hover:bg-blue-50' },
                    { title: 'Маркетингийн үнийн санал', desc: 'SEO, SMM, брэнд дизайн, контент маркетинг',                        Icon: Megaphone, iconColor: 'text-purple-500', iconBg: 'bg-purple-50', accent: 'hover:border-purple-300 hover:bg-purple-50' },
                    { title: 'Тусгай захиалга',          desc: 'Өвөрмөц болон том хэмжээний захиалгын ажлууд',                     Icon: Sparkles,  iconColor: 'text-orange-500', iconBg: 'bg-orange-50', accent: 'hover:border-orange-300 hover:bg-orange-50' },
                  ].map(({ title, desc, Icon, iconColor, iconBg, accent }) => (
                    <Link key={title} to="/quotation" onClick={() => setActiveMenu(null)}
                      className={`p-4 rounded-xl border border-gray-100 transition-all duration-200 ${accent}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
                        <Icon size={18} className={iconColor} />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mt-2">{title}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
                    </Link>
                  ))}
                  <div className="col-span-3 flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 mt-1">
                    <Phone size={14} className="text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-800">+976 7200-0444</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> Да–Ба 09:00–18:00</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── БИДНИЙ ТУХАЙ ── */}
            {activeMenu === 'about' && (
              <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
                {/* Зүүн: Cover */}
                <div className="w-48 flex-shrink-0 flex flex-col gap-3">
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-500 h-36">
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <p className="text-white text-xs font-medium opacity-80">15+ жил</p>
                      <p className="text-white text-lg font-bold leading-tight">BIZ PRINT PRO</p>
                    </div>
                  </div>
                  <Link to="/contact" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg text-center transition-colors duration-200">
                    Мессеж илгээх
                  </Link>
                  <Link to="/quotation" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg text-center border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    Үнийн санал авах
                  </Link>
                </div>
                {/* Баруун: Links grid */}
                <div className="flex-1 grid grid-cols-2 gap-3 content-start">
                  {[
                    { title: 'Манай тухай',           desc: 'Компанийн түүх, алсын харагдлага',  link: '/about',         Icon: BookOpen,  color: 'text-blue-500',   bg: 'bg-blue-50'   },
                    { title: 'Манай баг',              desc: 'Мэргэжлийн туршлагатай хамт олон',  link: '/about',         Icon: User,      color: 'text-violet-500', bg: 'bg-violet-50' },
                    { title: 'Хэвлэлийн үйлчилгээ',   desc: 'Ном, каталог, баннер болон бусад',  link: '/biz-print',     Icon: FileText,  color: 'text-sky-500',    bg: 'bg-sky-50'    },
                    { title: 'Маркетингийн үйлчилгээ', desc: 'Брэнд, SMM, SEO, контент',          link: '/biz-marketing', Icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-50' },
                  ].map(({ title, desc, link, Icon, color, bg }) => (
                    <Link key={title} to={link} onClick={() => setActiveMenu(null)}
                      className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group">
                      <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center mt-0.5 ${bg}`}>
                        <Icon size={15} className={color} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 flex gap-6 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 mt-1">
                    {[['15+', 'Жилийн туршлага'], ['10,000+', 'Үйлчлүүлэгч'], ['100%', 'Чанарын баталгаа']].map(([n, l]) => (
                      <div key={n}>
                        <p className="text-base font-bold text-blue-600">{n}</p>
                        <p className="text-xs text-gray-500">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── ХОЛБОО БАРИХ ── */}
            {activeMenu === 'contact' && (
              <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
                {/* Зүүн: Cover */}
                <div className="w-48 flex-shrink-0 flex flex-col gap-3">
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-400 h-36">
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <p className="text-white text-xs font-medium opacity-80">Шуурхай</p>
                      <p className="text-white text-lg font-bold leading-tight">Холбоо барих</p>
                    </div>
                  </div>
                  <Link to="/contact" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg text-center transition-colors duration-200">
                    Мессеж илгээх
                  </Link>
                  <Link to="/quotation" onClick={() => setActiveMenu(null)}
                    className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg text-center border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    Үнийн санал авах
                  </Link>
                </div>
                {/* Баруун: Contact cards */}
                <div className="flex-1 grid grid-cols-2 gap-3 content-start">
                  {[
                    { icon: <Phone size={18} className="text-blue-600" />, label: 'Утас', value: '+976 7200-0444', bg: 'bg-blue-50 border-blue-100 hover:border-blue-300' },
                    { icon: <Mail size={18} className="text-purple-600" />, label: 'И-мэйл', value: 'bizprintpro@gmail.com', bg: 'bg-purple-50 border-purple-100 hover:border-purple-300' },
                    { icon: <MapPin size={18} className="text-red-500" />, label: 'Хаяг', value: 'СБД, B Center 505 тоот', bg: 'bg-red-50 border-red-100 hover:border-red-300' },
                    { icon: <Clock size={18} className="text-green-600" />, label: 'Ажлын цаг', value: 'Да–Ба 09:00–18:00', bg: 'bg-green-50 border-green-100 hover:border-green-300' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${item.bg}`}>
                      <div className="flex-shrink-0">{item.icon}</div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-72 h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Цэс</span>
              <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            <nav className="p-3 space-y-0.5">
              {[['/', 'Эхлэл'], ['/biz-print', 'Biz Print'], ['/biz-marketing', 'Biz Marketing'],
                ['/quotation', 'Үнийн санал'], ['/about', 'Бидний тухай'], ['/contact', 'Холбоо барих']
              ].map(([to, label]) => (
                <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  {label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">Профайл</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">Админ</Link>}
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-gray-100">Гарах</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100">Нэвтрэх</Link>
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