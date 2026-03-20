import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Menu, X, Mail,
  ChevronDown, User, Home, Heart, LogOut, Settings,
  MapPin, Clock, ArrowRight,
  CreditCard, FileText, Image, BookOpen,
  Tag, Book, CalendarDays, Package,
  Smartphone, Search, Palette, PenLine,
  Megaphone, Globe, Video, Sparkles,
  Building2, Users, Printer,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { getProducts, getMarketingServices } from '../services/api';

/* ─── Статик subcategory тодорхойлолтууд ─── */
const PRINT_CATS = [
  { name: 'Визит карт',  Icon: CreditCard,   color: 'text-blue-500',   bg: 'bg-blue-50'   },
  { name: 'Флаер',       Icon: FileText,     color: 'text-sky-500',    bg: 'bg-sky-50'    },
  { name: 'Баннер',      Icon: Image,        color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { name: 'Каталог',     Icon: BookOpen,     color: 'text-violet-500', bg: 'bg-violet-50' },
  { name: 'Наклейк',     Icon: Tag,          color: 'text-pink-500',   bg: 'bg-pink-50'   },
  { name: 'Ном',         Icon: Book,         color: 'text-rose-500',   bg: 'bg-rose-50'   },
  { name: 'Хуанли',      Icon: CalendarDays, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Бусад',       Icon: Package,      color: 'text-gray-500',   bg: 'bg-gray-100'  },
];

const MARKETING_CATS = [
  { name: 'Сошиал медиа',      Icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Брэндинг',          Icon: Palette,    color: 'text-pink-500',   bg: 'bg-pink-50'   },
  { name: 'Сурталчилгаа',      Icon: Megaphone,  color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'SEO оптимизаци',    Icon: Search,     color: 'text-blue-500',   bg: 'bg-blue-50'   },
  { name: 'Контент маркетинг', Icon: PenLine,    color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { name: 'Имэйл маркетинг',   Icon: Mail,       color: 'text-sky-500',    bg: 'bg-sky-50'    },
  { name: 'Видео контент',     Icon: Video,      color: 'text-rose-500',   bg: 'bg-rose-50'   },
  { name: 'Вэбсайт',           Icon: Globe,      color: 'text-teal-500',   bg: 'bg-teal-50'   },
];

/* ─── Skeleton ─── */
const SkeletonRow = () => (
  <div className="grid grid-cols-2 gap-2.5">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded animate-pulse" />
          <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

/* ─── Featured зураг (баруун тал) ─── */
const FeaturedCard = ({ item, to, accent = 'blue' }) => {
  if (!item) return (
    <div className="w-52 flex-shrink-0 rounded-2xl bg-gray-100 animate-pulse h-56" />
  );
  const hasDiscount = item.discount > 0;
  const salePrice = hasDiscount ? item.price * (1 - item.discount / 100) : null;

  return (
    <Link
      to={to}
      className={`w-52 flex-shrink-0 rounded-2xl border overflow-hidden flex flex-col bg-white
        hover:shadow-lg transition-all duration-300 group
        ${accent === 'purple' ? 'border-purple-100 hover:border-purple-300' : 'border-blue-100 hover:border-blue-300'}`}
    >
      <div className="relative h-40 bg-gray-50 flex items-center justify-center p-3 overflow-hidden">
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
            -{item.discount}%
          </span>
        )}
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://via.placeholder.com/200x160?text=Product'; }}
        />
      </div>
      <div className="p-3 border-t border-gray-100 flex flex-col gap-1">
        <p className={`text-xs font-semibold line-clamp-2 leading-snug transition-colors
          ${accent === 'purple' ? 'text-gray-800 group-hover:text-purple-600' : 'text-gray-800 group-hover:text-blue-600'}`}>
          {item.name}
        </p>
        <div className="flex items-baseline gap-1.5 mt-1">
          {hasDiscount ? (
            <>
              <span className="text-sm font-bold text-red-600">{formatPrice(salePrice)}₮</span>
              <span className="text-[11px] text-gray-400 line-through">{formatPrice(item.price)}₮</span>
            </>
          ) : (
            <span className={`text-sm font-bold ${accent === 'purple' ? 'text-purple-600' : 'text-blue-600'}`}>
              {formatPrice(item.price)}₮
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ══════════════════════════════════════════ */
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
        .then(d => setPrintProducts((d.data || []).slice(0, 9)))
        .catch(() => {})
        .finally(() => setLoadingPrint(false));
    }
    if (menu === 'marketing' && marketingServices.length === 0) {
      setLoadingMarketing(true);
      getMarketingServices({})
        .then(d => setMarketingServices((d.data || []).slice(0, 9)))
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

  const NavItem = ({ id, to, label, color = 'blue' }) => (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => show(id)}
      onMouseLeave={hide}
    >
      <Link
        to={to}
        className={`flex items-center gap-1 px-3 h-full text-sm font-medium transition-colors border-b-2 whitespace-nowrap
          ${activeMenu === id
            ? color === 'purple' ? 'text-purple-600 border-purple-500' : 'text-blue-600 border-blue-500'
            : 'text-gray-700 border-transparent hover:text-gray-900'
          }`}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${activeMenu === id ? 'rotate-180' : ''}`} />
      </Link>
    </div>
  );

  /* ── "Бүгдийг үзэх" only — CTA товч байхгүй ── */
  const DropFooter = ({ viewTo, viewLabel, color = 'blue' }) => (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <Link
        to={viewTo}
        onClick={() => setActiveMenu(null)}
        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors
          ${color === 'purple' ? 'text-purple-600 hover:text-purple-700' : 'text-blue-600 hover:text-blue-700'}`}
      >
        {viewLabel} <ArrowRight size={14} />
      </Link>
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

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-base">B</span>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 leading-none">BIZ PRINT PRO</div>
              <div className="text-[10px] text-gray-400 leading-none mt-0.5">Хэвлэлийн компани</div>
            </div>
          </Link>

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
              <Link to="/" className="flex items-center gap-1.5 px-3 h-full text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-colors whitespace-nowrap">
                <Home size={14} /> Эхлэл
              </Link>
              <NavItem id="print"     to="/biz-print"    label="Biz Print" />
              <NavItem id="marketing" to="/biz-marketing" label="Biz Marketing" color="purple" />
              <NavItem id="quotation" to="/quotation"     label="Үнийн санал" />
              <NavItem id="about"     to="/about"         label="Бидний тухай" />
              <NavItem id="contact"   to="/contact"       label="Холбоо барих" />
            </nav>
          </div>

          {/* ════════════════ DROPDOWNS ════════════════ */}
          {activeMenu && (
            <div
              className="absolute left-0 right-0 bg-white border-t border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.08)] z-40"
              style={{ top: '100%' }}
              onMouseEnter={() => clearTimeout(hideTimer.current)}
              onMouseLeave={hide}
            >
              <div className="max-w-6xl mx-auto">

              {/* ── BIZ PRINT ── */}
              {activeMenu === 'print' && (
                <div className="px-8 py-6 flex gap-10">
                  <div className="flex-1 min-w-0">
                    {/* Icon grid — томруулсан */}
                    {loadingPrint ? (
                      <div className="grid grid-cols-5 gap-4 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-20 h-16 bg-gray-100 rounded-xl animate-pulse" />
                            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-3 mb-6">
                        {(printProducts.length >= 2
                          ? printProducts.slice(1, 6)
                          : PRINT_CATS.slice(0, 5).map(c => ({ _id: c.name, name: c.name, image: null, isStatic: true, Icon: c.Icon, color: c.color }))
                        ).map((item) => (
                          <Link
                            key={item._id}
                            to={item.isStatic ? '/biz-print' : `/products/${item._id}`}
                            onClick={() => setActiveMenu(null)}
                            className="flex flex-col items-center gap-2.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-full h-16 flex items-center justify-center">
                              {item.isStatic ? (
                                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                                  <item.Icon size={26} className={item.color} />
                                </div>
                              ) : item.image ? (
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                  className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                                  <FileText size={26} className="text-blue-400" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-medium text-gray-600 text-center line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1 h-7 bg-blue-600 rounded-full" />
                        <span className="text-xl font-bold text-gray-900">Biz Print</span>
                      </div>
                      <Link to="/biz-print" onClick={() => setActiveMenu(null)}
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-4 py-1.5 rounded-lg transition-colors">
                        Бүгдийг үзэх <ArrowRight size={14} />
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-x-7 gap-y-2.5">
                      {(printProducts.length >= 7
                        ? printProducts.slice(6, 10)
                        : PRINT_CATS.slice(5)
                      ).map((item) => (
                        <Link
                          key={item._id ?? item.name}
                          to={item._id && !item.isStatic ? `/products/${item._id}` : '/biz-print'}
                          onClick={() => setActiveMenu(null)}
                          className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Баруун: cover зураг — томруулсан */}
                  <div className="w-72 flex-shrink-0">
                    {printProducts[0] ? (
                      <Link to={`/products/${printProducts[0]._id}`} onClick={() => setActiveMenu(null)}
                        className="block w-full rounded-2xl overflow-hidden group">
                        <img
                          src={getImageUrl(printProducts[0].image)}
                          alt={printProducts[0].name}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ height: '240px' }}
                          onError={e => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center" style={{ height: '240px', display: 'none' }}>
                          <Printer size={56} className="text-blue-400" />
                        </div>
                      </Link>
                    ) : (
                      <div className="w-full rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center" style={{ height: '240px' }}>
                        <Printer size={56} className="text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── BIZ MARKETING ── */}
              {activeMenu === 'marketing' && (
                <div className="px-8 py-6 flex gap-10">
                  <div className="flex-1 min-w-0">
                    {loadingMarketing ? (
                      <div className="grid grid-cols-5 gap-4 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex flex-col items-center gap-2">
                            <div className="w-20 h-16 bg-gray-100 rounded-xl animate-pulse" />
                            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-3 mb-6">
                        {(marketingServices.length >= 2
                          ? marketingServices.slice(1, 6)
                          : MARKETING_CATS.slice(0, 5).map(c => ({ _id: c.name, name: c.name, image: null, isStatic: true, Icon: c.Icon, color: c.color }))
                        ).map((item) => (
                          <Link
                            key={item._id}
                            to={item.isStatic ? '/biz-marketing' : `/services/${item.slug}`}
                            onClick={() => setActiveMenu(null)}
                            className="flex flex-col items-center gap-2.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-full h-16 flex items-center justify-center">
                              {item.isStatic ? (
                                <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
                                  <item.Icon size={26} className={item.color} />
                                </div>
                              ) : item.image ? (
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                  className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
                                  <Megaphone size={26} className="text-purple-400" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-medium text-gray-600 text-center line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1 h-7 bg-purple-600 rounded-full" />
                        <span className="text-xl font-bold text-gray-900">Biz Marketing</span>
                      </div>
                      <Link to="/biz-marketing" onClick={() => setActiveMenu(null)}
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-600 border border-gray-200 hover:border-purple-300 px-4 py-1.5 rounded-lg transition-colors">
                        Бүгдийг үзэх <ArrowRight size={14} />
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-x-7 gap-y-2.5">
                      {(marketingServices.length >= 7
                        ? marketingServices.slice(6, 10)
                        : MARKETING_CATS.slice(5)
                      ).map((item) => (
                        <Link
                          key={item._id ?? item.name}
                          to={item._id && !item.isStatic ? `/services/${item.slug}` : '/biz-marketing'}
                          onClick={() => setActiveMenu(null)}
                          className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Баруун: cover зураг */}
                  <div className="w-72 flex-shrink-0">
                    {marketingServices[0] ? (
                      <Link to={`/services/${marketingServices[0].slug}`} onClick={() => setActiveMenu(null)}
                        className="block w-full rounded-2xl overflow-hidden group">
                        <img
                          src={getImageUrl(marketingServices[0].image)}
                          alt={marketingServices[0].name}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ height: '240px' }}
                          onError={e => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full rounded-2xl bg-gradient-to-br from-purple-100 to-pink-200 items-center justify-center" style={{ height: '240px', display: 'none' }}>
                          <Megaphone size={56} className="text-purple-400" />
                        </div>
                      </Link>
                    ) : (
                      <div className="w-full rounded-2xl bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center" style={{ height: '240px' }}>
                        <Megaphone size={56} className="text-purple-400" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── ҮНИЙН САНАЛ ── */}
              {activeMenu === 'quotation' && (
                <div className="px-6 py-5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Үнийн санал авах</p>
                  <div className="flex gap-3">
                    {[
                      { title: 'Хэвлэлийн үнийн санал',   desc: 'Ном, каталог, флаер, баннер',  Icon: FileText,  iColor: 'text-blue-500',   iBg: 'bg-blue-50',   hover: 'hover:border-blue-200 hover:bg-blue-50'   },
                      { title: 'Маркетингийн үнийн санал', desc: 'SEO, SMM, брэнд дизайн',       Icon: Megaphone, iColor: 'text-purple-500', iBg: 'bg-purple-50', hover: 'hover:border-purple-200 hover:bg-purple-50' },
                      { title: 'Тусгай захиалга',          desc: 'Өвөрмөц, том хэмжээний ажил', Icon: Sparkles,  iColor: 'text-orange-500', iBg: 'bg-orange-50', hover: 'hover:border-orange-200 hover:bg-orange-50' },
                    ].map(({ title, desc, Icon, iColor, iBg, hover }) => (
                      <Link key={title} to="/quotation" onClick={() => setActiveMenu(null)}
                        className={`flex-1 flex items-start gap-3 p-4 rounded-xl border border-gray-100 transition-all duration-200 ${hover}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iBg}`}>
                          <Icon size={18} className={iColor} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="w-44 flex-shrink-0 bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center gap-2">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Холбоо барих</p>
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                        <Phone size={13} className="text-blue-500" /> +976 7200-0444
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" /> Да–Ба 09:00–18:00
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── БИДНИЙ ТУХАЙ ── */}
              {activeMenu === 'about' && (
                <div className="px-6 py-5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Бидний тухай</p>
                  <div className="grid grid-cols-2 gap-2 max-w-lg">
                    {[
                      { title: 'Манай тухай',           desc: 'Компанийн түүх, алсын харагдлага',  link: '/about',         Icon: Building2, color: 'text-blue-500',   bg: 'bg-blue-50'   },
                      { title: 'Манай баг',              desc: 'Мэргэжлийн туршлагатай хамт олон',  link: '/about',         Icon: Users,     color: 'text-violet-500', bg: 'bg-violet-50' },
                      { title: 'Хэвлэлийн үйлчилгээ',   desc: 'Ном, каталог, баннер болон бусад',  link: '/biz-print',     Icon: Printer,   color: 'text-sky-500',    bg: 'bg-sky-50'    },
                      { title: 'Маркетингийн үйлчилгээ', desc: 'Брэнд, SMM, SEO, контент',          link: '/biz-marketing', Icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-50' },
                    ].map(({ title, desc, link, Icon, color, bg }) => (
                      <Link key={title} to={link} onClick={() => setActiveMenu(null)}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group">
                        <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center mt-0.5 ${bg}`}>
                          <Icon size={15} className={color} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-6">
                    {[['15+', 'Жилийн туршлага'], ['10,000+', 'Үйлчлүүлэгч'], ['100%', 'Чанарын баталгаа']].map(([n, l]) => (
                      <div key={n}>
                        <p className="text-base font-bold text-blue-600">{n}</p>
                        <p className="text-[11px] text-gray-400">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ХОЛБОО БАРИХ ── */}
              {activeMenu === 'contact' && (
                <div className="px-6 py-5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Холбоо барих</p>
                  <div className="flex gap-3">
                    {[
                      { Icon: Phone,  label: 'Утас',      value: '+976 7200-0444',        bg: 'bg-blue-50   border-blue-100',   iColor: 'text-blue-600'   },
                      { Icon: Mail,   label: 'И-мэйл',    value: 'bizprintpro@gmail.com', bg: 'bg-purple-50 border-purple-100', iColor: 'text-purple-600' },
                      { Icon: MapPin, label: 'Хаяг',      value: 'СБД, B Center 505 тоот', bg: 'bg-red-50   border-red-100',   iColor: 'text-red-500'    },
                      { Icon: Clock,  label: 'Ажлын цаг', value: 'Да–Ба 09:00–18:00',     bg: 'bg-green-50  border-green-100', iColor: 'text-green-600'  },
                    ].map(({ Icon, label, value, bg, iColor }) => (
                      <div key={label} className={`flex-1 flex items-center gap-3 p-4 rounded-xl border ${bg}`}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white flex-shrink-0">
                          <Icon size={16} className={iColor} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 font-medium">{label}</p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2 justify-center flex-shrink-0">
                      <Link to="/contact" onClick={() => setActiveMenu(null)}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors text-center whitespace-nowrap">
                        Мессеж илгээх
                      </Link>
                      <Link to="/quotation" onClick={() => setActiveMenu(null)}
                        className="px-5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors text-center whitespace-nowrap">
                        Үнийн санал авах
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            </div>{/* /max-w-5xl */}
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile menu ── */}
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