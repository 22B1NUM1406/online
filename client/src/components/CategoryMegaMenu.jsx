import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { getProducts } from '../services/api';
import { getImageUrl, formatPrice } from '../utils/helpers';

const CategoryMegaMenu = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [categoryPreviewImages, setCategoryPreviewImages] = useState({});
  const [loading, setLoading] = useState(false);
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (categories?.length) {
      loadCategoryPreviews();
    }
  }, [categories]);

  const loadCategoryPreviews = async () => {
    try {
      const previews = {};
      for (const category of categories) {
        try {
          const data = await getProducts({ category: category.slug, limit: 1 });
          if (data.data?.length) {
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredCategory(category);
    setSelectedSubCategory(null);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
      setSelectedSubCategory(null);
    }, 150);
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
      {/* Categories Grid - Minimal & Clean */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-6">
        {categories.map((category) => (
          <div
            key={category._id}
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
            className="relative group cursor-pointer"
          >
            <Link to={`/products?category=${category.slug}`} className="block">
              {/* Simple Card */}
              <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:border-gray-200 hover:shadow-sm">
                {/* Image Container */}
                <div className="relative aspect-square bg-gray-50 p-4">
                  {categoryPreviewImages[category._id] ? (
                    <img
                      src={getImageUrl(categoryPreviewImages[category._id])}
                      alt={category.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl text-gray-300">📦</span>
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <div className="p-3 text-center border-t border-gray-50">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 line-clamp-1">
                    {category.name}
                  </span>
                  {category.subcategories?.length > 0 && (
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      {category.subcategories.length} дэд
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Mega Menu Dropdown - Clean Design */}
      {hoveredCategory && (
        <div
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 right-0 top-full mt-2 z-50"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Simple Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedSubCategory ? selectedSubCategory.name : hoveredCategory.name}
                </h3>
                <Link
                  to={`/products?category=${selectedSubCategory?.slug || hoveredCategory.slug}`}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  onClick={handleMouseLeave}
                >
                  Бүгдийг үзэх
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            <div className="flex">
              {/* Subcategories - Minimal */}
              {hoveredCategory.subcategories?.length > 0 && (
                <div className="w-48 border-r border-gray-100 bg-gray-50/30 p-3">
                  <div className="space-y-0.5">
                    <button
                      onClick={() => setSelectedSubCategory(null)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        !selectedSubCategory
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Бүгд
                    </button>
                    
                    {hoveredCategory.subcategories.map((subCat) => (
                      <button
                        key={subCat._id}
                        onClick={() => handleSubCategoryClick(subCat)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedSubCategory?._id === subCat._id
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {subCat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Grid - Clean Cards */}
              <div className="flex-1 p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
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
                        <div className="relative">
                          {/* Image */}
                          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2 border border-gray-100">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                            />
                            
                            {/* Discount Badge - Simple */}
                            {product.discount && (
                              <div className="absolute top-2 left-2 bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded">
                                -{product.discount}%
                              </div>
                            )}
                          </div>
                          
                          {/* Content */}
                          <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-gray-600">
                            {product.name}
                          </h4>
                          
                          <div className="flex items-baseline gap-1">
                            {product.discount ? (
                              <>
                                <span className="text-sm font-semibold text-gray-900">
                                  {formatPrice(product.price * (1 - product.discount / 100))}₮
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(product.price)}₮
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-gray-900">
                                {formatPrice(product.price)}₮
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!loading && getCurrentProducts().length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-gray-400">Бүтээгдэхүүн олдсонгүй</p>
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