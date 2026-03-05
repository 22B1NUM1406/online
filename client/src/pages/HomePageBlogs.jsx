import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, User, Eye, ArrowRight, Star, Zap, Sparkles } from 'lucide-react';
import { getBlogs, getProducts, getCategories } from '../services/api';
import { getImageUrl, formatPrice } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
import SimpleProductCard from '../components/SimpleProductCard';
import SectionHeader from '../components/SectionHeader';
import CategoryMegaMenu from '../components/CategoryMegaMenu';
import Loading from '../components/Loading';
import Notification from '../components/Notification';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [discountSlide, setDiscountSlide] = useState(0);
  const partnersContainerRef = useRef(null);

  const blogCategories = [
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
    loadData();
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [selectedCategory, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blogsData, featuredData, discountData, categoriesData] = await Promise.all([
        getBlogs({ limit: 6 }),
        getProducts({ featured: true }),
        getProducts({ hasDiscount: true }),
        getCategories()
      ]);

      setBlogs(blogsData.data || []);
      setFeaturedProducts(featuredData.data?.slice(0, 4) || []);
      setDiscountProducts(discountData.data?.slice(0, 8) || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Өгөгдөл ачааллахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadBlogs = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      const data = await getBlogs(params);
      setBlogs(data.data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      showNotification('Блог ачааллахад алдаа гарлаа', 'error');
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

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  const nextPartners = () => partnersContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  const prevPartners = () => partnersContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Hero Carousel - Modern Design with Larger Text */}
      <section className="bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="w-full">
          <div className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-white shadow-xl overflow-hidden">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transform scale-105"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center">
                  <div className="text-white max-w-2xl lg:max-w-3xl animate-fadeIn">
                    {/* Badge - Larger */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-6 md:mb-8 border border-white/30 shadow-lg">
                      <span className="text-sm md:text-base lg:text-lg font-bold tracking-wide">
                        {slide.badge}
                      </span>
                    </div>

                    {/* Title - Much Larger */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 md:mb-6 leading-tight tracking-tight">
                      <span className="block mb-2 drop-shadow-2xl">
                        {slide.subtitle}
                      </span>
                      <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl animate-gradient">
                        {slide.highlight}
                      </span>
                    </h1>

                    {/* Description - Larger */}
                    <p className="text-lg md:text-2xl lg:text-3xl mb-8 md:mb-10 text-gray-200 font-light leading-relaxed drop-shadow-lg max-w-xl">
                      {slide.description}
                    </p>

                    {/* CTA Buttons - Fixed Links */}
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/biz-print"
                        className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold text-base md:text-lg shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <span>Дэлгэрэнгүй</span>
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/contact"
                        className="px-8 py-4 bg-white/20 backdrop-blur-md border-2 border-white/50 rounded-xl font-bold text-base md:text-lg hover:bg-white/30 transition-all hover:scale-105"
                      >
                        Холбоо барих
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 md:p-4 shadow-2xl z-20 transition-all hover:scale-110 hover:shadow-xl"
            >
              <ChevronLeft size={24} className="md:w-8 md:h-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 md:p-4 shadow-2xl z-20 transition-all hover:scale-110 hover:shadow-xl"
            >
              <ChevronRight size={24} className="md:w-8 md:h-8" />
            </button>

            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'bg-white w-12 shadow-lg'
                      : 'bg-white/50 w-2.5 hover:bg-white/75 hover:w-6'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gradient animation for text */}
        <style jsx>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 3s ease infinite;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out;
          }
        `}</style>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="border-x border-gray-200 bg-white shadow-sm">

          {/* Category Mega Menu */}
          {categories.length > 0 && (
            <section className="px-4 py-10">
              <CategoryMegaMenu categories={categories} />

              {/* Service Banners - Modern Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Link
                  to="/biz-print"
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-56 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
                    <img
                      src="https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&h=400&fit=crop"
                      alt="Biz Print"
                      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                    />
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>

                    <div className="absolute inset-0 flex items-center justify-between px-8">
                      <div className="text-white z-10">
                        <h3 className="text-3xl font-bold mb-3">Biz Print</h3>
                        <p className="text-blue-100 text-base mb-6">
                          Хэвлэлийн бүтээгдэхүүн<br />Өндөр чанартай
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold text-sm group-hover:bg-blue-50 transition-all shadow-lg">
                          Дэлгэрэнгүй
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/biz-marketing"
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-56 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700">
                    <img
                      src="https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=400&fit=crop"
                      alt="Biz Marketing"
                      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                    />
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>

                    <div className="absolute inset-0 flex items-center justify-between px-8">
                      <div className="text-white z-10">
                        <h3 className="text-3xl font-bold mb-3">Biz Marketing</h3>
                        <p className="text-purple-100 text-base mb-6">
                          Маркетингийн үйлчилгээ<br />Мэргэжлийн
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold text-sm group-hover:bg-purple-50 transition-all shadow-lg">
                          Дэлгэрэнгүй
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* Featured Products - BestComputers Style */}
          {featuredProducts.length > 0 && (
            <section className="px-4 py-10" id="featured-products">
              <SectionHeader
                title="Онцлох бүтээгдэхүүн"
                description="Манай байгууллагын зүгээс хэрэглэгч танд санал болгож буй шилдэг бүтээгдэхүүнүүд"
                icon={Star}
                accentColor="yellow"
                viewAllLink="/biz-print"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredProducts.map(product => (
                  <SimpleProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Discount Products - BestComputers Style */}
          {discountProducts.length > 0 && (
            <section className="px-4 py-10 bg-gray-50" id="discount-products">
              <SectionHeader
                title="Хямдралтай бүтээгдэхүүн"
                description="Онцгой үнээр санал болгож байна - Хэмнэлттэй худалдан авалт"
                icon={Zap}
                accentColor="red"
                viewAllLink="/biz-print"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {discountProducts.slice(0, 10).map((product) => (
                  <SimpleProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Blogs Section */}
          <section className="px-4 py-12">
            <div className="relative mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Сүүлийн блог нийтлэлүүд
                </h2>
              </div>
              <p className="text-gray-600 text-base ml-12">
                Хэвлэлийн талаарх мэдээ, зөвлөгөө, заавар
              </p>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {blogCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-6 py-2.5 rounded-xl whitespace-nowrap font-semibold text-sm transition-all ${selectedCategory === cat.value
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 h-48">
                    {blog.featuredImage ? (
                      <img
                        src={getImageUrl(blog.featuredImage)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Blog';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">📝</span>
                      </div>
                    )}
                    {blog.featured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                        ⭐ Онцлох
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={14} />
                        {blog.views || 0}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User size={14} />
                        <span>{blog.author?.name || 'Admin'}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        Унших
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Partners */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Хамтран ажиллагч байгууллагууд
              </h2>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={prevPartners}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 z-10 hover:shadow-xl transition-all hover:scale-110"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={nextPartners}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 z-10 hover:shadow-xl transition-all hover:scale-110"
            >
              <ChevronRight size={22} />
            </button>

            <div
              ref={partnersContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide py-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-shrink-0 w-44 h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:shadow-lg hover:border-blue-300 transition-all hover:scale-105"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain p-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <span class="text-sm font-bold text-gray-700 text-center px-3">${partner.name}</span>
                      `;
                    }}
                  />
                </div>
              ))}
            </div>

            <style jsx>{`
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