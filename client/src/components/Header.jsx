import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Menu, X, Mail,
  ChevronDown, User, Home, Heart, LogOut, Settings,
  MapPin, Clock, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { getProducts, getMarketingServices, getCategories } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'print' | 'marketing' | 'quotation' | 'about' | 'contact'

  const [printProducts, setPrintProducts] = useState([]);
  const [printCategories, setPrintCategories] = useState([]);
  const [marketingServices, setMarketingServices] = useState([]);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [loadingMarketing, setLoadingMarketing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const navRef = useRef(null);
  const hideTimer = useRef(null);

  const handleMouseEnter = (menu) => {
    clearTimeout(hideTimer.current);
    setActiveMenu(menu);
    if (menu === 'print' && printProducts.length === 0) loadPrintData();
    if (menu === 'marketing' && marketingServices.length === 0) loadMarketingData();
  };

  const handleMouseLeave = () => {
    hideTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const loadPrintData = async () => {
    try {
      setLoadingPrint(true);
      const [prodData, catData] = await Promise.all([
        getProducts({}),
        getCategories()
      ]);
      setPrintProducts((prodData.data || []).slice(0, 8));
      setPrintCategories(catData.data || []);
      if (catData.data?.length > 0) setActiveCategory(catData.data[0]._id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPrint(false);
    }
  };

  const loadMarketingData = async () => {
    try {
      setLoadingMarketing(true);
      const data = await getMarketingServices({});
      setMarketingServices((data.data || []).slice(0, 8));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMarketing(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  // filtered products by active category
  const filteredProducts = activeCategory
    ? printProducts.filter(p => {
        const allCats = printCategories.flatMap(c => [c, ...(c.subcategories || [])]);
        const cat = allCats.find(c => c._id === activeCategory);
        return cat ? (p.category === cat.slug || p.category === cat.name) : true;
      })
    : printProducts;

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : printProducts;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200 text-black py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Phone size={13} />
                <span>+976 7200-0444</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-gray-600">
                <Mail size={13} />
                <span>bizprintpro@gmail.com</span>
              </div>
            </div>
            <span className="text-gray-500">Ажлын цаг: Даваа–Баасан 09:00–18:00</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="leading-tight">
                <div className="text-base font-bold text-gray-900 tracking-tight">BIZ PRINT PRO</div>
                <div className="text-[11px] text-gray-400 font-normal">Хэвлэлийн компани</div>
              </div>
            </Link>

            {/* Right */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                  <User size={17} />
                  <span className="font-medium">{isAuthenticated ? user?.name : 'Нэвтрэх'}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {!isAuthenticated ? (
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                        <User size={16} /> Нэвтрэх / Бүртгүүлэх
                      </Link>
                    ) : (
                      <>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                          <User size={16} /> Профайл
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                            <Settings size={16} /> Админ самбар
                          </Link>
                        )}
                        <div className="my-1 border-t border-gray-100" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-red-500">
                          <LogOut size={16} /> Гарах
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link to="/wishlist" className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors relative">
                <div className="relative">
                  <Heart size={17} className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">{wishlist.length}</span>
                  )}
                </div>
                <span className="font-medium">Хадгалсан</span>
              </Link>

              <Link to="/cart" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors relative">
                <div className="relative">
                  <ShoppingCart size={17} />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold animate-pulse">{getCartCount()}</span>
                  )}
                </div>
                <span className="hidden md:block font-medium">Сагс</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Nav Bar ── */}
        <div className="border-t border-gray-100" ref={navRef} onMouseLeave={handleMouseLeave}>
          <div className="max-w-7xl mx-auto px-6">
            <nav className="hidden md:flex items-center gap-1 h-11">

              <Link to="/" className="flex items-center gap-1.5 px-3 h-full text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                <Home size={15} /> Эхлэл
              </Link>

              {/* Biz Print trigger */}
              <div className="relative h-full flex items-center" onMouseEnter={() => handleMouseEnter('print')}>
                <Link to="/biz-print"
                  className={`flex items-center gap-1 px-3 h-full text-sm font-semibold transition-colors border-b-2 ${activeMenu === 'print' ? 'text-blue-600 border-blue-600' : 'text-gray-700 border-transparent hover:text-blue-600'}`}>
                  Biz Print <ChevronDown size={14} className={`transition-transform ${activeMenu === 'print' ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              {/* Biz Marketing trigger */}
              <div className="relative h-full flex items-center" onMouseEnter={() => handleMouseEnter('marketing')}>
                <Link to="/biz-marketing"
                  className={`flex items-center gap-1 px-3 h-full text-sm font-semibold transition-colors border-b-2 ${activeMenu === 'marketing' ? 'text-purple-600 border-purple-600' : 'text-gray-700 border-transparent hover:text-purple-600'}`}>
                  Biz Marketing <ChevronDown size={14} className={`transition-transform ${activeMenu === 'marketing' ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              {/* Үнийн санал trigger */}
              <div className="relative h-full flex items-center" onMouseEnter={() => handleMouseEnter('quotation')}>
                <Link to="/quotation"
                  className={`flex items-center gap-1 px-3 h-full text-sm font-medium transition-colors border-b-2 ${activeMenu === 'quotation' ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}>
                  Үнийн санал <ChevronDown size={14} className={`transition-transform ${activeMenu === 'quotation' ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              {/* Бидний тухай trigger */}
              <div className="relative h-full flex items-center" onMouseEnter={() => handleMouseEnter('about')}>
                <Link to="/about"
                  className={`flex items-center gap-1 px-3 h-full text-sm font-medium transition-colors border-b-2 ${activeMenu === 'about' ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}>
                  Бидний тухай <ChevronDown size={14} className={`transition-transform ${activeMenu === 'about' ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              {/* Холбоо барих trigger */}
              <div className="relative h-full flex items-center" onMouseEnter={() => handleMouseEnter('contact')}>
                <Link to="/contact"
                  className={`flex items-center gap-1 px-3 h-full text-sm font-medium transition-colors border-b-2 ${activeMenu === 'contact' ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}>
                  Холбоо барих <ChevronDown size={14} className={`transition-transform ${activeMenu === 'contact' ? 'rotate-180' : ''}`} />
                </Link>
              </div>

            </nav>
          </div>

          {/* ════════════════════════════════════════════
              MEGA MENU PANEL — full width, under nav bar
              ════════════════════════════════════════════ */}
          {activeMenu && (
            <div
              className="absolute left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-40"
              style={{ top: '100%' }}
              onMouseEnter={() => clearTimeout(hideTimer.current)}
              onMouseLeave={handleMouseLeave}
            >
              {/* ── BIZ PRINT ── */}
              {activeMenu === 'print' && (
                <div className="max-w-7xl mx-auto px-6 py-6 flex gap-0" style={{ minHeight: '420px' }}>
                  {/* Left: category sidebar */}
                  <div className="w-56 flex-shrink-0 border-r border-gray-100 pr-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ангилал</p>
                    <div className="space-y-0.5">
                      <button
                        onMouseEnter={() => setActiveCategory(null)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${!activeCategory ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <span>Бүх бүтээгдэхүүн</span>
                        <ChevronDown size={13} className="rotate-[-90deg] opacity-50" />
                      </button>
                      {printCategories.map(cat => (
                        <button
                          key={cat._id}
                          onMouseEnter={() => setActiveCategory(cat._id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${activeCategory === cat._id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <span>{cat.name}</span>
                          <ChevronDown size={13} className="rotate-[-90deg] opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right: product grid */}
                  <div className="flex-1 pl-6">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                      {activeCategory
                        ? printCategories.flatMap(c => [c, ...(c.subcategories || [])]).find(c => c._id === activeCategory)?.name
                        : 'Бүх бүтээгдэхүүн'}
                    </p>
                    {loadingPrint ? (
                      <div className="grid grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="rounded-lg overflow-hidden border border-gray-100">
                            <div className="aspect-square bg-gray-100 animate-pulse" />
                            <div className="p-3 space-y-2">
                              <div className="h-3 bg-gray-100 rounded animate-pulse" />
                              <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-4">
                        {displayProducts.slice(0, 8).map(product => (
                          <Link key={product._id} to={`/products/${product._id}`} onClick={() => setActiveMenu(null)}
                            className="group/card rounded-lg border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all bg-white">
                            <div className="aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-3">
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-300"
                                onError={e => { e.target.src = 'https://via.placeholder.com/300x300?text=Product'; }}
                              />
                            </div>
                            <div className="p-3 border-t border-gray-100">
                              <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1.5 group-hover/card:text-blue-600 transition-colors min-h-[32px]">
                                {product.name}
                              </h4>
                              {product.discount ? (
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-sm font-bold text-red-600">{formatPrice(product.price * (1 - product.discount / 100))}₮</span>
                                  <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}₮</span>
                                </div>
                              ) : (
                                <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}₮</span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <Link to="/biz-print" onClick={() => setActiveMenu(null)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                        Бүх бүтээгдэхүүн үзэх →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* ── BIZ MARKETING ── */}
              {activeMenu === 'marketing' && (
                <div className="max-w-7xl mx-auto px-6 py-6" style={{ minHeight: '380px' }}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Biz Marketing</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Дижитал маркетингийн иж бүрэн шийдэл</p>
                    </div>
                    <Link to="/biz-marketing" onClick={() => setActiveMenu(null)}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      Бүгдийг үзэх →
                    </Link>
                  </div>
                  {loadingMarketing ? (
                    <div className="grid grid-cols-4 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-gray-100">
                          <div className="h-40 bg-gray-100 animate-pulse" />
                          <div className="p-3 space-y-2">
                            <div className="h-3 bg-gray-100 rounded animate-pulse" />
                            <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-4">
                      {marketingServices.slice(0, 8).map(service => (
                        <Link key={service._id} to={`/services/${service.slug}`} onClick={() => setActiveMenu(null)}
                          className="group/card rounded-lg border border-gray-200 overflow-hidden hover:border-purple-400 hover:shadow-md transition-all bg-white">
                          <div className="h-36 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden flex items-center justify-center">
                            {service.image ? (
                              <img
                                src={getImageUrl(service.image)}
                                alt={service.name}
                                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=Service'; }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <MessageSquare size={22} className="text-purple-500" />
                              </div>
                            )}
                          </div>
                          <div className="p-3 border-t border-gray-100">
                            <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1 group-hover/card:text-purple-600 transition-colors min-h-[32px]">
                              {service.name}
                            </h4>
                            {service.shortDescription && (
                              <p className="text-[11px] text-gray-400 line-clamp-2">{service.shortDescription}</p>
                            )}
                            {service.price && (
                              <p className="text-sm font-bold text-purple-600 mt-1.5">{service.price}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── ҮНИЙН САНАЛ ── */}
              {activeMenu === 'quotation' && (
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Үнийн санал авах</p>
                      <div className="space-y-2">
                        {[
                          { title: 'Хэвлэлийн үнийн санал', desc: 'Ном, каталог, флаер, баннер гэх мэт хэвлэлийн бүтээгдэхүүн', color: 'border-l-blue-500 bg-blue-50' },
                          { title: 'Маркетингийн үнийн санал', desc: 'SEO, SMM, брэнд дизайн, контент маркетинг', color: 'border-l-purple-500 bg-purple-50' },
                          { title: 'Тусгай захиалга', desc: 'Өвөрмөц дизайн, том хэмжээтэй болон онцгой төсөл', color: 'border-l-orange-500 bg-orange-50' },
                        ].map((item, i) => (
                          <Link key={i} to="/quotation" onClick={() => setActiveMenu(null)}
                            className={`block p-4 rounded-lg border-l-4 hover:shadow-sm transition-all ${item.color}`}>
                            <p className="text-sm font-semibold text-gray-800 mb-1">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Яаж ажилладаг вэ?</p>
                      <div className="space-y-4">
                        {[
                          ['01', 'Маягт бөглөх', 'Захиалгын дэлгэрэнгүй мэдээллийг оруулна'],
                          ['02', 'Үнийн санал хүлээх', '24 цагийн дотор и-мэйл эсвэл утсаар хариу'],
                          ['03', 'Захиалга батлах', 'Үнийг зөвшөөрч, урьдчилгаа төлбөр хийх'],
                          ['04', 'Хүлээж авах', 'Тохирсон хугацаанд бэлэн болгон хүргэнэ'],
                        ].map(([num, title, desc]) => (
                          <div key={num} className="flex gap-3">
                            <span className="w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0 flex items-center justify-center">{num}</span>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Холбоо барих</p>
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <p className="text-sm font-bold text-gray-800 mb-3">Шуурхай холбогдох</p>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5 text-sm text-gray-700">
                            <Phone size={15} className="text-blue-500 flex-shrink-0" />
                            <span>+976 7200-0444</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm text-gray-700">
                            <Mail size={15} className="text-blue-500 flex-shrink-0" />
                            <span>bizprintpro@gmail.com</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm text-gray-700">
                            <Clock size={15} className="text-blue-500 flex-shrink-0" />
                            <span>Да–Ба 09:00–18:00</span>
                          </div>
                        </div>
                        <Link to="/quotation" onClick={() => setActiveMenu(null)}
                          className="mt-4 flex items-center justify-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                          Үнийн санал илгээх
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── БИДНИЙ ТУХАЙ ── */}
              {activeMenu === 'about' && (
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Компанийн тухай</p>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">BIZ PRINT PRO</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">
                        2009 оноос хойш Монголын хэвлэлийн салбарт үйл ажиллагаа явуулж байгаа бид
                        өндөр чанартай хэвлэлийн үйлчилгээгээр олон мянган үйлчлүүлэгчдэд үйлчилдэг.
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {[['15+', 'Жилийн туршлага'], ['10,000+', 'Үйлчлүүлэгч'], ['100%', 'Чанарын баталгаа']].map(([num, label]) => (
                          <div key={num} className="text-center bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-base font-bold text-blue-600">{num}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Үйлчилгээнүүд</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { title: 'Хэвлэлийн үйлчилгээ', desc: 'Ном, каталог, флаер, баннер, нэрийн хуудас болон бусад хэвлэлийн бүтээгдэхүүн', link: '/biz-print', color: 'hover:border-blue-400 hover:bg-blue-50' },
                          { title: 'Маркетингийн үйлчилгээ', desc: 'Брэнд дизайн, SMM, SEO, контент маркетинг болон онлайн сурталчилгаа', link: '/biz-marketing', color: 'hover:border-purple-400 hover:bg-purple-50' },
                          { title: 'Дизайн ажил', desc: 'Лого, брэндийн дүр төрх, савлагааны дизайн, зар сурталчилгааны материал', link: '/biz-marketing', color: 'hover:border-green-400 hover:bg-green-50' },
                          { title: 'Тусгай захиалга', desc: 'Том хэмжээний хэвлэл, өвөрмөц дизайн, зөвлөх үйлчилгээ', link: '/quotation', color: 'hover:border-orange-400 hover:bg-orange-50' },
                        ].map((item, i) => (
                          <Link key={i} to={item.link} onClick={() => setActiveMenu(null)}
                            className={`p-4 rounded-lg border border-gray-200 transition-all ${item.color}`}>
                            <p className="text-sm font-semibold text-gray-800 mb-1">{item.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Link to="/about" onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Бидний тухай дэлгэрэнгүй →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ХОЛБОО БАРИХ ── */}
              {activeMenu === 'contact' && (
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <div className="grid grid-cols-4 gap-6">
                    {[
                      { icon: <Phone size={22} className="text-blue-600" />, label: 'Утас', value: '+976 7200-0444', sub: '+976 7200-0444', bg: 'bg-blue-50 border-blue-100' },
                      { icon: <Mail size={22} className="text-purple-600" />, label: 'И-мэйл', value: 'bizprintpro@gmail.com', sub: 'Ажлын цагт хариу өгнө', bg: 'bg-purple-50 border-purple-100' },
                      { icon: <MapPin size={22} className="text-red-500" />, label: 'Хаяг', value: 'СБД, B Center', sub: '9-р хороо, 505 тоот', bg: 'bg-red-50 border-red-100' },
                      { icon: <Clock size={22} className="text-green-600" />, label: 'Ажлын цаг', value: 'Даваа – Баасан', sub: '09:00 – 18:00', bg: 'bg-green-50 border-green-100' },
                    ].map((item, i) => (
                      <div key={i} className={`rounded-xl p-5 border ${item.bg}`}>
                        <div className="mb-3">{item.icon}</div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-sm font-bold text-gray-900">{item.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Link to="/contact" onClick={() => setActiveMenu(null)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                      Мессеж илгээх
                    </Link>
                    <Link to="/quotation" onClick={() => setActiveMenu(null)}
                      className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 transition-colors">
                      Үнийн санал авах
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold">Цэс</h2>
              <button onClick={() => setMobileMenuOpen(false)}><X size={22} /></button>
            </div>
            <nav className="p-4 space-y-1">
              {[
                { to: '/', label: 'Эхлэл' },
                { to: '/biz-print', label: 'Biz Print' },
                { to: '/biz-marketing', label: 'Biz Marketing' },
                { to: '/quotation', label: 'Үнийн санал' },
                { to: '/about', label: 'Бидний тухай' },
                { to: '/contact', label: 'Холбоо барих' },
              ].map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 hover:bg-gray-100 rounded-lg text-sm text-gray-700">Профайл</Link>
                    {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 hover:bg-gray-100 rounded-lg text-sm text-gray-700">Админ</Link>}
                    <button onClick={handleLogout} className="w-full text-left py-3 px-4 hover:bg-gray-100 rounded-lg text-sm text-red-500">Гарах</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 hover:bg-gray-100 rounded-lg text-sm text-gray-700">Нэвтрэх</Link>
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