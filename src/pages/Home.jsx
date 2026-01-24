import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, Shield, Headphones, Award, Star, ArrowRight, 
  Users, Clock, CheckCircle, Printer, FileText, Layers,
  Package, Tag, ChevronRight, ShoppingCart, Heart
} from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { products } from '../utils/mockData';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'printing', name: 'Хэвлэлийн үйлчилгээ', icon: Printer, color: 'blue' },
    { id: 'paper', name: 'Цаас материал', icon: FileText, color: 'green' },
    { id: 'design', name: 'Дизайн ажил', icon: Layers, color: 'purple' },
    { id: 'business', name: 'Бизнес материал', icon: Award, color: 'orange' },
    { id: 'packaging', name: 'Савлагаа', icon: Package, color: 'red' },
    { id: 'promo', name: 'Сурталчилгаа', icon: Tag, color: 'pink' }
  ];

  const featuredProducts = products.slice(0, 8);
  const popularProducts = products.slice(4, 12);

  const CategoryCard = ({ category }) => {
    const Icon = category.icon;
    return (
      <Link 
        to="/products" 
        className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
        onClick={() => setActiveCategory(category.id)}
      >
        <div className={`w-16 h-16 bg-${category.color}-100 rounded-full flex items-center justify-center mb-4`}>
          <Icon size={24} className={`text-${category.color}-600`} />
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
        <p className="text-sm text-gray-500">Дэлгэрэнгүй үзэх →</p>
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-semibold">🎨 Мэргэжлийн хэвлэлийн үйлчилгээ</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Таны санааг<br />
                <span className="text-blue-200">бодит болгоно</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Дизайнаас эхлээд хэвлэл хүртэл бүх үйлчилгээ
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/quotation"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
                >
                  Үнийн санал авах
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/products"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all text-center"
                >
                  Үйлчилгээ үзэх
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold">10+</div>
                  <div className="text-blue-200 text-sm">Жилийн туршлага</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">5000+</div>
                  <div className="text-blue-200 text-sm">Төсөл</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">99%</div>
                  <div className="text-blue-200 text-sm">Сэтгэл ханамж</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="hidden md:block relative">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&h=500&fit=crop" 
                  alt="Office Workspace"
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white text-blue-600 p-4 rounded-xl shadow-2xl">
                  <div className="text-2xl font-bold">20%</div>
                  <div className="text-sm">Хямдрал</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-4 rounded-xl shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Truck size={20} />
                    <div>
                      <div className="font-bold">Үнэгүй</div>
                      <div className="text-xs">хүргэлт</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Үнэгүй хүргэлт</h3>
                <p className="text-sm text-gray-600">200,000₮-с дээш захиалгад</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Баталгаат ажил</h3>
                <p className="text-sm text-gray-600">Чанарт итгэлтэй</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Headphones size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">24/7 Дэмжлэг</h3>
                <p className="text-sm text-gray-600">Үргэлж бэлэн</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ангилалууд</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Хэвлэлийн бүх төрлийн үйлчилгээ, материал, дизайны ажил
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Онцлох бүтээгдэхүүн</h2>
              <p className="text-gray-600">Шилдэг чанартай хэвлэлийн бүтээгдэхүүнүүд</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              Бүгдийг харах
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Бүгдийг харах
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Хэрхэн ажилдаг вэ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Манай үйлчилгээг ашиглах нь маш хялбар. Доорх 4 алхамыг дагана уу.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">1</div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Бүтээгдэхүүн сонгох</h3>
              <p className="text-gray-600">Манай каталогаас хүссэн бүтээгдэхүүнээ сонгоно</p>
              <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 bg-blue-200 -z-10"></div>
            </div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Захиалга үүсгэх</h3>
              <p className="text-gray-600">Сагсанд нэмж захиалгаа баталгаажуулна</p>
              <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 bg-blue-200 -z-10"></div>
            </div>
            
            <div className="text-center relative">
              <div className="w-20 h-20 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">3</div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Төлбөр төлөх</h3>
              <p className="text-gray-600">Хэтэвч эсвэл QPay-аар төлбөрөө төлнө</p>
              <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 bg-blue-200 -z-10"></div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">4</div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Бэлэн болсон бүтээгдэхүүн хүлээн авах</h3>
              <p className="text-gray-600">Бид таны бүтээгдэхүүнийг хүргэж өгнө</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Эрэлттэй бүтээгдэхүүн</h2>
              <p className="text-gray-600">Хэрэглэгчдийн сонголт</p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              Бүгдийг харах
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Бүгдийг харах
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Үйлчлүүлэгчдийн сэтгэгдэл</h2>
            <p className="text-gray-600">Манай үйлчлүүлэгчдийн туршлага</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Ц. Энхбаяр",
                position: "ABC ХХК, Маркетингийн менежер",
                rating: 5,
                comment: "Бидний компанийн бүх хэвлэлийн ажлыг PRINT SHOP хариуцдаг. Чанар, хурд, мэргэжлийн хандлага гээд бүгд төгс."
              },
              {
                name: "Б. Баярмагнай",
                position: "XYZ Дээд Сургууль",
                rating: 5,
                comment: "Сурах бичиг, гарын авлага хэвлүүлэхэд PRINT SHOP-ыг сонгосон. Хамгийн сайн үнэ, чанартай ажил."
              },
              {
                name: "Г. Мөнхзаяа",
                position: "Gala Групп, Брэнд менежер",
                rating: 4,
                comment: "Брэндинг материалыг бүгдийг нэг дор хийлгэхэд тохиромжтой. Мэргэжлийн зөвлөгөө өгч, шилдэг ажил хийсэн."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.position}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Хэвлэлийн төслөө эхлүүлэхдээ бэлэн үү?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Өнөөдөр л бидэнтэй холбогдож, таны төсөлд тохирох үнийн саналыг аваарай.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quotation"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Үнийн санал авах
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Бүтээгдэхүүн үзэх
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-blue-200 text-sm">Дэмжлэг</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-blue-200 text-sm">Баталгаа</div>
            </div>
            <div>
              <div className="text-2xl font-bold">48ц</div>
              <div className="text-blue-200 text-sm">Хамгийн хурдан</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Brands */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm">Бидний итгэл үнэмшилтэй харилцагчид</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              "ABC Corp",
              "XYZ University",
              "Gala Group",
              "Mongol Bank",
              "UB City",
              "Tech Mongolia"
            ].map((brand, index) => (
              <div 
                key={index} 
                className="h-16 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-400">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;