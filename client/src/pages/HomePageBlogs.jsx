import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Zap, TrendingUp, Package } from 'lucide-react';
import { getBlogs, getProducts, getCategories } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import SimpleProductCard from '../components/SimpleProductCard';
import SimpleCategoryCard from '../components/SimpleCategoryCard';
import SectionHeader from '../components/SectionHeader';
import CountdownTimer from '../components/CountdownTimer';
import BrandCard from '../components/BrandCard';
import Loading from '../components/Loading';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categoryPreviewImages, setCategoryPreviewImages] = useState({});

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=1200&h=400&fit=crop",
    }
  ];

  const brands = [
    { id: 1, name: "Apple", logo: "https://via.placeholder.com/150x80?text=Apple" },
    { id: 2, name: "Dell", logo: "https://via.placeholder.com/150x80?text=Dell" },
    { id: 3, name: "HP", logo: "https://via.placeholder.com/150x80?text=HP" },
    { id: 4, name: "Lenovo", logo: "https://via.placeholder.com/150x80?text=Lenovo" },
    { id: 5, name: "Asus", logo: "https://via.placeholder.com/150x80?text=Asus" },
    { id: 6, name: "Acer", logo: "https://via.placeholder.com/150x80?text=Acer" },
  ];

  useEffect(() => {
    loadData();
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, featuredData, discountData, categoriesData] = await Promise.all([
        getProducts({ limit: 20 }),
        getProducts({ featured: true, limit: 10 }),
        getProducts({ hasDiscount: true, limit: 10 }),
        getCategories()
      ]);

      setProducts(productsData.data || []);
      setFeaturedProducts(featuredData.data || []);
      setDiscountProducts(discountData.data || []);

      // New products (sort by createdAt)
      const sorted = [...(productsData.data || [])].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNewProducts(sorted.slice(0, 10));

      setCategories(categoriesData.data || []);

      // Load category preview images
      const previews = {};
      for (const category of (categoriesData.data || [])) {
        if (category._id) {
          try {
            const catProducts = await getProducts({ category: category._id, limit: 1 });
            if (catProducts.data && catProducts.data[0]) {
              previews[category._id] = catProducts.data[0].image;
            }
          } catch (err) {
            console.error('Error loading category preview:', err);
          }
        }
      }
      setCategoryPreviewImages(previews);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider - Clean BestComputers Style */}
      <section className="relative w-full bg-gray-100">
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-all"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-blue-600 w-8' : 'bg-white/70 w-2'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid - BestComputers Style */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <SimpleCategoryCard
                key={category._id}
                category={category}
                previewImage={categoryPreviewImages[category._id]}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals - Шинээр ирсэн */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <SectionHeader
            title="Шинээр ирсэн"
            description="Саяхан нэмэгдсэн шинэ бүтээгдэхүүнүүд"
            icon={TrendingUp}
            accentColor="blue"
            viewAllLink="/products"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newProducts.map(product => (
              <SimpleProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Best Seller */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10 bg-gray-50">
          <SectionHeader
            title="BEST SELLER"
            description="Хамгийн их борлуулалттай бүтээгдэхүүнүүд"
            icon={Star}
            accentColor="yellow"
            viewAllLink="/products"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredProducts.map(product => (
              <SimpleProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Discount Products with Countdown */}
      {discountProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <SectionHeader
              title="Онцгой хямдралтай бараа"
              description="Хязгаарлагдмал хугацаанд"
              icon={Zap}
              accentColor="red"
              viewAllLink="/products"
            />
            <CountdownTimer
              endDate={new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)}
              label="Хямдрал дуусахад"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {discountProducts.map(product => (
              <SimpleProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Service Banners */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/biz-print" className="group relative h-64 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=400&fit=crop"
              alt="Biz Print"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-3xl font-bold mb-2">Biz Print</h3>
                <p className="text-lg">Мэргэжлийн хэвлэлийн үйлчилгээ</p>
              </div>
            </div>
          </Link>

          <Link to="/biz-marketing" className="group relative h-64 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=400&fit=crop"
              alt="Biz Marketing"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-3xl font-bold mb-2">Biz Marketing</h3>
                <p className="text-lg">Маркетингийн шийдэл</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Brands Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 bg-gray-50">
        <SectionHeader
          title="Брэнд"
          description="Манай хамтрагч брэндүүд"
          icon={Package}
          accentColor="purple"
          viewAllLink="/brands"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map(brand => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;