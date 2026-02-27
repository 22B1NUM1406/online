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
          
          if (data.data && data.data.length > 0 && data.data[0]) {
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
      // Синтакс алдаа засах: optional chaining-ийг арилгах
      console.error('Error details:', (error.response && error.response.data) || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
    setSelectedSubCategory(null);
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
      {/* Categories Grid - Beautiful Design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-6">
        {categories.map((category) => (
          <div
            key={category._id}
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
            className="relative group"
          >
            <Link
              to={`/products?category=${category.slug}`}
              className="block"
            >
              {/* Category Card - Beautiful Design */}
              <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                hoveredCategory?._id === category._id
                  ? 'ring-4 ring-blue-500 ring-offset-2 scale-105 shadow-2xl'
                  : 'shadow-lg hover:shadow-xl group-hover:scale-102'
              }`}>
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none z-10"></div>
                
                {/* Image Container with Gradient Background */}
                <div className="relative h-44 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-5 overflow-hidden">
                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
                  </div>
                  
                  {categoryPreviewImages[category._id] ? (
                    <img
                      src={getImageUrl(categoryPreviewImages[category._id])}
                      alt={category.name}
                      className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x176?text=Product';
                      }}
                    />
                  ) : (
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-3 filter drop-shadow-lg animate-bounce">📦</div>
                        <div className="text-sm text-gray-500 font-medium">Бүтээгдэхүүн</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                </div>
                
                {/* Text Section with Gradient Border */}
                <div className="relative bg-white p-4 border-t-2 border-gray-100">
                  {/* Gradient accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform origin-left transition-transform duration-300 ${
                    hoveredCategory?._id === category._id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                  
                  <div className="text-center min-h-[80px] flex flex-col justify-center">
                    <span className={`text-lg font-bold line-clamp-2 leading-tight mb-2 transition-colors duration-300 ${
                      hoveredCategory?._id === category._id
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'text-gray-800 group-hover:text-gray-900'
                    }`}>
                      {category.name}
                    </span>
                    
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full">
                          <span className="text-sm font-semibold text-blue-600">
                            {category.subcategories.length}
                          </span>
                          <span className="text-xs text-gray-600">дэд</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Corner Decoration */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Mega Menu Dropdown - Beautiful Design */}
      {hoveredCategory && (
        <div
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 right-0 top-full mt-4 z-50"
        >
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Gradient Header Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="flex">
              {/* Left: Subcategories Sidebar */}
              {hoveredCategory.subcategories && hoveredCategory.subcategories.length > 0 && (
                <div className="w-64 border-r border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    <h3 className="text-base font-bold text-gray-800">Дэд ангилал</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedSubCategory(null)}
                      className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all font-medium ${
                        !selectedSubCategory
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                          : 'text-gray-700 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Бүгд</span>
                        {!selectedSubCategory && <span className="text-xs">✓</span>}
                      </div>
                    </button>
                    
                    {hoveredCategory.subcategories.map((subCat) => (
                      <button
                        key={subCat._id}
                        onClick={() => handleSubCategoryClick(subCat)}
                        className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all font-medium ${
                          selectedSubCategory?._id === subCat._id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                            : 'text-gray-700 hover:bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{subCat.name}</span>
                          {selectedSubCategory?._id === subCat._id && <span className="text-xs">✓</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Center: Products Grid - Beautiful Design */}
              <div className="flex-1 p-8 bg-gradient-to-br from-white to-gray-50/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
                      {selectedSubCategory 
                        ? `${hoveredCategory.name} - ${selectedSubCategory.name}`
                        : hoveredCategory.name
                      }
                    </h3>
                    <p className="text-sm text-gray-500">Манай шилдэг бүтээгдэхүүнүүд</p>
                  </div>
                  
                  <Link
                    to={`/products?category=${
                      selectedSubCategory 
                        ? selectedSubCategory.slug 
                        : hoveredCategory.slug
                    }`}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-semibold"
                    onClick={handleMouseLeave}
                  >
                    <span>Бүгдийг үзэх</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {getCurrentProducts().slice(0, 8).map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="group"
                        onClick={handleMouseLeave}
                      >
                        <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                          {/* Product Image with Gradient Background */}
                          <div className="relative h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl"></div>
                            
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200x200?text=Product';
                              }}
                            />
                            
                            {/* Discount Badge */}
                            {product.discount && (
                              <div className="absolute top-3 left-3 z-20">
                                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-1">
                                  <span className="text-xs">🔥</span>
                                  <span>-{product.discount}%</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          {/* Product Info */}
                          <div className="p-4 border-t-2 border-gray-100">
                            <h4 className="text-base font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors leading-tight min-h-[48px]">
                              {product.name}
                            </h4>
                            
                            <div className="flex items-baseline gap-2">
                              {product.discount ? (
                                <>
                                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                                    {formatPrice(product.price * (1 - product.discount / 100))}₮
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}₮
                                  </span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-gray-900">
                                  {formatPrice(product.price)}₮
                                </span>
                              )}
                            </div>
                            
                            {/* Hover Action Button */}
                            <button className="w-full mt-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-sm font-semibold">
                              Дэлгэрэнгүй →
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!loading && getCurrentProducts().length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <div className="text-5xl filter drop-shadow-lg">📦</div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Бүтээгдэхүүн олдсонгүй</h3>
                    <p className="text-gray-500">Удахгүй нэмэгдэнэ...</p>
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
        </div>
      )}
    </div>
  );
};

export default CategoryMegaMenu;