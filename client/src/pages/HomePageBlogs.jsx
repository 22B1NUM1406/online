import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { getBlogs, getProducts, getCategories } from '../services/api';
import { getImageUrl, formatPrice } from '../utils/helpers';
import SimpleProductCard from '../components/SimpleProductCard';
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
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
      image: "https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      label: "Хэвлэлийн үйлчилгээ",
      title: "Таны санааг бодит болгоно",
      description: "Дизайнаас эхлээд хэвлэл хүртэл бүх үйлчилгээ"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?w=1600&h=800&fit=crop",
      label: "Хурдан & Чанартай",
      title: "Хэвлэлийн ажил хурдан шуурхай",
      description: "Орчин үеийн тоног төхөөрөмж, мэргэжлийн баг"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1600&h=800&fit=crop",
      label: "Шинэлэг Дизайн",
      title: "Өвөрмөц шийдэл, онцгой хэвлэл",
      description: "Таны бизнест тохирсон бүтээлч дизайн"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=1600&h=800&fit=crop",
      label: "Хамтын Ажиллагаа",
      title: "Таны бизнест өсөлт авчирна",
      description: "Олон жилийн туршлагатай мэргэжилтнүүд"
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
    const interval = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { loadBlogs(); }, [selectedCategory]);

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
    } catch (err) {
      console.error('Error loading data:', err);
      showNotification('Өгөгдөл ачааллахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadBlogs = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const data = await getBlogs(params);
      setBlogs(data.data || []);
    } catch (err) {
      console.error('Error loading blogs:', err);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('mn-MN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const nextSlide = () => setCurrentSlide(p => (p + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length);
  const nextPartners = () => partnersContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  const prevPartners = () => partnersContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif" }}>
      <style>{`
        @keyframes heroUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .hero-active { animation: heroUp 0.65s ease forwards; }
        @keyframes blogFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .blog-fadein { animation: blogFadeIn 0.7s ease-out both; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="relative h-[420px] md:h-[500px] lg:h-[580px]">
          {heroSlides.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === currentSlide ? 1 : 0, zIndex: i === currentSlide ? 1 : 0 }}
            >
              {/* BG image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Overlays */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,24,0.88) 0%, rgba(10,10,24,0.55) 55%, rgba(10,10,24,0.12) 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 h-28" style={{ background: 'linear-gradient(to top, rgba(13,13,26,0.55), transparent)' }} />

              {/* Content */}
              <div className="relative z-10 h-full max-w-screen-xl mx-auto px-6 md:px-8 flex items-center">
                {i === currentSlide && (
                  <div className="hero-active max-w-xl">
                    <p className="text-white/90 text-lg md:text-xl font-bold mb-3 tracking-tight">
                      {slide.label}
                    </p>
                    <h1 className="text-white text-lg md:text-xl font-bold leading-snug mb-4 tracking-tight">
                      {slide.title}
                    </h1>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8">
                      {slide.description}
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded font-bold text-sm tracking-wide hover:bg-gray-100 transition-colors"
                    >
                      Холбоо барих <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Prev / Next */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded bg-white/15 border border-white/25 text-white hover:bg-white/90 hover:text-gray-900 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded bg-white/15 border border-white/25 text-white hover:bg-white/90 hover:text-gray-900 transition-all"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-0.5 rounded-sm transition-all duration-300 border-none cursor-pointer ${i === currentSlide ? 'w-7 bg-white' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute bottom-5 right-6 z-10 text-white/45 text-xs font-semibold tracking-wide">
            {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="bg-white border-x border-b border-gray-200">

          {/* ── Section Header helper ── */}
          {/* Category Menu */}
          {categories.length > 0 && (
            <section className="px-5 md:px-7 pt-8 pb-7">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-5 h-px bg-gray-300 inline-block" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ангилал</span>
              </div>
              <CategoryMegaMenu categories={categories} />
            </section>
          )}

          <div className="h-px bg-gray-200" />

          {/* ── Featured Products ── */}
          {featuredProducts.length > 0 && (
            <section className="px-5 md:px-7 py-9" id="featured-products">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-px bg-gray-300 inline-block" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Онцлох бүтээгдэхүүн</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Шилдэг бүтээгдэхүүнүүд</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Манай байгууллагаас санал болгож буй шилдэг сонголтууд</p>
                </div>
                <Link to="/biz-print" className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 border-b border-gray-900 pb-px whitespace-nowrap hover:text-gray-600 hover:border-gray-600 transition-colors">
                  Бүгдийг үзэх <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredProducts.map(product => <SimpleProductCard key={product._id} product={product} />)}
              </div>
            </section>
          )}

          <div className="h-px bg-gray-200" />

          {/* ── Service Banners ── */}
          <section className="px-5 md:px-7 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  to: '/biz-print',
                  img: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800&h=400&fit=crop',
                  tag: 'Үйлчилгээ',
                  title: 'Biz Print',
                  desc: 'Хэвлэлийн бүтээгдэхүүн — Өндөр чанартай',
                  bg: '#1a1a2e',
                },
                {
                  to: '/biz-marketing',
                  img: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=400&fit=crop',
                  tag: 'Үйлчилгээ',
                  title: 'Biz Marketing',
                  desc: 'Маркетингийн үйлчилгээ — Мэргэжлийн',
                  bg: '#2d2040',
                },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="block group">
                  <div className="relative h-48 rounded overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${item.bg}f0 0%, ${item.bg}99 55%, ${item.bg}30 100%)` }} />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="text-white/55 text-xs font-bold uppercase tracking-widest mb-1.5">{item.tag}</span>
                      <h3 className="text-white text-xl font-bold mb-1 tracking-tight">{item.title}</h3>
                      <p className="text-white/60 text-sm mb-3">{item.desc}</p>
                      <div className="inline-flex items-center gap-1.5 bg-white text-xs font-bold px-4 py-2 rounded w-fit transition-opacity" style={{ color: item.bg }}>
                        Дэлгэрэнгүй <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="h-px bg-gray-200" />

          {/* ── Discount Products ── */}
          {discountProducts.length > 0 && (
            <section className="px-5 md:px-7 py-9 bg-gray-50" id="discount-products">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-px bg-gray-300 inline-block" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Хямдрал</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Хямдралтай бүтээгдэхүүн</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Онцгой үнээр санал болгож байна</p>
                </div>
                <Link to="/biz-print" className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 border-b border-gray-900 pb-px whitespace-nowrap hover:text-gray-600 hover:border-gray-600 transition-colors">
                  Бүгдийг үзэх <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {discountProducts.slice(0, 10).map(product => <SimpleProductCard key={product._id} product={product} />)}
              </div>
            </section>
          )}

          <div className="h-px bg-gray-200" />

          {/* ── Blog ── */}
          <section className="px-5 md:px-7 py-9">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-px bg-gray-300 inline-block" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Блог</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Сүүлийн нийтлэлүүд</h2>
              <p className="text-sm text-gray-400 mt-0.5">Хэвлэлийн талаарх мэдээ, зөвлөгөө, заавар</p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blogCategories.map((cat) => {
                const isAct = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-5 py-2 rounded text-sm font-semibold border transition-all cursor-pointer ${
                      isAct
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-500 border-gray-300 hover:border-gray-900 hover:text-gray-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((blog, idx) => (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog.slug}`}
                  className="blog-fadein group block bg-white border border-gray-200 rounded overflow-hidden hover:border-gray-900 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.08}s`, textDecoration: 'none' }}
                >
                  {/* Image */}
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    {blog.featuredImage ? (
                      <img
                        src={getImageUrl(blog.featuredImage)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Blog'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">No Image</span>
                      </div>
                    )}
                    {blog.featured && (
                      <div className="absolute top-2.5 left-2.5 bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                        Онцлох
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-2.5">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={11} /> {formatDate(blog.publishedAt || blog.createdAt)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye size={11} /> {blog.views || 0}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <User size={11} /> {blog.author?.name || 'Admin'}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-900 tracking-wide">
                        Унших <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* ── Partners ── */}
      <section className="bg-white border-t border-gray-200 py-9">
        <div className="max-w-screen-xl mx-auto px-8 md:px-10">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-px bg-gray-300 inline-block" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Хамтрагч байгууллагууд</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Хамтран ажиллагч байгууллагууд</h2>
          </div>

          <div className="relative">
            <button
              onClick={prevPartners}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded hover:border-gray-900 transition-colors"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={nextPartners}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded hover:border-gray-900 transition-colors"
            >
              <ChevronRight size={17} />
            </button>

            <div
              ref={partnersContainerRef}
              className="scrollbar-hide flex gap-3 overflow-x-auto py-1"
              style={{ scrollBehavior: 'smooth' }}
            >
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex-shrink-0 w-48 h-28 bg-gray-50 border border-gray-200 rounded flex items-center justify-center p-5 hover:border-gray-900 transition-colors"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="text-xs font-bold text-gray-500 text-center px-2">${partner.name}</span>`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;