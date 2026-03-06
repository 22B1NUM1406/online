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

  useEffect(() => {
    if (categories?.length > 0) {
      loadCategoryPreviews();
    }
  }, [categories]);

  const loadCategoryPreviews = async () => {
    try {
      const previews = {};
      
      for (const category of categories) {
        try {
          const data = await getProducts({ 
            category: category.slug,
            limit: 1 
          });
          
          if (data.data?.[0]) {
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
      
      const params = { 
        category: subCategory ? subCategory.slug : category.slug,
        limit: 8 
      };
      
      const data = await getProducts(params);
      
      const categoryKey = subCategory 
        ? `${category._id}-${subCategory._id}`
        : category._id;
      
      setCategoryProducts(prev => ({
        ...prev,
        [categoryKey]: data.data || []
      }));
    } catch (error) {
      console.error('Error loading category products:', error);
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

  if (!categories?.length) return null;

  return (
    <div className="relative w-full">
      {/* Categories Grid - Professional & Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
            onClick={() => setHoveredCategory(category)}
            className="group cursor-pointer"
          >
            <Link to={`/products?category=${category.slug}`}>
              {/* Clean Category Card */}
              <div className={`bg-white border rounded-lg overflow-hidden transition-all duration-200 ${
                hoveredCategory?._id === category._id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}>
                
                {/* Image Container - Clean */}
                <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-4">
                  {categoryPreviewImages[category._id] ? (
                    <img
                      src={getImageUrl(categoryPreviewImages[category._id])}
                      alt={category.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=Category';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">📦</div>
                      <div className="text-xs text-gray-400">Бүтээгдэхүүн</div>
                    </div>
                  )}
                </div>
                
                {/* Text Section - Clean */}
                <div className="p-3 border-t border-gray-100">
                  <h3 className={`text-sm font-semibold text-center line-clamp-2 transition-colors ${
                    hoveredCategory?._id === category._id
                      ? 'text-blue-600'
                      : 'text-gray-900 group-hover:text-gray-700'
                  }`}>
                    {category.name}
                  </h3>
                  
                  {category.subcategories?.length > 0 && (
                    <div className="mt-2 text-center">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {category.subcategories.length} дэд ангилал
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Mega Menu Dropdown - Professional */}
      {hoveredCategory && (
        <div
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 right-0 top-full mt-2 z-50"
        >
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden">
            
            <div className="flex">
              {/* Left: Subcategories */}
              {hoveredCategory.subcategories?.length > 0 && (
                <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Дэд ангилал
                  </h3>
                  
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedSubCategory(null)}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
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
                        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
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
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedSubCategory 
                        ? `${hoveredCategory.name} - ${selectedSubCategory.name}`
                        : hoveredCategory.name
                      }
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Шилдэг бүтээгдэхүүнүүд</p>
                  </div>
                  
                  <Link
                    to="/biz-print"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    onClick={handleMouseLeave}
                  >
                    <span>Бүгдийг үзэх</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {getCurrentProducts().slice(0, 8).map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="group"
                        onClick={handleMouseLeave}
                      >
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all">
                          
                          {/* Product Image */}
                          <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-3">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200x200?text=Product';
                              }}
                            />
                            
                            {product.discount && (
                              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                -{product.discount}%
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-3 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors min-h-[40px]">
                              {product.name}
                            </h4>
                            
                            <div className="flex items-baseline gap-2">
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
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="text-3xl">📦</div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Бүтээгдэхүүн олдсонгүй</h3>
                    <p className="text-sm text-gray-500">Удахгүй нэмэгдэнэ</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMegaMenu;