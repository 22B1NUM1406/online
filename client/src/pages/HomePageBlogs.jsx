import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, User, Eye, ArrowRight, Star, Zap } from 'lucide-react';
import { getBlogs, getProducts, getCategories } from '../services/api';
import { getImageUrl, formatPrice } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
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

  const partners = [
    { id: 1, name: "Mongol Shuudan" },
    { id: 2, name: "Gobi Cashmere" },
    { id: 3, name: "APU" },
    { id: 4, name: "Khan Bank" },
    { id: 5, name: "Tavan Bogd" },
    { id: 6, name: "MCS Group" },
    { id: 7, name: "Skytel" },
  ];

  useEffect(() => {
    loadData();
    
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

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextPartners = () => {
    if (partnersContainerRef.current) {
      partnersContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const prevPartners = () => {
    if (partnersContainerRef.current) {
      partnersContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-white">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Hero Carousel - BestComputers Style */}
      <section className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative h-[450px] bg-white rounded shadow overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                </div>
                
                <div className="absolute inset-0 flex items-center px-12">
                  <div className="text-white max-w-xl">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded inline-block mb-4">
                      <span className="text-xs font-semibold">{slide.badge}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                      {slide.subtitle}<br />
                      <span className="text-blue-300">{slide.highlight}</span>
                    </h1>
                    <p className="text-lg mb-6 text-gray-200">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow z-20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow z-20"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/50 w-1.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Mega Menu - Above Featured Products */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <CategoryMegaMenu categories={categories} />
        </section>
      )}

      {/* Featured Products - BestComputers Border Style */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="border-l-4 border-yellow-600 pl-3 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Star className="text-yellow-600 fill-yellow-600" size={18} />
              <h2 className="text-2xl font-bold text-gray-900">
                Онцлох бүтээгдэхүүн
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              Манай байгууллагын зүгээс хэрэглэгч танд санал болгож буй онцлох бүтээгдэхүүнүүд
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Discount Products - BestComputers Layout */}
      {discountProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="border-l-4 border-red-600 pl-3 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="text-red-600" size={18} />
              <h2 className="text-2xl font-bold text-gray-900">
                Хямдралтай бүтээгдэхүүн
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              Онцгой үнээр санал болгож байна - Хэмнэлттэй худалдан авалт
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Carousel */}
            <div className="lg:col-span-1">
              <div className="relative h-[400px] bg-white border border-gray-200 rounded overflow-hidden">
                {discountProducts.slice(0, 3).map((product, index) => (
                  <div
                    key={product._id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === discountSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Link to={`/products/${product._id}`} className="flex items-center justify-center h-full p-6">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Product';
                        }}
                      />
                    </Link>
                    {product.discount && (
                      <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  onClick={() => setDiscountSlide(prev => (prev - 1 + 3) % 3)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setDiscountSlide(prev => (prev + 1) % 3)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1.5 shadow"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className={`h-1 w-1 rounded-full ${
                        index === discountSlide ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: 2x2 Product Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {discountProducts.slice(3, 7).map((product) => (
                <div key={product._id} className="relative">
                  {product.discount && (
                    <div className="absolute top-2 left-2 z-10 bg-orange-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blogs Section - BestComputers Style */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="border-l-4 border-blue-600 pl-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Сүүлийн блог нийтлэлүүд
          </h2>
          <p className="text-gray-600 text-sm">
            Хэвлэлийн талаарх мэдээ, зөвлөгөө, заавар
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1.5 rounded whitespace-nowrap text-sm transition ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blogs/${blog.slug}`}
              className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow transition group"
            >
              <div className="relative overflow-hidden bg-gray-100 h-44">
                {blog.featuredImage ? (
                  <img
                    src={getImageUrl(blog.featuredImage)}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Blog';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                {blog.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    Онцлох
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {blog.views || 0}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition">
                  {blog.title}
                </h3>

                {blog.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {blog.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <User size={12} />
                    <span>{blog.author?.name || 'Admin'}</span>
                  </div>
                  <span className="flex items-center gap-1 text-blue-600 font-medium">
                    Унших
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Partners - BestComputers Style */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-l-4 border-gray-600 pl-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Хамтран ажиллагч байгууллагууд
            </h2>
          </div>
          
          <div className="relative">
            <button
              onClick={prevPartners}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white shadow rounded-full p-2 z-10 hover:shadow-md transition"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={nextPartners}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white shadow rounded-full p-2 z-10 hover:shadow-md transition"
            >
              <ChevronRight size={20} />
            </button>

            <div 
              ref={partnersContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-shrink-0 w-40 h-24 bg-white border border-gray-200 rounded flex items-center justify-center hover:shadow transition"
                >
                  <span className="text-sm font-semibold text-gray-700 text-center px-2">
                    {partner.name}
                  </span>
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