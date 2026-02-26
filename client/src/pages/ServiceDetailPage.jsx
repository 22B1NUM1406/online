import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react';
import { getMarketingService } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import ShareButtons from '../components/ShareButtons';
import TextDisplay from '../components/TextDisplay';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [slug]);

  const loadService = async () => {
    try {
      setLoading(true);
      const data = await getMarketingService(slug);
      setService(data.data);
    } catch (error) {
      console.error('Error loading service:', error);
      setTimeout(() => navigate('/biz-marketing'), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!service) return null;

  return (
    <>
      {/* React 19 Meta Tags - Automatically hoisted to <head> */}
      <title>{service.name} | BizCo Marketing</title>
      <meta name="description" content={service.shortDescription?.substring(0, 160) || service.name} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://www.bizco.mn/services/${service.slug}`} />
      <meta property="og:title" content={service.name} />
      <meta property="og:description" content={service.shortDescription?.substring(0, 300) || service.description?.substring(0, 300) || service.name} />
      <meta property="og:image" content={getImageUrl(service.image)} />
      <meta property="og:image:secure_url" content={getImageUrl(service.image)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={service.name} />
      <meta property="og:site_name" content="BizCo Marketing" />
      
      {/* Service Specific */}
      {service.category && (
        <meta property="og:product:category" content={service.category} />
      )}
      {service.price && (
        <meta property="og:price:amount" content={service.price} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={service.name} />
      <meta name="twitter:description" content={service.shortDescription?.substring(0, 200) || service.name} />
      <meta name="twitter:image" content={getImageUrl(service.image)} />

      {/* Component Content */}
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Буцах</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Image */}
              {service.image && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.name}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1200x600?text=Service';
                    }}
                  />
                  {service.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                      <Star size={16} fill="white" />
                      Онцлох
                    </div>
                  )}
                </div>
              )}

              {/* Service Header */}
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {service.name}
                </h1>

                {service.shortDescription && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {service.shortDescription}
                  </p>
                )}

                {service.category && (
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      {service.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Service Description */}
              {service.description && (
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Дэлгэрэнгүй мэдээлэл
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <TextDisplay content={service.description} />
                  </div>
                </div>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Онцлох боломжууд
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
                      >
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Хуваалцах</h3>
                <ShareButtons 
                  url={`https://www.bizco.mn/services/${service.slug}`}
                  title={service.name}
                  description={service.shortDescription}
                  image={getImageUrl(service.image)}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Price Card */}
              {service.price && (
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Үнэ</h3>
                  <p className="text-3xl font-bold mb-4">{service.price}</p>
                  <p className="text-sm text-purple-100 mb-6">
                    Үнэ нь төслийн цар хүрээнээс хамаарч өөрчлөгдөж болно
                  </p>
                  <Link
                    to="/contact"
                    className="block w-full bg-white text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-center"
                  >
                    Захиалах
                  </Link>
                </div>
              )}

              {/* Contact Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Холбоо барих
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Утас:</span>
                    <p className="font-medium">+976 7200-0444</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Имэйл:</span>
                    <p className="font-medium">bizprintpro@gmail.com</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Цагийн хуваарь:</span>
                    <p className="font-medium">Даваа-Баасан 09:00-18:00</p>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Туслалцаа хэрэгтэй юу?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Бидэнтэй холбогдож, танай бизнест тохирсон шийдлийг олоорой
                </p>
                <Link
                  to="/quotation"
                  className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
                >
                  Үнийн санал авах
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailPage;