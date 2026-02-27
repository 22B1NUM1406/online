import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getProducts } from '../services/api';
import { getImageUrl, formatPrice } from '../utils/helpers';

const CategoryMegaMenu = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [categoryPreviewImages, setCategoryPreviewImages] = useState({});
  const [loading, setLoading] = useState(false);

  // Load preview images for all categories on mount
  useEffect(() => {
    if (categories && categories.length > 0) {
      loadCategoryPreviews();
    }
  }, [categories]);

  // Load first product image for each category
  const loadCategoryPreviews = async () => {
    try {
      const previews = {};
      
      for (const category of categories) {
        try {
          const data = await getProducts({ 
            category: category.slug,
            limit: 1 
          });
          
          if (data.data && data.data.length > 0) {
            previews[category._id] = data.data[0].image;
          }
        } catch (error) {
          console.error(`Error loading preview for ${category.name}:`, error);
        }
      }
      
      setCategoryPreviewImages(previews);
    } catch (error) {
      console.error('Error loading category previews:', error);
    }
  };

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
    <div className="relative w-full">
      {/* Categories Grid - 6 columns, full width, larger cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-6">
        {categories.map((category) => (
          <div
            key={category._id}
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <Link
              to={`/products?category=${category.slug}`}
              className={`block rounded-2xl transition-all overflow-hidden ${
                hoveredCategory?._id === category._id
                  ? 'ring-4 ring-blue-500 ring-offset-2 scale-105 shadow-2xl'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Category Card - Much Larger */}
              <div className={`bg-white border-2 transition-all ${
                hoveredCategory?._id === category._id
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                {/* Image - Much Larger */}
                <div className="h-44 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-5">
                  {categoryPreviewImages[category._id] ? (
                    <img
                      src={getImageUrl(categoryPreviewImages[category._id])}
                      alt={category.name}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x176?text=Product';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-3">📦</div>
                        <div className="text-sm text-gray-400">Бүтээгдэхүүн</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Text - Larger */}
                <div className="p-4 text-center border-t border-gray-100 min-h-[80px] flex flex-col justify-center">
                  <span className={`text-lg font-bold line-clamp-2 leading-tight mb-1 ${
                    hoveredCategory?._id === category._id
                      ? 'text-blue-600'
                      : 'text-gray-800'
                  }`}>
                    {category.name}
                  </span>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-500">
                      <span className="font-medium">{category.subcategories.length} дэд ангилал</span>
                      <span className="text-blue-500 font-bold">▼</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Mega Menu Dropdown - Full Width */}
      {hoveredCategory && (
        <div
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 right-0 top-full mt-3 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50"
        >
          <div className="flex">
            {/* Left: Subcategories Sidebar (if exists) */}
            {hoveredCategory.subcategories && hoveredCategory.subcategories.length > 0 && (
              <div className="w-56 border-r border-gray-200 bg-gray-50 p-4">
                <div className="text-sm font-bold text-gray-700 mb-3">
                  Дэд ангилал
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className={`w-full text-left px-4 py-3 text-sm rounded-lg transition font-medium ${
                      !selectedSubCategory
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Бүгд
                  </button>
                  {hoveredCategory.subcategories.map((subCat) => (
                    <button
                      key={subCat._id}
                      onClick={() => handleSubCategoryClick(subCat)}
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg transition font-medium ${
                        selectedSubCategory?._id === subCat._id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {subCat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Center: Products Grid - Larger */}
            <div className="flex-1 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
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
                  className="text-base text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                  onClick={handleMouseLeave}
                >
                  Бүгдийг үзэх
                  <ChevronRight size={18} />
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {getCurrentProducts().slice(0, 8).map((product) => (
                    <Link
                      key={product._id}
                      to={`/products/${product._id}`}
                      className="group"
                      onClick={handleMouseLeave}
                    >
                      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all">
                        <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x200?text=Product';
                            }}
                          />
                          {product.discount && (
                            <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                              -{product.discount}%
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            {product.discount ? (
                              <>
                                <span className="text-lg font-bold text-red-600">
                                  {formatPrice(product.price * (1 - product.discount / 100))}₮
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(product.price)}₮
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
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
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg">Бүтээгдэхүүн олдсонгүй</p>
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