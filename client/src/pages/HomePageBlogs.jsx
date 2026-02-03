import { useState, useEffect } from 'react';
import { ChevronRight, Star, TrendingUp, Zap, Award, Shield, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import { getProducts, getCategories } from '../services/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [notification, setNotification] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_DISPLAY_COUNT = 8;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts();
    setShowAll(false);
  }, [activeCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData.data);
      setCategories(categoriesData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setNotification({ message: 'Өгөгдөл ачааллахад алдаа гарлаа', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = activeCategory !== 'all' ? { category: activeCategory } : {};
      const data = await getProducts(params);
      setProducts(data.data);
    } catch (error) {
      console.error('Error loading products:', error);
      setNotification({ message: 'Бүтээгдэхүүн ачааллахад алдаа гарлаа', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Get featured/top categories
  const topCategories = categories.filter(c => !c.parent).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Hero Section - Modern Gradient Banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-pulse">
                <Zap size={16} className="text-yellow-300" />
                <span className="text-sm font-medium">Мэргэжлийн хэвлэл үйлдвэрлэл</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Таны бизнесийн
                <span className="block text-yellow-300">хэвлэлийн шийдэл</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Нэрийн хуудас, флаер, баннер болон бусад хэвлэлийн бүтээгдэхүүнийг
                өндөр чанартай, түргэн шуурхай үйлдвэрлэнэ
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/biz-print"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Бүтээгдэхүүн үзэх
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/quotation"
                  className="inline-flex items-center gap-2 bg-blue-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-blue-700/50 transition-all duration-300"
                >
                  Үнийн санал авах
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold text-yellow-300">1000+</div>
                  <div className="text-sm text-blue-200">Захиалга</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">500+</div>
                  <div className="text-sm text-blue-200">Үйлчлүүлэгч</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">24/7</div>
                  <div className="text-sm text-blue-200">Дэмжлэг</div>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="bg-yellow-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Award className="text-blue-900" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Өндөр чанар</h3>
                <p className="text-blue-100 text-sm">Дэлхийн стандартын тоног төхөөрөмж</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 mt-8">
                <div className="bg-green-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Truck className="text-blue-900" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Үнэгүй хүргэлт</h3>
                <p className="text-blue-100 text-sm">200,000₮-с дээш захиалгад</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="bg-purple-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="text-blue-900" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Баталгаатай</h3>
                <p className="text-blue-100 text-sm">100% чанарын баталгаа</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 mt-8">
                <div className="bg-pink-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="text-blue-900" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Маркетинг</h3>
                <p className="text-blue-100 text-sm">Дижитал маркетингийн үйлчилгээ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12">
            <path fill="#f9fafb" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Бүтээгдэхүүний ангилал</h2>
          <p className="text-gray-600 text-lg">Таны хэрэгцээнд тохирсон бүтээгдэхүүнийг сонгоно уу</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {topCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                activeCategory === category._id
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105'
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              <div className="text-center">
                <div className={`text-4xl mb-3 ${
                  activeCategory === category._id ? 'animate-bounce' : ''
                }`}>
                  {category.icon === 'CreditCard' ? '💳' :
                   category.icon === 'FileText' ? '📄' :
                   category.icon === 'Image' ? '🖼️' :
                   category.icon === 'Book' ? '📚' :
                   category.icon === 'Gift' ? '🎁' :
                   category.icon === 'Package' ? '📦' : '📋'}
                </div>
                <div className="font-bold text-sm">{category.name}</div>
              </div>
              {activeCategory === category._id && (
                <div className="absolute top-2 right-2">
                  <Star className="text-yellow-300 fill-yellow-300" size={16} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* All Products Button */}
        <div className="text-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
            }`}
          >
            Бүх бүтээгдэхүүн
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {activeCategory === 'all' ? 'Бүх бүтээгдэхүүн' : 'Сонгосон ангилал'}
          </h2>
          <div className="text-gray-600">
            {products.length} бүтээгдэхүүн
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Бүтээгдэхүүн олдсонгүй</h3>
            <p className="text-gray-600">Өөр ангилал сонгоно уу</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showAll ? products : products.slice(0, INITIAL_DISPLAY_COUNT)).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Show More Button */}
            {products.length > INITIAL_DISPLAY_COUNT && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span>{showAll ? 'Хураах' : 'Бүгдийг харах'}</span>
                  <ChevronRight 
                    className={`transition-transform duration-300 ${
                      showAll ? 'rotate-90' : ''
                    }`}
                    size={24}
                  />
                </button>
                <p className="mt-4 text-gray-600">
                  {showAll 
                    ? `${products.length} бүтээгдэхүүн харагдаж байна`
                    : `${INITIAL_DISPLAY_COUNT} / ${products.length} бүтээгдэхүүн`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Бизнесээ өсгөх бэлэн үү?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Манай мэргэжилтнүүд таны бизнесийн хэрэгцээнд тохирсон шийдлийг санал болгоно
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/quotation"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Үнийн санал авах
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-blue-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-blue-700/50 transition-all duration-300"
            >
              Холбоо барих
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Truck className="text-white" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Үнэгүй хүргэлт</h3>
            <p className="text-gray-600 text-sm">200,000₮-с дээш захиалгад хүргэлт үнэгүй</p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Баталгаатай</h3>
            <p className="text-gray-600 text-sm">Чанарт бүрэн итгэлтэй, баталгаа олгоно</p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Award className="text-white" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Өндөр чанар</h3>
            <p className="text-gray-600 text-sm">Дэлхийн стандартын материал ашиглана</p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <TrendingUp className="text-white" size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Мэргэжлийн дэмжлэг</h3>
            <p className="text-gray-600 text-sm">24/7 үйлчилгээ, мэргэжлийн зөвлөгөө</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;