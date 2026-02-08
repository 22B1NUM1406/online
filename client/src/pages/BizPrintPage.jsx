import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Package } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import Notification from '../components/Notification';

const BizPrintPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showAll, setShowAll] = useState(false);

  const INITIAL_DISPLAY_COUNT = 6; // Анхдаа 6 бүтээгдэхүүн харуулах

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts();
    setShowAll(false); // Категори эсвэл хайлт солих үед буцааж хураах
  }, [selectedCategory, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load categories
      const catData = await getCategories();
      setCategories(catData.data);
      
      // Load products
      await loadProducts();
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Өгөгдөл ачааллахад алдаа гарлаа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const params = {};
      if (selectedCategory) {
        // Find category by ID and use its slug
        const allCategories = categories.flatMap(c => [c, ...(c.subcategories || [])]);
        const category = allCategories.find(c => c._id === selectedCategory);
        if (category) {
          params.category = category.slug; // Use slug, not ID
        }
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const data = await getProducts(params);
      setProducts(data.data);
    } catch (error) {
      console.error('Error loading products:', error);
      showNotification('Бүтээгдэхүүн ачааллахад алдаа гарлаа', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
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

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Biz Print
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            Хэвлэлийн бүтээгдэхүүн - Өндөр чанар, Хурдан хүргэлт
          </p>

          {/* Search */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Бүтээгдэхүүн хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package size={20} className="text-blue-600" />
                Ангилал
              </h3>

              {/* All Products */}
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                  !selectedCategory 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                Бүх бүтээгдэхүүн
              </button>

              {/* Categories Tree */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category._id}>
                      {/* Main Category */}
                      <div className="flex items-center gap-1">
                        {category.subcategories && category.subcategories.length > 0 && (
                          <button
                            onClick={() => toggleCategory(category._id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {expandedCategories[category._id] ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleCategorySelect(category._id)}
                          className={`flex-1 text-left px-4 py-2 rounded-lg transition-colors ${
                            selectedCategory === category._id
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {category.name}
                        </button>
                      </div>

                      {/* Subcategories */}
                      {expandedCategories[category._id] && 
                       category.subcategories && 
                       category.subcategories.length > 0 && (
                        <div className="ml-6 mt-1 space-y-1">
                          {category.subcategories.map((sub) => (
                            <button
                              key={sub._id}
                              onClick={() => handleCategorySelect(sub._id)}
                              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                                selectedCategory === sub._id
                                  ? 'bg-blue-100 text-blue-700 font-medium'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            {/* Selected Category Info */}
            {selectedCategory && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-blue-900">
                      {categories
                        .flatMap(c => [c, ...(c.subcategories || [])])
                        .find(c => c._id === selectedCategory)?.name}
                    </h2>
                    <p className="text-sm text-blue-700">
                      {products.length} бүтээгдэхүүн олдлоо
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Цэвэрлэх ✕
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Бүтээгдэхүүн олдсонгүй
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Хайлтын үр дүн олдсонгүй. Өөр түлхүүр үг ашиглана уу.'
                    : 'Энэ ангилалд бүтээгдэхүүн байхгүй байна.'
                  }
                </p>
                {(selectedCategory || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchTerm('');
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Бүх бүтээгдэхүүн харах
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(showAll ? products : products.slice(0, INITIAL_DISPLAY_COUNT)).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Show More/Less Button */}
                {products.length > INITIAL_DISPLAY_COUNT && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <span className="font-semibold">
                        {showAll ? 'Хураах' : 'Дэлгэрэнгүй харах'}
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-300 ${
                          showAll ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <p className="mt-3 text-sm text-gray-500">
                      {showAll 
                        ? `${products.length} бүтээгдэхүүн харагдаж байна`
                        : `${INITIAL_DISPLAY_COUNT} / ${products.length} бүтээгдэхүүн`
                      }
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BizPrintPage;