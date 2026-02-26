import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, TrendingUp, Mail, Phone } from 'lucide-react';
import { getMarketingServiceBySlug } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import MetaTags from '../components/MetaTags';
import ShareButtons from '../components/ShareButtons';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadService();
  }, [slug]);

  const loadService = async () => {
    try {
      setLoading(true);
      const data = await getMarketingServiceBySlug(slug);
      setService(data.data);
    } catch (error) {
      console.error('Error loading service:', error);
      setNotification({ 
        message: error.response?.data?.message || 'Үйлчилгээ олдсонгүй', 
        type: 'error' 
      });
      setTimeout(() => navigate('/biz-marketing'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'social-media': 'Сошиал медиа',
      'seo': 'SEO',
      'content': 'Контент',
      'advertising': 'Сурталчилгаа',
      'branding': 'Брэндинг',
      'other': 'Бусад'
    };
    return categories[category] || 'Бусад';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Үйлчилгээ олдсонгүй</h2>
          <Link to="/biz-marketing" className="text-purple-600 hover:underline">
            Буцах
          </Link>
        </div>
      </div>
    );
  }

  // Prepare share data with proper fallbacks
  const shareUrl = service.slug
    ? `${window.location.origin}/services/${service.slug}`
    : window.location.href;

  const shareTitle = service.name || 'Service';

  const shareDescription = service.shortDescription 
    || (service.description ? service.description.substring(0, 200) : '')
    || service.name
    || 'Check out our service';

  // Get service image - return actual image or null
  const getServiceImage = () => {
    if (service.image) {
      const url = getImageUrl(service.image);
      if (url && url.startsWith('http')) return url;
    }
    // Return null - MetaTags will handle default
    return null;
  };

  const shareImage = getServiceImage();

  // Debug logging
  console.log('📊 Service Share Data:', {
    url: shareUrl,
    title: shareTitle,
    description: shareDescription.substring(0, 50) + '...',
    image: shareImage
  });

  return (
    <>
    {/* React 19 Meta Tags */}
      <title>{product.name} | BizCo Print Shop</title>
      <meta name="description" content={shareDescription.substring(0, 160)} />
      <meta property="og:type" content="product" />
      <meta property="og:url" content={shareUrl} />
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={shareDescription.substring(0, 300)} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:image:secure_url" content={shareImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BizCo Print Shop" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={product.name} />
      <meta name="twitter:description" content={shareDescription.substring(0, 200)} />
      <meta name="twitter:image" content={shareImage} />
      
      
    <div className="min-h-screen bg-gray-50">
      {/* Meta Tags for SEO & Social Sharing */}
      <MetaTags
        title={shareTitle}
        description={shareDescription}
        image={shareImage}
        url={shareUrl}
        type="website"
      />

      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/biz-marketing" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Буцах</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Featured Image */}
              {service.image ? (
                <div className="relative h-80 bg-gradient-to-br from-purple-500 to-pink-500">
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1200x600?text=Service';
                    }}
                  />
                  {service.featured && (
                    <div className="absolute top-6 left-6 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Star size={16} fill="white" />
                      Онцлох үйлчилгээ
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-80 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <TrendingUp size={80} className="text-white opacity-50" />
                </div>
              )}

              {/* Content */}
              <div className="p-8 md:p-12">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                    {getCategoryLabel(service.category)}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {service.name}
                </h1>

                {/* Short Description */}
                {service.shortDescription && (
                  <div className="text-xl text-gray-700 mb-8 p-6 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                    {service.shortDescription}
                  </div>
                )}

                {/* Main Description */}
                <div className="prose prose-lg max-w-none mb-8">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {service.description}
                  </div>
                </div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="mt-12 pt-8 border-t">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Үйлчилгээний онцлог
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.features.map((feature, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-3 p-4 bg-white border border-purple-100 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-gray-800">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Price Card */}
              {service.price && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Үнийн мэдээлэл</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-6">
                    {service.price}
                  </div>
                  <Link
                    to="/contact"
                    className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold shadow-lg"
                  >
                    Захиалах
                  </Link>
                </div>
              )}

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Асуулт байна уу?</h3>
                <p className="text-purple-100 mb-6">
                  Манай мэргэжилтнүүд танд туслахад бэлэн байна
                </p>
                
                <div className="space-y-3">
                  <a 
                    href="tel:+97670005060"
                    className="flex items-center gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Phone size={20} />
                    <span>+976 7000-5060</span>
                  </a>
                  <a 
                    href="mailto:info@printshop.mn"
                    className="flex items-center gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Mail size={20} />
                    <span>info@printshop.mn</span>
                  </a>
                </div>

                <Link
                  to="/quotation"
                  className="block w-full mt-4 bg-white text-purple-600 text-center py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold"
                >
                  Үнийн санал авах
                </Link>
              </div>

              {/* Benefits Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Яагаад биднийг сонгох вэ?</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>5+ жилийн туршлагатай баг</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>100+ амжилттай төсөл</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>24/7 дэмжлэг</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Баталгаатай үр дүн</span>
                  </li>
                </ul>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Хуваалцах</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Энэ үйлчилгээг найзууддаа хуваалцаарай
                </p>
                <ShareButtons
                  url={shareUrl}
                  title={shareTitle}
                  description={shareDescription}
                  image={shareImage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Back to Services */}
        <div className="mt-12 text-center">
          <Link 
            to="/biz-marketing" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Үйлчилгээний жагсаалт руу буцах
          </Link>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default ServiceDetailPage;