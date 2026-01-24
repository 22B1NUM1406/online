// ========================================
// PART 1: IMPORTS, STATES & DATA
// ========================================

import React, { useState } from 'react';
import { 
  ShoppingCart, Phone, Search, Menu, X, Facebook, Mail, MapPin, 
  Wallet, ChevronRight, Star, Truck, Shield, Headphones, FileText, 
  Tag, Printer, Package, Home, Grid, Heart, User, ChevronDown, 
  Layers, Award, Plus, Minus, Trash2, CreditCard, Check, 
  Edit, BarChart3, DollarSign, MessageSquare, Settings, LogOut, 
  ArrowLeft, Send, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

export default function PrintShopApp() {
  // All States
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [walletBalance, setWalletBalance] = useState(500000);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState(['printing']);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [adminTab, setAdminTab] = useState('products');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Categories - БҮРЭН ЖАГСААЛТ
  const categories = [
    { 
      id: 'printing',
      name: 'Хэвлэлийн үйлчилгээ', 
      icon: Printer,
      subcategories: [
        { id: 'offset', name: 'Офсет хэвлэл', count: 25 },
        { id: 'digital', name: 'Дижитал хэвлэл', count: 18 },
        { id: 'large', name: 'Том хэмжээ', count: 12 },
        { id: 'poster', name: 'Постер/Баннер', count: 30 }
      ]
    },
    { 
      id: 'paper',
      name: 'Цаас материал', 
      icon: FileText,
      subcategories: [
        { id: 'office', name: 'Оффисын цаас', count: 45 },
        { id: 'specialty', name: 'Тусгай цаас', count: 32 },
        { id: 'cardboard', name: 'Картон', count: 15 }
      ]
    },
    { 
      id: 'design',
      name: 'Дизайн ажил', 
      icon: Layers,
      subcategories: [
        { id: 'logo', name: 'Лого дизайн', count: 8 },
        { id: 'branding', name: 'Брэндинг', count: 12 },
        { id: 'layout', name: 'График дизайн', count: 20 }
      ]
    },
    { 
      id: 'business',
      name: 'Бизнес материал', 
      icon: Award,
      subcategories: [
        { id: 'cards', name: 'Нэрийн хуудас', count: 50 },
        { id: 'brochure', name: 'Брошюр', count: 35 },
        { id: 'catalog', name: 'Каталог', count: 22 }
      ]
    },
    { 
      id: 'packaging',
      name: 'Савлагаа', 
      icon: Package,
      subcategories: [
        { id: 'box', name: 'Хайрцаг', count: 28 },
        { id: 'bag', name: 'Уут', count: 40 },
        { id: 'label', name: 'Шошго', count: 55 }
      ]
    },
    { 
      id: 'promo',
      name: 'Сурталчилгаа', 
      icon: Tag,
      subcategories: [
        { id: 'flyer', name: 'Флаер', count: 45 },
        { id: 'sticker', name: 'Наалт', count: 60 },
        { id: 'banner', name: 'Баннер', count: 25 }
      ]
    }
  ];

  // Products - БҮРЭН ЖАГСААЛТ
  const [products, setProducts] = useState([
    { 
      id: 1, name: 'Нэрийн хуудас хэвлэл (500ш)', price: 45000, category: 'cards',
      rating: 4.9, reviews: 234, badge: 'Хит', badgeColor: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop',
      description: 'Мэргэжлийн нэрийн хуудас 350г цаасан дээр.',
      material: '350г Art Paper', size: '90x50mm', format: 'Стандарт'
    },
    { 
      id: 2, name: 'А4 Каталог 16 хуудас', price: 125000, category: 'catalog',
      rating: 4.8, reviews: 156, badge: 'Шинэ', badgeColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      description: '16 хуудас, өнгөт хэвлэл, өнгөлгөөтэй.',
      material: '150г Art Paper', size: 'A4', format: 'Өнгөлгөөтэй'
    },
    { 
      id: 3, name: 'Флаер А5 (1000ш)', price: 85000, oldPrice: 110000, discount: 23,
      category: 'flyer', rating: 4.7, reviews: 189, badge: '-23%', badgeColor: 'bg-red-500',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
      description: 'Сурталчилгааны флаер, хоёр талт хэвлэл.',
      material: '130г Glossy', size: 'A5', format: 'Хоёр талт'
    },
    { 
      id: 4, name: 'Лого дизайн үйлчилгээ', price: 250000, category: 'logo',
      rating: 5.0, reviews: 98, badge: 'Онцлох', badgeColor: 'bg-purple-500',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop',
      description: 'Мэргэжлийн график дизайнераас лого бүтээх үйлчилгээ.',
      material: 'Digital', size: 'Vector', format: 'AI, PNG, SVG'
    },
    { 
      id: 5, name: 'Баннер 3×2м', price: 180000, category: 'banner',
      rating: 4.6, reviews: 145,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      description: 'Гадна сурталчилгааны баннер, усанд тэсвэртэй.',
      material: 'Vinyl Banner', size: '3x2m', format: 'Дижитал хэвлэл'
    },
    { 
      id: 6, name: 'Брошюр А4 12 хуудас', price: 95000, category: 'brochure',
      rating: 4.7, reviews: 167,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      description: '12 хуудас танилцуулга брошюр, өнгөт хэвлэл.',
      material: '150г Art Paper', size: 'A4', format: 'Хагас эвхсэн'
    },
    { 
      id: 7, name: 'Стикер наалт (500ш)', price: 55000, oldPrice: 70000, discount: 21,
      category: 'sticker', rating: 4.5, reviews: 203, badge: '-21%', badgeColor: 'bg-red-500',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
      description: 'Тусгай наалт, ямар ч хэлбэрээр огтлох боломжтой.',
      material: 'Vinyl Sticker', size: 'Custom', format: 'Die-cut'
    },
    { 
      id: 8, name: 'Брэндинг багц', price: 850000, category: 'branding',
      rating: 4.9, reviews: 76, badge: 'Онцлох', badgeColor: 'bg-purple-500',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop',
      description: 'Бүрэн брэндинг багц: лого, нэрийн хуудас, хуудас толгой.',
      material: 'Digital + Print', size: 'Package', format: 'Багц үйлчилгээ'
    },
    { 
      id: 9, name: 'Офсет хэвлэл А4 (10000ш)', price: 450000, category: 'offset',
      rating: 4.8, reviews: 112,
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
      description: 'Том хэмжээний офсет хэвлэл, өндөр чанар.',
      material: '80г Copy Paper', size: 'A4', format: 'Офсет'
    },
    { 
      id: 10, name: 'Дижитал хэвлэл А3 (500ш)', price: 180000, category: 'digital',
      rating: 4.7, reviews: 89,
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
      description: 'Хурдан дижитал хэвлэл, богино хугацаанд.',
      material: '120г Art Paper', size: 'A3', format: 'Дижитал'
    },
    { 
      id: 11, name: 'Картон савлагаа', price: 220000, category: 'box',
      rating: 4.6, reviews: 156,
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
      description: 'Бүтээгдэхүүний савлагаа, тусгай хэмжээтэй.',
      material: 'Картон 350г', size: 'Custom', format: 'Хайрцаг'
    },
    { 
      id: 12, name: 'А4 Оффисын цаас (5 боодол)', price: 87500, category: 'office',
      rating: 4.9, reviews: 234,
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
      description: 'Стандарт оффисын цаас, 80г цагаан.',
      material: '80г Copy Paper', size: 'A4', format: '500 хуудас/боодол'
    },
    { 
      id: 13, name: 'Тусгай цаас - Металлик', price: 125000, category: 'specialty',
      rating: 4.8, reviews: 67,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop',
      description: 'Металлик өнгөлгөөтэй тусгай цаас.',
      material: 'Metallic Paper', size: 'A4', format: '250г'
    },
    { 
      id: 14, name: 'Цаасан уут (1000ш)', price: 95000, category: 'bag',
      rating: 4.5, reviews: 178,
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
      description: 'Экологийн ээлтэй цаасан уут.',
      material: 'Kraft Paper', size: '25x35cm', format: 'Цаасан уут'
    },
    { 
      id: 15, name: 'Бүтээгдэхүүний шошго', price: 45000, category: 'label',
      rating: 4.7, reviews: 203,
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
      description: 'Тусгай шошго, усанд тэсвэртэй.',
      material: 'Vinyl Sticker', size: 'Custom', format: 'Овоолсон'
    },
    { 
      id: 16, name: 'График дизайн үйлчилгээ', price: 180000, category: 'layout',
      rating: 4.9, reviews: 134,
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop',
      description: 'Мэргэжлийн график дизайн, брошюр, каталог.',
      material: 'Digital', size: 'Custom', format: 'Дизайн файл'
    }
  ]);

  // Helper Functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('mn-MN').format(price) + '₮';
  };

  const showNotif = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showNotif('Сагсанд нэмэгдлээ!');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    showNotif('Сагснаас хасагдлаа', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const toggleCategory = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleGoogleLogin = () => {
    setIsLoggedIn(true);
    showNotif('Амжилттай нэвтэрлээ!');
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    showNotif('Гарлаа');
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: orders.length + 1,
      ...orderData,
      items: [...cart],
      total: getCartTotal(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    showNotif('Захиалга амжилттай илгээгдлээ!');
    setCurrentPage('profile');
    setCheckoutStep(1);
  };

  const submitQuotation = (quotationData) => {
    const newQuotation = {
      id: quotations.length + 1,
      ...quotationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setQuotations([...quotations, newQuotation]);
    showNotif('Үнийн санал амжилттай илгээгдлээ!');
  };

// ========================================
// PART 1 ENDED - Continue with Part 2
// ========================================
// ========================================
// PART 2: SMALL COMPONENTS
// ========================================

  // Notification Component
  const Notification = () => {
    if (!showNotification) return null;
    
    const icons = {
      success: <CheckCircle className="text-green-500" size={20} />,
      error: <XCircle className="text-red-500" size={20} />,
      info: <AlertCircle className="text-blue-500" size={20} />
    };

    return (
      <div className="fixed top-20 right-4 z-[100] animate-slide-in">
        <div className={`bg-white rounded-lg shadow-2xl p-4 flex items-center gap-3 border-l-4 ${
          notificationType === 'success' ? 'border-green-500' :
          notificationType === 'error' ? 'border-red-500' : 'border-blue-500'
        }`}>
          {icons[notificationType]}
          <span className="font-medium text-gray-800">{notificationMessage}</span>
        </div>
      </div>
    );
  };

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100">
      <div className="relative overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          onClick={() => {
            setSelectedProduct(product);
            setCurrentPage('product-detail');
          }}
        />
        {product.badge && (
          <div className={`absolute top-3 left-3 ${product.badgeColor || 'bg-red-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
            {product.badge}
          </div>
        )}
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50">
          <Heart size={18} className="text-gray-600 hover:text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 
          className="text-sm font-medium text-gray-800 mb-2 h-10 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
          onClick={() => {
            setSelectedProduct(product);
            setCurrentPage('product-detail');
          }}
        >
          {product.name}
        </h3>
        
        {product.rating && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
        >
          <ShoppingCart size={18} />
          Захиалах
        </button>
      </div>
    </div>
  );

// ========================================
// PART 2 ENDED - Continue with Part 3
// ========================================
// ========================================
// PART 3: HEADER COMPONENT
// ========================================

  const Header = () => (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+976 7000-5060</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Mail size={14} />
                <span>info@printshop.mn</span>
              </div>
            </div>
            <div className="text-xs text-blue-100">
              Ажлын цаг: Даваа-Баасан 09:00-18:00
            </div>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setCurrentPage('home')}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Printer className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">PRINT SHOP</div>
                  <div className="text-xs text-gray-500">Хэвлэлийн төв</div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Үйлчилгээ, бүтээгдэхүүн хайх..."
                  className="w-full px-4 py-2.5 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {isLoggedIn ? 'Алтансарнай' : 'Нэвтрэх'}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 z-50">
                    {!isLoggedIn ? (
                      <button 
                        onClick={handleGoogleLogin}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Google-ээр нэвтрэх</span>
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setCurrentPage('profile');
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <User size={18} />
                          <span className="text-sm font-medium text-gray-700">Профайл</span>
                        </button>
                        <button 
                          onClick={() => {
                            setUserRole('admin');
                            setCurrentPage('admin');
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <Settings size={18} />
                          <span className="text-sm font-medium text-gray-700">Админ (Demo)</span>
                        </button>
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

              <button 
                onClick={() => setCurrentPage('wallet')}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Wallet size={20} />
                <span className="text-sm font-medium">{formatPrice(walletBalance)}</span>
              </button>

              <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart size={20} />
                <span className="text-sm font-medium">Хадгалсан</span>
              </button>
              
              <button 
                onClick={() => setCurrentPage('cart')}
                className="relative group"
              >
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="relative">
                    <ShoppingCart className="text-gray-700 group-hover:text-blue-600 transition-colors" size={24} />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                        {cart.length}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">Сагс</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8 py-3">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <Home size={18} />
                  Эхлэл
                </button>
                <button 
                  onClick={() => setCurrentPage('quotation')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Үнийн санал
                </button>
                <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Бидний тухай</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Холбоо барих</a>
              </div>
              <div className="flex items-center gap-6 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck size={18} className="text-green-600" />
                  <span>Үнэгүй хүргэлт</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={18} className="text-blue-600" />
                  <span>Баталгаат ажил</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );

// ========================================
// PART 3 ENDED - Continue with Part 4
// ========================================
// ========================================
// PART 4: HOME PAGE
// ========================================

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-semibold">🎨 Мэргэжлийн хэвлэлийн үйлчилгээ</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Таны санааг<br />
                <span className="text-blue-200">бодит болгоно</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Дизайнаас эхлээд хэвлэл хүртэл бүх үйлчилгээ
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCurrentPage('quotation')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-xl"
                >
                  Үнийн санал авах
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                  Үйлчилгээ үзэх
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold">10+</div>
                  <div className="text-blue-200 text-sm">Жилийн туршлага</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">5000+</div>
                  <div className="text-blue-200 text-sm">Төсөл</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">99%</div>
                  <div className="text-blue-200 text-sm">Сэтгэл ханамж</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&h=500&fit=crop" 
                alt="Office"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Grid size={20} className="text-blue-600" />
                Ангилал
              </h3>
              
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                Бүгд
              </button>

              <div className="space-y-1">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isExpanded = expandedCategories.includes(category.id);
                  
                  return (
                    <div key={category.id}>
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent size={18} className="text-blue-600" />
                          <span className="font-medium text-sm">{category.name}</span>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {isExpanded && category.subcategories && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setActiveCategory(sub.id)}
                              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                                activeCategory === sub.id
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'hover:bg-gray-50 text-gray-600'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{sub.name}</span>
                                <span className="text-xs text-gray-400">({sub.count})</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-4 text-white">
                <Award size={32} className="mb-2" />
                <h4 className="font-bold mb-1">Урамшуулал</h4>
                <p className="text-sm text-purple-100 mb-3">
                  Эхний захиалгадаа 20% хөнгөлөлт
                </p>
                <button className="w-full bg-white text-purple-600 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors">
                  Дэлгэрэнгүй
                </button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Үнэгүй хүргэлт</h3>
                  <p className="text-xs text-gray-600">200,000₮-с дээш</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Баталгаат ажил</h3>
                  <p className="text-xs text-gray-600">Чанарт итгэлтэй</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Headphones size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">24/7 Дэмжлэг</h3>
                  <p className="text-xs text-gray-600">Үргэлж бэлэн</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {activeCategory === 'all' ? 'Бүх үйлчилгээ' : 'Сонгосон ангилал'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );

// ========================================
// PART 4 ENDED - Continue with Part 5
// ========================================
// ========================================
// PART 5: OTHER PAGES (Cart, Checkout, Quotation, Wallet, Profile)
// ========================================

  // Product Detail Page
  const ProductDetailPage = () => {
    if (!selectedProduct) return null;
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
            <ArrowLeft size={20} /> Буцах
          </button>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-96 object-cover rounded-lg"/>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedProduct.name}</h1>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-bold text-blue-600">{formatPrice(selectedProduct.price)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Материал:</span>
                      <span className="font-medium">{selectedProduct.material}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => addToCart(selectedProduct)} className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                  <ShoppingCart size={20} className="inline mr-2"/> Сагсанд нэмэх
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cart Page
  const CartPage = () => {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
            <ArrowLeft size={20} /> Үргэлжлүүлэх
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Миний сагс</h1>
          {cart.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Таны сагс хоосон байна</h2>
              <button onClick={() => setCurrentPage('home')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold mt-4">
                Худалдан авалт хийх
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg"/>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 border rounded-lg">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2"><Minus size={16} /></button>
                            <span className="px-4 font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2"><Plus size={16} /></button>
                          </div>
                          <span className="text-lg font-bold text-blue-600">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold mb-4">Захиалгын дүн</h3>
                  <div className="flex justify-between text-xl font-bold mb-6">
                    <span>Нийт</span>
                    <span className="text-blue-600">{formatPrice(getCartTotal())}</span>
                  </div>
                  <button onClick={() => setCurrentPage('checkout')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
                    Төлбөр төлөх <ChevronRight size={20} className="inline"/>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Checkout Page
  const CheckoutPage = () => {
    const [formData, setFormData] = useState({name: '', phone: '', email: '', address: '', paymentMethod: 'wallet'});
    const handleSubmit = (e) => {
      e.preventDefault();
      if (checkoutStep === 1) {
        setCheckoutStep(2);
      } else {
        if (formData.paymentMethod === 'wallet' && walletBalance >= getCartTotal()) {
          setWalletBalance(walletBalance - getCartTotal());
          placeOrder(formData);
        } else if (formData.paymentMethod === 'qpay') {
          placeOrder(formData);
        } else {
          showNotif('Таны хэтэвч дутуу байна', 'error');
        }
      }
    };
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => checkoutStep === 1 ? setCurrentPage('cart') : setCheckoutStep(1)} className="flex items-center gap-2 mb-6">
            <ArrowLeft size={20} /> Буцах
          </button>
          <form onSubmit={handleSubmit}>
            {checkoutStep === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Хүргэлтийн мэдээлэл</h2>
                <div className="space-y-4">
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Нэр" className="w-full px-4 py-2 border rounded-lg"/>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Утас" className="w-full px-4 py-2 border rounded-lg"/>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="И-мэйл" className="w-full px-4 py-2 border rounded-lg"/>
                  <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Хаяг" className="w-full px-4 py-2 border rounded-lg" rows="3"/>
                </div>
                <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold">
                  Үргэлжлүүлэх <ChevronRight size={20} className="inline"/>
                </button>
              </div>
            )}
            {checkoutStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Төлбөрийн хэлбэр</h2>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer">
                      <input type="radio" name="payment" value="wallet" checked={formData.paymentMethod === 'wallet'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}/>
                      <Wallet size={24} />
                      <div className="flex-1">
                        <div className="font-semibold">Хэтэвч</div>
                        <div className="text-sm text-gray-600">Үлдэгдэл: {formatPrice(walletBalance)}</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer">
                      <input type="radio" name="payment" value="qpay" checked={formData.paymentMethod === 'qpay'} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}/>
                      <CreditCard size={24} />
                      <div className="flex-1">
                        <div className="font-semibold">QPay</div>
                        <div className="text-sm text-gray-600">Банкны картаар төлөх</div>
                      </div>
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg">
                  <Check size={24} className="inline mr-2"/> Захиалга баталгаажуулах
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  // Quotation Page
  const QuotationPage = () => {
    const [quotationForm, setQuotationForm] = useState({name: '', phone: '', email: '', productType: '', description: ''});
    const handleQuotationSubmit = (e) => {
      e.preventDefault();
      submitQuotation(quotationForm);
      setQuotationForm({name: '', phone: '', email: '', productType: '', description: ''});
      setCurrentPage('home');
    };
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 mb-6">
            <ArrowLeft size={20} /> Буцах
          </button>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <MessageSquare size={48} className="mx-auto text-blue-600 mb-4" />
              <h1 className="text-3xl font-bold mb-2">Үнийн санал авах</h1>
            </div>
            <form onSubmit={handleQuotationSubmit} className="space-y-6">
              <input type="text" required value={quotationForm.name} onChange={(e) => setQuotationForm({...quotationForm, name: e.target.value})} placeholder="Нэр" className="w-full px-4 py-2 border rounded-lg"/>
              <input type="tel" required value={quotationForm.phone} onChange={(e) => setQuotationForm({...quotationForm, phone: e.target.value})} placeholder="Утас" className="w-full px-4 py-2 border rounded-lg"/>
              <input type="email" required value={quotationForm.email} onChange={(e) => setQuotationForm({...quotationForm, email: e.target.value})} placeholder="И-мэйл" className="w-full px-4 py-2 border rounded-lg"/>
              <select required value={quotationForm.productType} onChange={(e) => setQuotationForm({...quotationForm, productType: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="">Төрөл сонгох</option>
                <option value="book">Ном</option>
                <option value="poster">Плакат</option>
                <option value="brochure">Брошюр</option>
              </select>
              <textarea required value={quotationForm.description} onChange={(e) => setQuotationForm({...quotationForm, description: e.target.value})} placeholder="Дэлгэрэнгүй" className="w-full px-4 py-2 border rounded-lg" rows="5"/>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
                <Send size={20} className="inline mr-2"/> Илгээх
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Wallet Page
  const WalletPage = () => {
    const [amount, setAmount] = useState('');
    const handleTopUp = (e) => {
      e.preventDefault();
      const topUpAmount = parseInt(amount);
      if (topUpAmount > 0) {
        setWalletBalance(walletBalance + topUpAmount);
        showNotif(`${formatPrice(topUpAmount)} цэнэглэгдлээ!`);
        setAmount('');
      }
    };
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <button onClick={() => setCurrentPage('profile')} className="flex items-center gap-2 mb-6">
            <ArrowLeft size={20} /> Буцах
          </button>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white mb-6">
            <h2 className="text-2xl font-bold mb-2">Миний хэтэвч</h2>
            <div className="text-4xl font-bold">{formatPrice(walletBalance)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-6">Хэтэвч цэнэглэх</h3>
            <form onSubmit={handleTopUp} className="space-y-6">
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Дүн" min="1000" className="w-full px-4 py-2 border rounded-lg"/>
              <div className="grid grid-cols-3 gap-3">
                {[50000, 100000, 200000, 500000, 1000000, 2000000].map(preset => (
                  <button key={preset} type="button" onClick={() => setAmount(preset.toString())} className="px-4 py-3 border-2 rounded-lg hover:border-blue-500 text-sm font-medium">
                    {formatPrice(preset)}
                  </button>
                ))}
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
                <CreditCard size={20} className="inline mr-2"/> QPay-ээр төлөх
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Profile Page
  const ProfilePage = () => {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 mb-6">
            <ArrowLeft size={20} /> Буцах
          </button>
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                    {isLoggedIn ? 'А' : 'G'}
                  </div>
                  <h3 className="font-bold">{isLoggedIn ? 'Алтансарнай' : 'Зочин'}</h3>
                </div>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium flex items-center gap-2">
                    <ShoppingCart size={18} /> Захиалгууд
                  </button>
                  <button onClick={() => setCurrentPage('wallet')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Wallet size={18} /> Хэтэвч
                  </button>
                  {userRole === 'admin' && (
                    <button onClick={() => setCurrentPage('admin')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <Settings size={18} /> Админ самбар
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Миний захиалгууд</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Захиалга байхгүй байна</h3>
                    <button onClick={() => setCurrentPage('home')} className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4">
                      Захиалга хийх
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-lg p-6">
                        <div className="flex justify-between mb-4">
                          <div>
                            <div className="text-sm text-gray-600">Захиалга #{order.id}</div>
                            <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('mn-MN')}</div>
                          </div>
                          <div className="px-4 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                            {order.status === 'pending' ? 'Хүлээгдэж буй' : 'Төлөгдсөн'}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

// ========================================
// PART 5 ENDED - Continue with Part 6
// ========================================
// ========================================
// PART 6: ADMIN DASHBOARD + FOOTER + MAIN RENDER
// ========================================

  // Admin Dashboard
  const AdminDashboard = () => {
    const [newProduct, setNewProduct] = useState({name: '', price: '', category: 'cards', description: '', material: '', size: '', format: ''});
    const handleAddProduct = (e) => {
      e.preventDefault();
      const product = {
        id: products.length + 1,
        ...newProduct,
        price: parseInt(newProduct.price),
        rating: 0,
        reviews: 0,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop'
      };
      setProducts([...products, product]);
      showNotif('Бүтээгдэхүүн нэмэгдлээ!');
      setNewProduct({name: '', price: '', category: 'cards', description: '', material: '', size: '', format: ''});
    };
    const deleteProduct = (id) => {
      setProducts(products.filter(p => p.id !== id));
      showNotif('Бүтээгдэхүүн устгагдлаа', 'info');
    };
    const stats = [
      { label: 'Нийт борлуулалт', value: formatPrice(1250000), icon: DollarSign, color: 'bg-green-500' },
      { label: 'Захиалга', value: orders.length, icon: ShoppingCart, color: 'bg-blue-500' },
      { label: 'Бүтээгдэхүүн', value: products.length, icon: Package, color: 'bg-purple-500' },
      { label: 'Үнийн санал', value: quotations.length, icon: MessageSquare, color: 'bg-orange-500' }
    ];

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Админ самбар</h1>
              <p className="text-gray-600">Удирдлагын систем</p>
            </div>
            <button onClick={() => { setUserRole('user'); setCurrentPage('home'); }} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg">
              <LogOut size={18} /> Гарах
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex gap-4 mb-6 border-b">
              <button onClick={() => setAdminTab('products')} className={`px-4 py-2 font-medium ${adminTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                Бүтээгдэхүүн
              </button>
              <button onClick={() => setAdminTab('orders')} className={`px-4 py-2 font-medium ${adminTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                Захиалга
              </button>
              <button onClick={() => setAdminTab('quotations')} className={`px-4 py-2 font-medium ${adminTab === 'quotations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                Үнийн санал
              </button>
            </div>

            {adminTab === 'products' && (
              <div>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-4">Бүтээгдэхүүн нэмэх</h3>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="Нэр" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="px-4 py-2 border rounded-lg"/>
                    <input type="number" required placeholder="Үнэ" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="px-4 py-2 border rounded-lg"/>
                    <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="px-4 py-2 border rounded-lg">
                      <option value="cards">Нэрийн хуудас</option>
                      <option value="catalog">Каталог</option>
                      <option value="flyer">Флаер</option>
                    </select>
                    <input type="text" placeholder="Материал" value={newProduct.material} onChange={(e) => setNewProduct({...newProduct, material: e.target.value})} className="px-4 py-2 border rounded-lg"/>
                    <textarea placeholder="Тайлбар" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="col-span-2 px-4 py-2 border rounded-lg" rows="2"/>
                    <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded-lg font-semibold">
                      <Plus size={18} className="inline mr-2"/> Нэмэх
                    </button>
                  </form>
                </div>
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                        <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">Захиалга байхгүй байна</div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-bold">Захиалга #{order.id}</div>
                          <div className="text-sm text-gray-600">{order.name} - {order.phone}</div>
                        </div>
                        <select value={order.status} onChange={(e) => {
                          const updatedOrders = orders.map(o => o.id === order.id ? {...o, status: e.target.value} : o);
                          setOrders(updatedOrders);
                        }} className="px-4 py-2 border rounded-lg">
                          <option value="pending">Хүлээгдэж буй</option>
                          <option value="paid">Төлөгдсөн</option>
                          <option value="processing">Үйлдвэрлэлд</option>
                          <option value="completed">Дууссан</option>
                        </select>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-blue-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {adminTab === 'quotations' && (
              <div className="space-y-4">
                {quotations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">Үнийн санал байхгүй байна</div>
                ) : (
                  quotations.map(quotation => (
                    <div key={quotation.id} className="border rounded-lg p-6">
                      <div className="font-bold mb-1">{quotation.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{quotation.phone} - {quotation.email}</div>
                      <div className="text-sm text-gray-700 mb-2"><span className="font-medium">Төрөл:</span> {quotation.productType}</div>
                      <div className="text-sm text-gray-600">{quotation.description}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Footer Component
  const Footer = () => (
    <>
      <section className="relative py-16 mt-12">
  {/* Background image with gradient overlay */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('./footer.jpg')" }}
  ></div>
  
  {/* Gradient overlay for better text readability */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/70"></div>
  
  {/* Optional: Additional dark overlay for more contrast */}
  <div className="absolute inset-0 bg-black/20"></div>
  
  <div className="relative max-w-7xl mx-auto px-4 z-10">
    <div className="max-w-2xl mx-auto text-center">
      <Mail size={48} className="mx-auto mb-4 text-white" />
      <h2 className="text-3xl font-bold text-white mb-4">Урамшууллын мэдээлэл авах</h2>
      <p className="text-gray-200 mb-8">Шинэ үйлчилгээ, хямдралын мэдээллийг цаг алдалгүй хүлээн авах</p>
      <div className="flex gap-3 max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="И-мэйл хаягаа оруулна уу" 
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/70 backdrop-blur-sm"
        />
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Бүртгүүлэх
        </button>
      </div>
    </div>
  </div>
</section>

      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Printer className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-xl font-bold">PRINT SHOP</div>
                  <div className="text-xs text-gray-400">Хэвлэлийн төв</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">Монгол дахь хэвлэлийн салбарын тэргүүлэгч компани.</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600"><Facebook size={20} /></a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600"><Mail size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Холбоо барих</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2"><Phone size={18} /><span>+976 7000-5060</span></div>
                <div className="flex items-center gap-2"><Mail size={18} /><span>info@printshop.mn</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Үйлчилгээ</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Офсет хэвлэл</li>
                <li>Дижитал хэвлэл</li>
                <li>Дизайн үйлчилгээ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Төв оффис</h4>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin size={18} className="mt-1" />
                <p>Улаанбаатар хот, Сонгинохайрхан дүүрэг 12-р хороо</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm">© 2024 PRINT SHOP. Бүх эрх хуулиар хамгаалагдсан.</p>
          </div>
        </div>
      </footer>
    </>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <Notification />
      <Header />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'product-detail' && <ProductDetailPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'checkout' && <CheckoutPage />}
      {currentPage === 'quotation' && <QuotationPage />}
      {currentPage === 'wallet' && <WalletPage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'admin' && <AdminDashboard />}
      
      {currentPage === 'home' && <Footer />}
    </div>
  );
}

// ========================================
// END OF APPLICATION
// ========================================