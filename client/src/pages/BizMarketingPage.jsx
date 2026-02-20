import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CheckCircle, Star, ArrowRight, Target, Phone, Search, } from 'lucide-react';
import { getMarketingServices } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';

const BizMarketingPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Бүгд', icon: <Target></Target> },
    { value: 'social-media', label: 'Сошиал медиа', icon: <Phone></Phone> },
    { value: 'seo', label: 'SEO', icon: <Search></Search> },
    { value: 'content', label: 'Контент', icon: <Star></Star> },
    { value: 'advertising', label: 'Сурталчилгаа', icon: <TrendingUp></TrendingUp> },
    { value: 'branding', label: 'Брэндинг', icon: <CheckCircle></CheckCircle> },
    { value: 'other', label: 'Бусад', icon: '' },
  ];

  useEffect(() => {
    loadServices();
  }, [selectedCategory]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      const data = await getMarketingServices(params);
      setServices(data.data);
    } catch (error) {
      console.error('Error loading services:', error);
      showNotification('Үйлчилгээ ачааллахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : 'Бусад';
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

      {/* Hero Section with Image */}
      <div className="relative bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557838923-2985c318be48?w=1920&h=600&fit=crop&q=80"
            alt="Digital marketing"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-pink-900/90"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <TrendingUp size={20} className="text-white" />
              <span className="text-sm font-semibold text-white">Дижитал маркетинг</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Biz Marketing
              <span className="block text-purple-300 mt-2">Өсөлтийн хамтлагч</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
              Таны бизнесийг өсгөх дижитал маркетингийн иж бүрэн шийдэл - SEO, Сошиал медиа, Контент маркетинг
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-1">200+</div>
                <div className="text-sm text-gray-300">Амжилттай төсөл</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-gray-300">Харилцагч</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-1">95%</div>
                <div className="text-sm text-gray-300">Сэтгэл ханамж</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-300">Дэмжлэг</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)" fillOpacity="1"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all font-medium ${
                selectedCategory === cat.value
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <Loading />
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Үйлчилгээ олдсонгүй
            </h3>
            <p className="text-gray-500">
              Удахгүй шинэ үйлчилгээ нэмэгдэх болно
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Image */}
                <Link to={`/services/${service.slug}`}>
                  {service.image ? (
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
                      <img
                        src={getImageUrl(service.image)}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Service';
                        }}
                      />
                      {service.featured && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Star size={12} fill="white" />
                          Онцлох
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-6xl">📊</span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                      {getCategoryLabel(service.category)}
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/services/${service.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {service.name}
                    </h3>
                  </Link>

                  {/* Short Description */}
                  {service.shortDescription && (
                    <p className="text-sm text-gray-600 mb-4">
                      {service.shortDescription}
                    </p>
                  )}

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-xs text-purple-600 font-medium ml-6">
                          +{service.features.length - 3} бусад онцлог
                        </li>
                      )}
                    </ul>
                  )}

                  {/* Price */}
                  {service.price && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">
                        {service.price}
                      </p>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/services/${service.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-600 py-3 rounded-lg hover:bg-purple-200 transition-all font-medium"
                    >
                      <span>Дэлгэрэнгүй</span>
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      to="/contact"
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                    >
                      <span>Захиалах</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {services.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold mb-4">
                Танд тохирох шийдлийг олох уу?
              </h2>
              <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
                Бидэнтэй холбогдож, танай бизнест тохирсон маркетингийн стратеги боловсруулцгаая
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold shadow-lg hover:shadow-xl"
                >
                  Холбоо барих
                </Link>
                <Link
                  to="/quotation"
                  className="px-8 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-bold border-2 border-white/20"
                >
                  Үнийн санал авах
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BizMarketingPage;