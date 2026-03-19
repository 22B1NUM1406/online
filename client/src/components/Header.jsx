import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Menu, X, Mail,
  ChevronDown, User, Home, Heart, LogOut, Settings,
  MapPin, Clock, ArrowRight
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
        .then(d => setPrintProducts((d.data || []).slice(0, 4)))
        .catch(() => {})
        .finally(() => setLoadingPrint(false));
    }
    if (menu === 'marketing' && marketingServices.length === 0) {
      setLoadingMarketing(true);
      getMarketingServices({})
        .then(d => setMarketingServices((d.data || []).slice(0, 4)))
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

  const SkeletonGrid = () => (
    <div className="grid grid-cols-4 gap-3 p-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden border border-gray-100">
          <div className="aspect-square bg-gray-100 animate-pulse" />
          <div className="p-2.5 space-y-1.5">
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

              <NavItem id="print"     to="/biz-print"     label="Biz Print" />
              <NavItem id="marketing" to="/biz-marketing"  label="Biz Marketing" color="purple" />
              <NavItem id="quotation" to="/quotation"      label="Үнийн санал" />
              <NavItem id="about"     to="/about"          label="Бидний тухай" />
              <NavItem id="contact"   to="/contact"        label="Холбоо барих" />

            </nav>
          </div>

          {/* ════ DROPDOWNS ════ */}
          {activeMenu && (
            <div
              className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-40"
              style={{ top: '100%' }}
              onMouseEnter={() => clearTimeout(hideTimer.current)}
              onMouseLeave={hide}
            >

              {/* ── BIZ PRINT ── */}
              {activeMenu === 'print' && (
                <div className="max-w-7xl mx-auto px-6 py-5">
                  {loadingPrint ? <SkeletonGrid /> : (
                    <>
                      <div className="grid grid-cols-4 gap-4">
                        {printProducts.map(p => (
                          <Link
                            key={p._id}
                            to={`/products/${p._id}`}
                            onClick={() => setActiveMenu(null)}
                            className="group/c rounded-lg border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all bg-white"
                          >
                            <div className="aspect-square bg-gray-50 overflow-hidden p-3">
                              <img
                                src={getImageUrl(p.image)}
                                alt={p.name}
                                className="w-full h-full object-contain group-hover/c:scale-105 transition-transform duration-300"
                                onError={e => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                              />
                            </div>
                            <div className="p-3 border-t border-gray-100">
                              <p className="text-xs font-semibold text-gray-800 line-clamp-2 min-h-[32px] group-hover/c:text-blue-600 transition-colors">{p.name}</p>
                              <div className="mt-1.5">
                                {p.discount ? (
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-bold text-red-600">{formatPrice(p.price * (1 - p.discount / 100))}₮</span>
                                    <span className="text-xs text-gray-400 line-through">{formatPrice(p.price)}₮</span>
                                  </div>
                                ) : (
                                  <span className="text-sm font-bold text-gray-900">{formatPrice(p.price)}₮</span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Хэвлэлийн бүтээгдэхүүн</span>
                        <Link
                          to="/biz-print"
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Бүгдийг үзэх <ArrowRight size={14} />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── BIZ MARKETING ── */}
              {activeMenu === 'marketing' && (
                <div className="max-w-7xl mx-auto px-6 py-5">
                  {loadingMarketing ? <SkeletonGrid /> : (
                    <>
                      <div className="grid grid-cols-4 gap-4">
                        {marketingServices.map(s => (
                          <Link
                            key={s._id}
                            to={`/services/${s.slug}`}
                            onClick={() => setActiveMenu(null)}
                            className="group/c rounded-lg border border-gray-200 overflow-hidden hover:border-purple-400 hover:shadow-md transition-all bg-white"
                          >
                            <div className="h-32 bg-gray-50 overflow-hidden">
                              {s.image ? (
                                <img
                                  src={getImageUrl(s.image)}
                                  alt={s.name}
                                  className="w-full h-full object-cover group-hover/c:scale-105 transition-transform duration-300"
                                  onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=Service'; }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50" />
                              )}
                            </div>
                            <div className="p-3 border-t border-gray-100">
                              <p className="text-xs font-semibold text-gray-800 line-clamp-2 min-h-[32px] group-hover/c:text-purple-600 transition-colors">{s.name}</p>
                              {s.shortDescription && (
                                <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">{s.shortDescription}</p>
                              )}
                              {s.price && <p className="text-sm font-bold text-purple-600 mt-1.5">{s.price}</p>}
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Дижитал маркетинг</span>
                        <Link
                          to="/biz-marketing"
                          onClick={() => setActiveMenu(null)}
                          className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Бүгдийг үзэх <ArrowRight size={14} />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── ҮНИЙН САНАЛ ── */}
              {activeMenu === 'quotation' && (
                <div className="max-w-7xl mx-auto px-6 py-5">
                  <div className="flex gap-4">
                    {[
                      { title: 'Хэвлэлийн үнийн санал', desc: 'Ном, каталог, флаер, баннер', accent: 'border-blue-500 bg-blue-50 hover:bg-blue-100' },
                      { title: 'Маркетингийн үнийн санал', desc: 'SEO, SMM, брэнд дизайн', accent: 'border-purple-500 bg-purple-50 hover:bg-purple-100' },
                      { title: 'Тусгай захиалга', desc: 'Өвөрмөц болон том хэмжээний ажил', accent: 'border-orange-500 bg-orange-50 hover:bg-orange-100' },
                    ].map((item, i) => (
                      <Link
                        key={i}
                        to="/quotation"
                        onClick={() => setActiveMenu(null)}
                        className={`flex-1 p-4 rounded-lg border-l-4 transition-colors ${item.accent}`}
                      >
                        <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      </Link>
                    ))}
                    <div className="w-56 flex-shrink-0 bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Шуурхай холбогдох</p>
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5"><Phone size={13} className="text-blue-500" /> +976 7200-0444</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5"><Clock size={12} className="text-gray-400" /> Да–Ба 09:00–18:00</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── БИДНИЙ ТУХАЙ ── */}
              {activeMenu === 'about' && (
                <div className="max-w-7xl mx-auto px-6 py-5">
                  <div className="flex gap-6">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      {[
                        { title: 'Манай тухай', desc: 'Компанийн түүх, алсын харагдлага', link: '/about' },
                        { title: 'Манай баг', desc: 'Мэргэжлийн туршлагатай хамт олон', link: '/about' },
                        { title: 'Хэвлэлийн үйлчилгээ', desc: 'Ном, каталог, баннер болон бусад', link: '/biz-print' },
                        { title: 'Маркетингийн үйлчилгээ', desc: 'Брэнд, SMM, SEO, контент', link: '/biz-marketing' },
                      ].map((item, i) => (
                        <Link
                          key={i}
                          to={item.link}
                          onClick={() => setActiveMenu(null)}
                          className="p-3.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                          <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                    <div className="w-52 flex-shrink-0 border-l border-gray-100 pl-6 flex flex-col justify-center gap-3">
                      {[['15+', 'Жилийн туршлага'], ['10,000+', 'Үйлчлүүлэгч'], ['100%', 'Чанарын баталгаа']].map(([n, l]) => (
                        <div key={n}>
                          <p className="text-lg font-bold text-blue-600">{n}</p>
                          <p className="text-xs text-gray-500">{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ХОЛБОО БАРИХ ── */}
              {activeMenu === 'contact' && (
                <div className="max-w-7xl mx-auto px-6 py-5">
                  <div className="flex gap-4">
                    {[
                      { icon: <Phone size={16} className="text-blue-600" />, label: 'Утас', value: '+976 7200-0444', bg: 'bg-blue-50 border-blue-100' },
                      { icon: <Mail size={16} className="text-purple-600" />, label: 'И-мэйл', value: 'bizprintpro@gmail.com', bg: 'bg-purple-50 border-purple-100' },
                      { icon: <MapPin size={16} className="text-red-500" />, label: 'Хаяг', value: 'СБД, B Center 505 тоот', bg: 'bg-red-50 border-red-100' },
                      { icon: <Clock size={16} className="text-green-600" />, label: 'Ажлын цаг', value: 'Да–Ба 09:00–18:00', bg: 'bg-green-50 border-green-100' },
                    ].map((item, i) => (
                      <div key={i} className={`flex-1 flex items-start gap-3 p-4 rounded-lg border ${item.bg}`}>
                        <div className="mt-0.5">{item.icon}</div>
                        <div>
                          <p className="text-[11px] text-gray-400 font-medium">{item.label}</p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-2 justify-center flex-shrink-0">
                      <Link to="/contact" onClick={() => setActiveMenu(null)}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
                        Мессеж илгээх
                      </Link>
                      <Link to="/quotation" onClick={() => setActiveMenu(null)}
                        className="px-5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 transition-colors whitespace-nowrap text-center">
                        Үнийн санал авах
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
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