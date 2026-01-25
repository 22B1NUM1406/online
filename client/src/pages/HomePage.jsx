import { useState, useEffect } from 'react';
import { ChevronDown, Grid, Award, Truck, Shield, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import { getProducts } from '../services/api';
import { CATEGORIES } from '../utils/constants';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = activeCategory !== 'all' ? { category: activeCategory } : {};
      const data = await getProducts(params);
      setProducts(data.data);
    } catch (error) {
      console.error('Error loading products:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Бүтээгдэхүүн ачааллахад алдаа гарлаа';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

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
                  onClick={() => window.location.href = '/quotation'}
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
                {CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <IconComponent size={20} className={activeCategory === category.id ? 'text-white' : 'text-blue-600'} />
                      <span className="font-medium text-sm">{category.name}</span>
                    </button>
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
            {/* Features */}
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

            {/* Products */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {activeCategory === 'all' ? 'Бүх үйлчилгээ' : 'Сонгосон ангилал'}
              </h2>

              {loading ? (
                <Loading />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product}
                      onAddToCart={() => showNotification('Сагсанд нэмэгдлээ!')}
                    />
                  ))}
                </div>
              )}

              {!loading && products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Бүтээгдэхүүн олдсонгүй</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;