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

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">Дижитал маркетинг</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Biz Marketing
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Таны бизнесийг өсгөх дижитал маркетингийн иж бүрэн шийдэл
            </p>
          </div>
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
                <Link to={`/service/${service.slug}`}>
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
                  <Link to={`/service/${service.slug}`}>
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
                      to={`/service/${service.slug}`}
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
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16 relative overflow-hidden rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Танд тохирох шийдлийг олох уу?
            </h2>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
              Бидэнтэй холбогдож, танай бизнест тохирсон маркетингийн стратеги боловсруулцгаая
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-bold"
              >
                Холбоо барих
              </Link>
              <Link
                to="/quotation"
                className="px-8 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-bold"
              >
                Үнийн санал авах
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BizMarketingPage;