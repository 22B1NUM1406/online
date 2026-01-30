import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Eye, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlogs } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import BizPrintPage from './BizPrintPage';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPartner, setCurrentPartner] = useState(0);
  const partnersContainerRef = useRef(null);

  const categories = [
    { value: 'all', label: 'Бүгд' },
    { value: 'news', label: 'Мэдээ' },
    { value: 'tutorial', label: 'Заавар' },
    { value: 'tips', label: 'Зөвлөмж' },
  ];

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=600&fit=crop", 
      title: "Мэргэжлийн хэвлэлийн үйлчилгээ",
      subtitle: "Таны санааг",
      highlight: "бодит болгоно",
      description: "Дизайнаас эхлээд хэвлэл хүртэл бүх үйлчилгээ",
      badge: "🎨 Мэргэжлийн хэвлэлийн үйлчилгээ"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=600&fit=crop",
      title: "Хурдан бөгөөд чанартай",
      subtitle: "Хэвлэлийн ажил",
      highlight: "хурдан шуурхай",
      description: "Орчин үеийн тоног төхөөрөмж, мэргэжлийн баг",
      badge: "⚡ Хурдан шуурхай үйлчилгээ"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=600&fit=crop",
      title: "Шинэлэг дизайн",
      subtitle: "Бүтээлч шийдэл",
      highlight: "онцгой хэвлэл",
      description: "Таны бизнест тохирсон өвөрмөц дизайн",
      badge: "✨ Өвөрмөц дизайн"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=600&fit=crop",
      title: "Хамтын ажиллагаа",
      subtitle: "Таны бизнест",
      highlight: "өсөлт авчирна",
      description: "Олон жилийн туршлагатай мэргэжилтнүүд",
      badge: "🤝 Хамтдаа амжилтын төлөө"
    }
  ];

  // Хамтрагч байгууллагууд - таны local лого зургууд
  const partners = [
    { id: 1, name: "Mongol Shuudan", logo: "/images/partners/mongol-shuudan.png" },
    { id: 2, name: "Gobi Cashmere", logo: "/images/partners/gobi-cashmere.png" },
    { id: 3, name: "APU", logo: "/images/partners/apu.png" },
    { id: 4, name: "Khan Bank", logo: "/images/partners/khan-bank.png" },
    { id: 5, name: "Tavan Bogd", logo: "/images/partners/tavan-bogd.png" },
    { id: 6, name: "MCS Group", logo: "/images/partners/mcs-group.png" },
    { id: 7, name: "Skytel", logo: "/images/partners/skytel.png" },
  ];

  useEffect(() => {
    loadBlogs();
    
    // Hero section auto slide
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      clearInterval(slideInterval);
    };
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [selectedCategory, searchTerm]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const data = await getBlogs(params);
      setBlogs(data.data);
    } catch (error) {
      console.error('Error loading blogs:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Блог ачааллахад алдаа гарлаа';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextPartners = () => {
    if (partnersContainerRef.current) {
      const container = partnersContainerRef.current;
      const scrollAmount = 300; // Гүйлгэх хэмжээ
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const prevPartners = () => {
    if (partnersContainerRef.current) {
      const container = partnersContainerRef.current;
      const scrollAmount = 300; // Гүйлгэх хэмжээ
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
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

      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[600px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
              </div>
              
              <div className="max-w-7xl mx-auto px-4 h-full flex items-center relative z-20">
                <div className="text-white max-w-2xl">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                    <span className="text-sm font-semibold">{slide.badge}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.subtitle}<br />
                    <span className="text-blue-300">{slide.highlight}</span>
                  </h1>
                  <p className="text-xl mb-8 text-gray-200">
                    {slide.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6 mt-12">
                    <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-3xl font-bold">10+</div>
                      <div className="text-blue-200 text-sm">Жилийн туршлага</div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-3xl font-bold">5000+</div>
                      <div className="text-blue-200 text-sm">Төсөл</div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <div className="text-3xl font-bold">99%</div>
                      <div className="text-blue-200 text-sm">Сэтгэл ханамж</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all z-30"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all z-30"
          >
            <ChevronRight className="text-white" size={24} />
          </button>
          
          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <BizPrintPage />

      {/* Blogs Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Сүүлийн блог нийтлэлүүд</h2>
            <p className="text-gray-600">Хэвлэлийн талаарх мэдээ, зөвлөгөө, заавар</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <Loading />
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Блог олдсонгүй
            </h3>
            <p className="text-gray-500">
              Удахгүй шинэ блог нэмэгдэх болно
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-200 h-48">
                  {blog.featuredImage ? (
                    <img
                      src={getImageUrl(blog.featuredImage)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                      <span className="text-6xl">📝</span>
                    </div>
                  )}
                  {blog.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Онцлох
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {blog.views}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>

                  {blog.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User size={14} />
                      <span>{blog.author?.name || 'Admin'}</span>
                    </div>

                    <span className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                      Унших
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
       {/* Partners Carousel Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Хамтран ажиллагч байгууллагууд</h2>
          </div>
          
          <div className="relative">
            {/* Навигацийн товчнууд */}
            <button
              onClick={prevPartners}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-3 z-10 transition-all hover:scale-110"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            
            <button
              onClick={nextPartners}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white shadow-lg hover:shadow-xl rounded-full p-3 z-10 transition-all hover:scale-110"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>

            {/* Partners Container */}
            <div 
              ref={partnersContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-8"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Partners жагсаалт */}
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-shrink-0 w-48 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-28 flex items-center justify-center p-4">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                            <span class="text-base font-semibold text-gray-700 text-center">${partner.name}</span>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Auto scroll animation */}
            <style jsx>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-250px * ${partners.length})); }
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;