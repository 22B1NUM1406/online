import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, Filter, ChevronDown, Star, ShoppingCart, Heart,
  Printer, FileText, Layers, Award, Package, Tag, Search
} from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { products, categories } from '../utils/mockData';
import { formatPrice } from '../utils/helpers';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    if (activeCategory !== 'all' && product.category !== activeCategory) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return null;
    
    const icons = {
      'printing': Printer,
      'paper': FileText,
      'design': Layers,
      'business': Award,
      'packaging': Package,
      'promo': Tag
    };
    
    return icons[categoryId] || Grid;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Хэвлэлийн бүтээгдэхүүнүүд</h1>
          <p className="text-blue-100 mb-6">
            Бид чанартай хэвлэлийн бүтээгдэхүүн, мэргэжлийн дизайн үйлчилгээг санал болгодог.
          </p>
          <div className="relative max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Бүтээгдэхүүн хайх..."
              className="w-full px-6 py-3 pl-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/70 focus:outline-none focus:border-white"
            />
            <Search className="absolute left-4 top-3.5 text-white/70" size={20} />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${mobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Filter size={20} />
                Шүүлтүүр
              </h3>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Ангилал</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                    activeCategory === 'all'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Бүгд
                </button>
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {Icon && <Icon size={18} />}
                      {category.name}
                      <span className="ml-auto text-sm opacity-70">{category.subcategories.length}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Үнийн хүрээ</h4>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                />
                <div className="flex justify-between mt-4 text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Онцлог</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-700">Хямдралтай</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-700">Шинэ бүтээгдэхүүн</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-700">Хит бүтээгдэхүүн</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveCategory('all');
                setPriceRange([0, 1000000]);
                setSearchQuery('');
              }}
              className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Шүүлтүүр цэвэрлэх
            </button>
          </div>

          {/* Promo Banner */}
          <div className="mt-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
            <h4 className="font-bold text-lg mb-2">20% Хямдрал</h4>
            <p className="text-sm mb-4 text-orange-100">
              Эхний захиалга дээр 20% хөнгөлөлт аваарай
            </p>
            <Link
              to="/quotation"
              className="inline-block w-full bg-white text-orange-600 py-2 rounded-lg text-center font-semibold hover:bg-orange-50 transition-colors"
            >
              Үнийн санал авах
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter size={18} />
                  Шүүлтүүр
                </button>
                <div className="text-gray-600">
                  <span className="font-medium">{filteredProducts.length}</span> бүтээгдэхүүн олдлоо
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Онцлох</option>
                  <option value="price-low">Үнэ өсөхөөр</option>
                  <option value="price-high">Үнэ буурахаар</option>
                  <option value="rating">Үнэлгээ</option>
                  <option value="new">Шинэ</option>
                </select>

                <div className="hidden md:flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Grid size={20} />
                  </button>
                  <button className="p-2 border border-blue-600 text-blue-600 rounded-lg bg-blue-50">
                    <Grid size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Бүтээгдэхүүн олдсонгүй</h3>
              <p className="text-gray-600 mb-6">Таны хайлтанд тохирох бүтээгдэхүүн олдсонгүй</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setPriceRange([0, 1000000]);
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Шүүлтүүр цэвэрлэх
              </button>
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  &lt;
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  10
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;