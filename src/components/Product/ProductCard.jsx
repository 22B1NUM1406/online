import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
        <div className="relative overflow-hidden bg-gray-50">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <div className={`absolute top-3 left-3 ${product.badgeColor || 'bg-red-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
              {product.badge}
            </div>
          )}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to wishlist functionality
            }}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50"
          >
            <Heart size={18} className="text-gray-600 hover:text-red-500" />
          </button>
          
          {/* Discount badge */}
          {product.discount && (
            <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              -{product.discount}%
            </div>
          )}
        </div>
        
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-gray-500 mb-1 uppercase">
            {getCategoryName(product.category)}
          </div>
          
          {/* Product Name */}
          <h3 className="font-medium text-gray-800 mb-2 h-10 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <ShoppingCart size={18} />
            Сагсанд нэмэх
          </button>
          
          {/* Quick Info */}
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>2-4 хоног</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Баталгаатай</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const categories = {
    'cards': 'Нэрийн хуудас',
    'catalog': 'Каталог',
    'flyer': 'Флаер',
    'logo': 'Дизайн',
    'banner': 'Баннер',
    'brochure': 'Брошюр',
    'sticker': 'Наалт',
    'branding': 'Брэндинг',
    'offset': 'Офсет',
    'digital': 'Дижитал',
    'box': 'Савлагаа',
    'office': 'Цаас'
  };
  
  return categories[categoryId] || categoryId;
};

export default ProductCard;