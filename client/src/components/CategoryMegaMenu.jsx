import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getProducts } from '../services/api';
import { getImageUrl, formatPrice } from '../utils/helpers';

const CategoryMegaMenu = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(false);

  // Load products when hovering over a category or selecting subcategory
  useEffect(() => {
    if (hoveredCategory) {
      const categoryKey = selectedSubCategory 
        ? `${hoveredCategory._id}-${selectedSubCategory._id}`
        : hoveredCategory._id;
      
      if (!categoryProducts[categoryKey]) {
        loadCategoryProducts(hoveredCategory, selectedSubCategory);
      }
    }
  }, [hoveredCategory, selectedSubCategory]);

  const loadCategoryProducts = async (category, subCategory = null) => {
    try {
      setLoading(true);
      
      console.log('Loading products for:', {
        category: category.name,
        subCategory: subCategory?.name,
        categorySlug: category.slug,
        subCategorySlug: subCategory?.slug
      });
      
      const params = { 
        category: subCategory ? subCategory.slug : category.slug,
        limit: 8 
      };
      
      console.log('API params:', params);
      
      const data = await getProducts(params);
      
      console.log('Products received:', data.data?.length || 0);
      
      const categoryKey = subCategory 
        ? `${category._id}-${subCategory._id}`
        : category._id;
      
      setCategoryProducts(prev => ({
        ...prev,
        [categoryKey]: data.data || []
      }));
    } catch (error) {
      console.error('Error loading category products:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
    setSelectedSubCategory(null); // Reset subcategory when hovering new category
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const getCurrentProducts = () => {
    if (!hoveredCategory) return [];
    
    const categoryKey = selectedSubCategory 
      ? `${hoveredCategory._id}-${selectedSubCategory._id}`
      : hoveredCategory._id;
    
    return categoryProducts[categoryKey] || [];
  };

  return (
    <div className="relative">
      {/* Categories Horizontal Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <div
            key={category._id}
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <Link
              to={`/products?category=${category.slug}`}
              className={`block px-6 py-3 text-base font-semibold rounded-lg transition whitespace-nowrap shadow-sm ${
                hoveredCategory?._id === category._id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <span className="ml-1.5 text-sm">▼</span>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Mega Menu Dropdown */}
      {hoveredCategory && (
        <div
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded shadow-lg z-50"
        >
          <div className="flex">
            {/* Left: Subcategories Sidebar (if exists) */}
            {hoveredCategory.subcategories && hoveredCategory.subcategories.length > 0 && (
              <div className="w-48 border-r border-gray-200 bg-gray-50 p-3">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Дэд ангилал
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition ${
                      !selectedSubCategory
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Бүгд
                  </button>
                  {hoveredCategory.subcategories.map((subCat) => (
                    <button
                      key={subCat._id}
                      onClick={() => handleSubCategoryClick(subCat)}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition ${
                        selectedSubCategory?._id === subCat._id
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {subCat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Center: Products Grid */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedSubCategory 
                    ? `${hoveredCategory.name} - ${selectedSubCategory.name}`
                    : hoveredCategory.name
                  }
                </h3>
                <Link
                  to={`/products?category=${
                    selectedSubCategory 
                      ? selectedSubCategory.slug 
                      : hoveredCategory.slug
                  }`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={handleMouseLeave}
                >
                  Бүгдийг үзэх →
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {getCurrentProducts().slice(0, 6).map((product) => (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="group"
                      onClick={handleMouseLeave}
                    >
                      <div className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition">
                        <div className="relative h-40 bg-gray-50 flex items-center justify-center p-3">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x200?text=Product';
                            }}
                          />
                          {product.discount && (
                            <div className="absolute top-2 left-2 bg-orange-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                              -{product.discount}%
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            {product.discount ? (
                              <>
                                <span className="text-base font-bold text-red-600">
                                  {formatPrice(product.price * (1 - product.discount / 100))}₮
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(product.price)}₮
                                </span>
                              </>
                            ) : (
                              <span className="text-base font-bold text-gray-900">
                                {formatPrice(product.price)}₮
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && getCurrentProducts().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Бүтээгдэхүүн олдсонгүй
                </div>
              )}
            </div>

            {/* Right: Large Product Preview Image */}
            {getCurrentProducts().length > 0 && (
              <div className="hidden lg:block w-80 border-l border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
                <div className="sticky top-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Онцлох бүтээгдэхүүн
                  </h4>
                  <Link
                    to={`/products/${getCurrentProducts()[0]._id}`}
                    className="block group"
                    onClick={handleMouseLeave}
                  >
                    <div className="relative bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:border-blue-400">
                      {/* Large Product Image */}
                      <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6">
                        <img
                          src={getImageUrl(getCurrentProducts()[0].image)}
                          alt={getCurrentProducts()[0].name}
                          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=Product';
                          }}
                        />
                        {getCurrentProducts()[0].discount && (
                          <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-2 rounded-lg font-bold shadow-lg">
                            -{getCurrentProducts()[0].discount}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 bg-white">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                          {getCurrentProducts()[0].name}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-3">
                          {getCurrentProducts()[0].discount ? (
                            <>
                              <span className="text-2xl font-bold text-red-600">
                                {formatPrice(getCurrentProducts()[0].price * (1 - getCurrentProducts()[0].discount / 100))}₮
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(getCurrentProducts()[0].price)}₮
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(getCurrentProducts()[0].price)}₮
                            </span>
                          )}
                        </div>
                        <div className="inline-flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                          Дэлгэрэнгүй
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMegaMenu;