import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Phone, Search, Menu, X, Mail,
  ChevronDown, User, Home, Heart, LogOut, Settings,
  Printer, Megaphone, BookOpen, FileText, Image, Layout,
  TrendingUp, CheckCircle, Star, Target, Globe,
  MessageSquare, MapPin, Clock, ArrowRight,
  Award, Users, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleMobileSection = (key) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const bizPrintItems = [
    { icon: <BookOpen size={28} />, title: 'Ном, сурах бичиг', desc: 'Сургалтын материал', color: 'bg-blue-50 text-blue-600' },
    { icon: <FileText size={28} />, title: 'Оффисын хэвлэл', desc: 'Бичиг баримт, хуудас', color: 'bg-purple-50 text-purple-600' },
    { icon: <Megaphone size={28} />, title: 'Сурталчилгаа', desc: 'Зар, флаер, каталог', color: 'bg-orange-50 text-orange-600' },
    { icon: <Layout size={28} />, title: 'Баннер', desc: 'Томоохон хэвлэл', color: 'bg-green-50 text-green-600' },
    { icon: <Image size={28} />, title: 'Нэрийн хуудас', desc: 'Бизнесийн карт', color: 'bg-pink-50 text-pink-600' },
    { icon: <Printer size={28} />, title: 'Тусгай захиалга', desc: 'Өвөрмөц шийдэл', color: 'bg-cyan-50 text-cyan-600' },
  ];

  const bizMarketingItems = [
    { icon: <Globe size={28} />, title: 'Брэнд дизайн', desc: 'Лого, фирм загвар', color: 'bg-purple-50 text-purple-600' },
    { icon: <TrendingUp size={28} />, title: 'Сошиал медиа', desc: 'SMM үйлчилгээ', color: 'bg-blue-50 text-blue-600' },
    { icon: <Star size={28} />, title: 'Контент', desc: 'Агуулга бүтээх', color: 'bg-yellow-50 text-yellow-600' },
    { icon: <Target size={28} />, title: 'Зар сурталчилгаа', desc: 'Онлайн маркетинг', color: 'bg-red-50 text-red-600' },
    { icon: <Search size={28} />, title: 'SEO', desc: 'Хайлтын оновчлол', color: 'bg-green-50 text-green-600' },
    { icon: <CheckCircle size={28} />, title: 'Зөвлөх', desc: 'Стратеги, дүн шинжилгээ', color: 'bg-indigo-50 text-indigo-600' },
  ];

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

        {/* Navigation */}
        <nav className="hidden md:block text-black border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2">

              {/* Эхлэл */}
              <Link to="/" className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg text-sm">
                <Home size={16} />
                Эхлэл
              </Link>

              {/* ── BIZ PRINT MEGA MENU ── */}
              <div className="relative group">
                <Link
                  to="/biz-print"
                  className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg text-sm"
                >
                  Biz Print
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {/* Mega Dropdown */}
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '720px' }}>
                    {/* Header strip */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg">Biz Print</h3>
                        <p className="text-blue-100 text-sm">Хэвлэлийн бүтээгдэхүүн</p>
                      </div>
                      <Printer size={32} className="text-blue-200" />
                    </div>

                    {/* Grid */}
                    <div className="p-5 grid grid-cols-3 gap-3">
                      {bizPrintItems.map((item, i) => (
                        <Link key={i} to="/biz-print" className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group/item">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm group-hover/item:text-blue-600 transition-colors">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-4">
                      <Link
                        to="/biz-print"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl transition-colors text-sm"
                      >
                        Бүх бүтээгдэхүүн үзэх
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── BIZ MARKETING MEGA MENU ── */}
              <div className="relative group">
                <Link
                  to="/biz-marketing"
                  className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 hover:text-purple-600 font-medium transition-colors rounded-lg text-sm"
                >
                  Biz Marketing
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '720px' }}>
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg">Biz Marketing</h3>
                        <p className="text-purple-100 text-sm">Дижитал маркетинг</p>
                      </div>
                      <TrendingUp size={32} className="text-purple-200" />
                    </div>

                    <div className="p-5 grid grid-cols-3 gap-3">
                      {bizMarketingItems.map((item, i) => (
                        <Link key={i} to="/biz-marketing" className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group/item">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm group-hover/item:text-purple-600 transition-colors">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="px-5 pb-4">
                      <Link
                        to="/biz-marketing"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl transition-colors text-sm"
                      >
                        Бүх үйлчилгээ үзэх
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ҮНИЙН САНАЛ DROPDOWN ── */}
              <div className="relative group">
                <Link
                  to="/quotation"
                  className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg text-sm"
                >
                  Үнийн санал
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '380px' }}>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                      <h3 className="text-white font-bold text-base flex items-center gap-2">
                        <MessageSquare size={20} />
                        Үнийн санал авах
                      </h3>
                      <p className="text-blue-100 text-xs mt-1">24 цагийн дотор хариу өгнө</p>
                    </div>

                    <div className="p-4 space-y-2">
                      {[
                        { icon: <Printer size={18} />, title: 'Хэвлэлийн үнийн санал', desc: 'Ном, каталог, баннер гэх мэт', color: 'text-blue-600 bg-blue-50' },
                        { icon: <TrendingUp size={18} />, title: 'Маркетингийн үнийн санал', desc: 'SEO, SMM, брэндинг', color: 'text-purple-600 bg-purple-50' },
                        { icon: <Star size={18} />, title: 'Тусгай захиалга', desc: 'Өвөрмөц төсөл, том хэмжээ', color: 'text-orange-600 bg-orange-50' },
                      ].map((item, i) => (
                        <Link key={i} to="/quotation" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm group-hover/item:text-blue-600 transition-colors">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <ArrowRight size={14} className="ml-auto text-gray-300 group-hover/item:text-blue-400 transition-colors" />
                        </Link>
                      ))}
                    </div>

                    <div className="px-4 pb-4">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-blue-700 font-medium">📞 Утсаар холбогдох: +976 7200-0444</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── БИДНИЙ ТУХАЙ DROPDOWN ── */}
              <div className="relative group">
                <Link
                  to="/about"
                  className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg text-sm"
                >
                  Бидний тухай
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '420px' }}>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                      <h3 className="text-white font-bold text-base">BIZ PRINT PRO</h3>
                      <p className="text-gray-300 text-xs mt-1">2009 оноос хойш Монголын хэвлэлийн салбарт</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-px bg-gray-100">
                      {[
                        { num: '15+', label: 'Жилийн туршлага' },
                        { num: '10,000+', label: 'Үйлчлүүлэгч' },
                        { num: '100%', label: 'Чанарын баталгаа' },
                      ].map((s, i) => (
                        <div key={i} className="bg-white px-4 py-3 text-center">
                          <p className="font-bold text-gray-800 text-base">{s.num}</p>
                          <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 space-y-2">
                      {[
                        { icon: <Award size={18} />, title: 'Манай тухай', desc: 'Компанийн түүх, алсын харагдлага', color: 'text-blue-600 bg-blue-50' },
                        { icon: <Users size={18} />, title: 'Манай баг', desc: 'Мэргэжлийн туршлагатай хамт олон', color: 'text-green-600 bg-green-50' },
                        { icon: <Zap size={18} />, title: 'Яагаад бидийг сонгох вэ?', desc: 'Давуу тал, ялгарах онцлог', color: 'text-orange-600 bg-orange-50' },
                      ].map((item, i) => (
                        <Link key={i} to="/about" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group/item">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm group-hover/item:text-blue-600 transition-colors">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                          <ArrowRight size={14} className="ml-auto text-gray-300 group-hover/item:text-blue-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ХОЛБОО БАРИХ DROPDOWN ── */}
              <div className="relative group">
                <Link
                  to="/contact"
                  className="flex items-center gap-1 px-3 py-2 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors rounded-lg text-sm"
                >
                  Холбоо барих
                  <ChevronDown size={15} className="group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ width: '360px' }}>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                      <h3 className="text-white font-bold text-base">Холбоо барих</h3>
                      <p className="text-blue-100 text-xs mt-1">Бид тантай холбогдоход бэлэн</p>
                    </div>

                    <div className="p-4 space-y-3">
                      {[
                        { icon: <Phone size={18} />, label: 'Утас', value: '+976 7200-0444', color: 'text-blue-600 bg-blue-50' },
                        { icon: <Mail size={18} />, label: 'И-мэйл', value: 'bizprintpro@gmail.com', color: 'text-purple-600 bg-purple-50' },
                        { icon: <MapPin size={18} />, label: 'Хаяг', value: 'СБД, B Center, 505 тоот', color: 'text-red-600 bg-red-50' },
                        { icon: <Clock size={18} />, label: 'Ажлын цаг', value: 'Да-Ба 09:00–18:00', color: 'text-green-600 bg-green-50' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 pb-4">
                      <Link
                        to="/contact"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
                      >
                        <MessageSquare size={16} />
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
          <div className="bg-white w-80 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold">Цэс</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 hover:bg-gray-50 rounded-lg px-3 font-medium">
                <Home size={18} className="text-gray-500" /> Эхлэл
              </Link>

              {/* Biz Print accordion */}
              <div>
                <button onClick={() => toggleMobileSection('print')} className="w-full flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg font-medium">
                  <span className="flex items-center gap-2"><Printer size={18} className="text-blue-600" /> Biz Print</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileExpanded.print ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded.print && (
                  <div className="ml-4 space-y-1 mb-1">
                    {bizPrintItems.map((item, i) => (
                      <Link key={i} to="/biz-print" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 px-3 hover:bg-blue-50 rounded-lg text-sm text-gray-700">
                        <span className="text-blue-600">{item.icon}</span>
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Biz Marketing accordion */}
              <div>
                <button onClick={() => toggleMobileSection('marketing')} className="w-full flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg font-medium">
                  <span className="flex items-center gap-2"><TrendingUp size={18} className="text-purple-600" /> Biz Marketing</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileExpanded.marketing ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded.marketing && (
                  <div className="ml-4 space-y-1 mb-1">
                    {bizMarketingItems.map((item, i) => (
                      <Link key={i} to="/biz-marketing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 px-3 hover:bg-purple-50 rounded-lg text-sm text-gray-700">
                        <span className="text-purple-600">{item.icon}</span>
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/quotation" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 hover:bg-gray-50 rounded-lg px-3 font-medium">
                <MessageSquare size={18} className="text-gray-500" /> Үнийн санал
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 hover:bg-gray-50 rounded-lg px-3 font-medium">
                <Award size={18} className="text-gray-500" /> Бидний тухай
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 hover:bg-gray-50 rounded-lg px-3 font-medium">
                <Phone size={18} className="text-gray-500" /> Холбоо барих
              </Link>

              <div className="border-t border-gray-100 pt-3 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 hover:bg-gray-50 rounded-lg px-3 font-medium">
                      <User size={18} className="text-gray-500" /> Профайл
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 hover:bg-gray-50 rounded-lg px-3 font-medium">
                        <Settings size={18} className="text-gray-500" /> Админ
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 py-3 hover:bg-red-50 rounded-lg px-3 font-medium text-red-600">
                      <LogOut size={18} /> Гарах
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-3 hover:bg-gray-50 rounded-lg px-3 font-medium">
                    <User size={18} className="text-gray-500" /> Нэвтрэх
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