import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, User, Eye, ArrowRight, Star, Zap } from 'lucide-react';
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

  useEffect(() => { loadBlogs(); }, [selectedCategory, searchTerm]);

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
      if (searchTerm) params.search = searchTerm;
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

  const S = {
    page: {
      minHeight: '100vh',
      background: '#f5f5f3',
      fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
    },
    inner: {
      maxWidth: '1280px',
      margin: '0 auto',
    },
    sectionLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#888',
      marginBottom: '10px',
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1a1a2e',
      letterSpacing: '-0.02em',
      margin: '0 0 4px',
    },
    sectionDesc: {
      fontSize: '13px',
      color: '#888',
      margin: 0,
    },
    divider: {
      height: '1px',
      background: '#e2e2e2',
    },
    viewAll: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#1a1a2e',
      textDecoration: 'none',
      letterSpacing: '0.02em',
      borderBottom: '1px solid #1a1a2e',
      paddingBottom: '1px',
      whiteSpace: 'nowrap',
    },
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .blog-fadein { animation: fadeIn 0.7s ease-out both; }
        @media (max-width: 1024px) { .blog-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr !important; }
          .section-inner { padding: 24px 16px !important; }
          .banner-grid { grid-template-columns: 1fr !important; }
          .mega-dropdown-inner { flex-direction: column !important; }
          .mega-subcategory-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid #ebebeb !important; }
          .mega-featured-panel { display: none !important; }
          .mega-product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .banner-grid { grid-template-columns: 1fr !important; }
          .mega-product-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .mega-featured-panel { display: none !important; }
        }
        .hero-active { animation: heroUp 0.65s ease forwards; }
        .hero-cta:hover { background: #f0f0f0 !important; }
        .nav-btn:hover { background: rgba(255,255,255,0.92) !important; }
        .blog-card:hover { border-color: #1a1a2e !important; box-shadow: 0 6px 24px rgba(26,26,46,0.1) !important; transform: scale(1.02) !important; }
        .blog-card { transition: all 0.3s ease !important; }
        .blog-card:hover .blog-img { transform: scale(1.08) !important; }
        .blog-card:hover .blog-title { color: #1a1a2e !important; }
        .banner-card:hover { box-shadow: 0 10px 32px rgba(26,26,46,0.18) !important; }
        .partner-item:hover { border-color: #1a1a2e !important; }
        .cat-filter-btn:hover { border-color: #1a1a2e !important; color: #1a1a2e !important; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .partner-nav:hover { border-color: #1a1a2e !important; }
      `}</style>

      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}

      {/* ── Hero ── */}
      <section style={{ background: '#0d0d1a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: '580px' }}>
          {heroSlides.map((slide, i) => (
            <div
              key={slide.id}
              style={{
                position: 'absolute', inset: 0,
                opacity: i === currentSlide ? 1 : 0,
                transition: 'opacity 0.9s ease',
                zIndex: i === currentSlide ? 1 : 0,
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(10,10,24,0.88) 0%, rgba(10,10,24,0.55) 55%, rgba(10,10,24,0.12) 100%)',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
                background: 'linear-gradient(to top, rgba(13,13,26,0.55), transparent)',
              }} />

              <div style={{ ...S.inner, position: 'relative', zIndex: 2, height: '100%', padding: '0 32px', display: 'flex', alignItems: 'center' }}>
                {i === currentSlide && (
                  <div className="hero-active" style={{ maxWidth: '540px' }}>
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '20px', fontWeight: '700',
                      letterSpacing: '0.01em',
                      padding: '5px 14px', borderRadius: '3px', marginBottom: '16px',
                    }}>
                      {slide.label}
                    </div>

                    <h1 style={{
                      fontSize: '20px', fontWeight: '700', color: '#ffffff',
                      lineHeight: '1.4', letterSpacing: '-0.01em', marginBottom: '14px',
                    }}>
                      {slide.title}
                    </h1>

                    <p style={{
                      fontSize: '15px', color: 'rgba(255,255,255,0.6)',
                      lineHeight: '1.6', marginBottom: '30px', fontWeight: '400',
                    }}>
                      {slide.description}
                    </p>

                    <Link
                      to="/contact"
                      className="hero-cta"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '11px 24px', background: '#ffffff', color: '#1a1a2e',
                        borderRadius: '4px', fontSize: '13px', fontWeight: '700',
                        textDecoration: 'none', letterSpacing: '0.02em',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      Холбоо барих <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Prev/Next */}
          {[
            { fn: prevSlide, Icon: ChevronLeft, pos: { left: '20px' } },
            { fn: nextSlide, Icon: ChevronRight, pos: { right: '20px' } },
          ].map(({ fn, Icon, pos }) => (
            <button
              key={JSON.stringify(pos)}
              onClick={fn}
              className="nav-btn"
              style={{
                position: 'absolute', ...pos, top: '50%', transform: 'translateY(-50%)',
                zIndex: 10, background: 'rgba(255,255,255,0.16)',
                border: '1px solid rgba(255,255,255,0.28)', borderRadius: '4px',
                padding: '10px', cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', transition: 'background 0.2s ease',
              }}
            >
              <Icon size={18} />
            </button>
          ))}

          {/* Dots */}
          <div style={{
            position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '6px', zIndex: 10,
          }}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  height: '3px',
                  width: i === currentSlide ? '28px' : '8px',
                  borderRadius: '2px', border: 'none', cursor: 'pointer',
                  background: i === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.38)',
                  transition: 'all 0.3s ease', padding: 0,
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <div style={{
            position: 'absolute', bottom: '24px', right: '32px', zIndex: 10,
            fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.05em',
          }}>
            {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <div style={{ ...S.inner, padding: '0 24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e2e2', borderTop: 'none' }}>

          {/* Category Menu */}
          {categories.length > 0 && (
            <section style={{ padding: '32px 28px 28px' }}>
              <p style={S.sectionLabel}>
                <span style={{ width: '20px', height: '1px', background: '#ccc', display: 'inline-block' }} />
                Ангилал
              </p>
              <CategoryMegaMenu categories={categories} />
            </section>
          )}

          <div style={S.divider} />

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section style={{ padding: '44px 28px' }} id="featured-products" className="section-inner">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <p style={S.sectionLabel}>
                    <span style={{ width: '20px', height: '1px', background: '#ccc', display: 'inline-block' }} />
                    Онцлох бүтээгдэхүүн
                  </p>
                  <h2 style={{ ...S.sectionTitle, fontSize: '26px' }}>Шилдэг бүтээгдэхүүнүүд</h2>
                  <p style={{ ...S.sectionDesc, fontSize: '14px' }}>Манай байгууллагаас санал болгож буй шилдэг сонголтууд</p>
                </div>
                <Link to="/biz-print" style={S.viewAll}>Бүгдийг үзэх <ArrowRight size={12} /></Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {featuredProducts.map(product => <SimpleProductCard key={product._id} product={product} />)}
              </div>
            </section>
          )}

          <div style={S.divider} />

          {/* Service Banners */}
          <section style={{ padding: '32px 28px' }}>
            <div className="banner-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                <Link key={item.to} to={item.to} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    className="banner-card"
                    style={{
                      position: 'relative', height: '200px', borderRadius: '5px',
                      overflow: 'hidden', border: '1px solid #ddd',
                      transition: 'box-shadow 0.2s ease',
                    }}
                  >
                    <img
                      src={item.img} alt={item.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(to right, ${item.bg}f0 0%, ${item.bg}99 55%, ${item.bg}30 100%)`,
                    }} />
                    <div style={{ position: 'absolute', inset: 0, padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: '6px' }}>
                        {item.tag}
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 5px', letterSpacing: '-0.01em' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '0 0 14px' }}>
                        {item.desc}
                      </p>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: '#fff', color: item.bg,
                        padding: '7px 16px', borderRadius: '3px',
                        fontSize: '11px', fontWeight: '700',
                        letterSpacing: '0.02em', width: 'fit-content',
                      }}>
                        Дэлгэрэнгүй <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div style={S.divider} />

          {/* Discount Products */}
          {discountProducts.length > 0 && (
            <section style={{ padding: '44px 28px', background: '#fafafa' }} id="discount-products" className="section-inner">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <p style={S.sectionLabel}>
                    <span style={{ width: '20px', height: '1px', background: '#ccc', display: 'inline-block' }} />
                    Хямдрал
                  </p>
                  <h2 style={{ ...S.sectionTitle, fontSize: '26px' }}>Хямдралтай бүтээгдэхүүн</h2>
                  <p style={{ ...S.sectionDesc, fontSize: '14px' }}>Онцгой үнээр санал болгож байна</p>
                </div>
                <Link to="/biz-print" style={S.viewAll}>Бүгдийг үзэх <ArrowRight size={12} /></Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {discountProducts.slice(0, 10).map(product => <SimpleProductCard key={product._id} product={product} />)}
              </div>
            </section>
          )}

          <div style={S.divider} />

          {/* Blog */}
          <section style={{ padding: '44px 28px' }} className="section-inner">
            <div style={{ marginBottom: '24px' }}>
              <p style={S.sectionLabel}>
                <span style={{ width: '20px', height: '1px', background: '#ccc', display: 'inline-block' }} />
                Блог
              </p>
              <h2 style={{ ...S.sectionTitle, fontSize: '26px' }}>Сүүлийн нийтлэлүүд</h2>
              <p style={{ ...S.sectionDesc, fontSize: '14px' }}>Хэвлэлийн талаарх мэдээ, зөвлөгөө, заавар</p>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {blogCategories.map((cat) => {
                const isAct = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={isAct ? '' : 'cat-filter-btn'}
                    style={{
                      padding: '8px 20px', borderRadius: '3px',
                      border: `1.5px solid ${isAct ? '#1a1a2e' : '#dedede'}`,
                      background: isAct ? '#1a1a2e' : '#fff',
                      color: isAct ? '#fff' : '#555',
                      fontSize: '13px', fontWeight: '600',
                      cursor: 'pointer', letterSpacing: '0.02em',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {blogs.map((blog, idx) => (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog.slug}`}
                  className="blog-card blog-fadein"
                  style={{
                    textDecoration: 'none', display: 'block',
                    background: '#fff', border: '1.5px solid #e8e8e8',
                    borderRadius: '5px', overflow: 'hidden',
                    animationDelay: `${idx * 0.08}s`,
                  }}
                >
                  <div style={{ height: '210px', background: '#f2f2f2', overflow: 'hidden', position: 'relative' }}>
                    {blog.featuredImage ? (
                      <img
                        src={getImageUrl(blog.featuredImage)} alt={blog.title}
                        className="blog-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Blog'; }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#c0c0c0', letterSpacing: '0.06em' }}>NO IMAGE</span>
                      </div>
                    )}
                    {blog.featured && (
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: '#1a1a2e', color: '#fff',
                        fontSize: '9px', fontWeight: '700',
                        padding: '3px 10px', borderRadius: '2px', letterSpacing: '0.08em', textTransform: 'uppercase',
                      }}>
                        Онцлох
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '18px 20px 20px' }}>
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '10px' }}>
                      {[{ Icon: Calendar, text: formatDate(blog.publishedAt || blog.createdAt) }, { Icon: Eye, text: blog.views || 0 }].map(({ Icon, text }, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#b0b0b0' }}>
                          <Icon size={12} />{text}
                        </span>
                      ))}
                    </div>

                    <h3
                      className="blog-title"
                      style={{
                        fontSize: '16px', fontWeight: '600', color: '#2a2a2a',
                        lineHeight: '1.45', marginBottom: '8px',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        transition: 'color 0.15s ease',
                      }}
                    >
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p style={{
                        fontSize: '13px', color: '#999', lineHeight: '1.6', marginBottom: '14px',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {blog.excerpt}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#b0b0b0' }}>
                        <User size={12} />{blog.author?.name || 'Admin'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: '#1a1a2e', letterSpacing: '0.02em' }}>
                        Унших <ArrowRight size={12} />
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
      <section style={{ padding: '36px 0', borderTop: '1px solid #e2e2e2', background: '#fff' }}>
        <div style={{ ...S.inner, padding: '0 40px' }}>
          <div style={{ marginBottom: '22px' }}>
            <p style={S.sectionLabel}>
              <span style={{ width: '20px', height: '1px', background: '#ccc', display: 'inline-block' }} />
              Хамтрагч байгууллагууд
            </p>
            <h2 style={S.sectionTitle}>Хамтран ажиллагч байгууллагууд</h2>
          </div>

          <div style={{ position: 'relative' }}>
            {[
              { fn: prevPartners, Icon: ChevronLeft, style: { left: '-20px' } },
              { fn: nextPartners, Icon: ChevronRight, style: { right: '-20px' } },
            ].map(({ fn, Icon, style: ps }) => (
              <button
                key={JSON.stringify(ps)}
                onClick={fn}
                className="partner-nav"
                style={{
                  position: 'absolute', ...ps, top: '50%', transform: 'translateY(-50%)',
                  background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: '4px',
                  padding: '7px', cursor: 'pointer', zIndex: 1, display: 'flex',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <Icon size={17} />
              </button>
            ))}

            <div
              ref={partnersContainerRef}
              className="scrollbar-hide"
              style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollBehavior: 'smooth', padding: '4px 0' }}
            >
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="partner-item"
                  style={{
                    flexShrink: 0, width: '200px', height: '110px',
                    background: '#fafafa', border: '1.5px solid #e8e8e8',
                    borderRadius: '4px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '20px', transition: 'border-color 0.15s ease',
                  }}
                >
                  <img
                    src={partner.logo} alt={partner.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span style="font-size:11px;font-weight:700;color:#888;text-align:center;padding:0 8px">${partner.name}</span>`;
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