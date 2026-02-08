import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { getImageUrl, formatPrice } from '../utils/helpers';

const CategoryMegaMenu = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(false);

  // Load products when hovering over a category
  useEffect(() => {
    if (hoveredCategory && !categoryProducts[hoveredCategory._id]) {
      loadCategoryProducts(hoveredCategory);
    }
  }, [hoveredCategory]);

  const loadCategoryProducts = async (category) => {
    try {
      setLoading(true);
      const data = await getProducts({ 
        category: category.slug,
        limit: 8 
      });
      
      setCategoryProducts(prev => ({
        ...prev,
        [category._id]: data.data || []
      }));
    } catch (error) {
      console.error('Error loading category products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <div className="relative">
      {/* Categories Horizontal Bar */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {categories.map((category) => (
          <div
            key={category._id}
            onMouseEnter={() => handleMouseEnter(category)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <Link
              to={`/products?category=${category.slug}`}
              className={`block px-4 py-2 text-sm font-medium rounded transition whitespace-nowrap ${
                hoveredCategory?._id === category._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Mega Menu Dropdown */}
      {hoveredCategory && (
        <div
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded shadow-lg z-50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {hoveredCategory.name}
            </h3>
            <Link
              to={`/products?category=${hoveredCategory.slug}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Бүгдийг үзэх →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryProducts[hoveredCategory._id]?.slice(0, 8).map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group"
                  onClick={handleMouseLeave}
                >
                  <div className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition">
                    {/* Product Image */}
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

                    {/* Product Info */}
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

          {!loading && (!categoryProducts[hoveredCategory._id] || categoryProducts[hoveredCategory._id].length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Бүтээгдэхүүн олдсонгүй
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryMegaMenu;