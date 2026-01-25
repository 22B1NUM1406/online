import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { useState } from 'react';

const ProductCard = ({ product, onAddToCart, onWishlistToggle }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [heartAnimating, setHeartAnimating] = useState(false);

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product);
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setHeartAnimating(true);
    const result = await toggleWishlist(product._id);
    
    setTimeout(() => setHeartAnimating(false), 300);
    
    if (onWishlistToggle) {
      onWishlistToggle(result);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100">
      <div className="relative overflow-hidden bg-gray-50">
        <img 
          src={getImageUrl(product.image)} 
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          onClick={() => navigate(`/products/${product._id}`)}
          onError={(e) => {
            e.target.src = '/placeholder.png'; // Fallback
          }}
        />
        {product.badge && (
          <div className={`absolute top-3 left-3 ${product.badgeColor || 'bg-red-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
            {product.badge}
          </div>
        )}
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
          onClick={handleWishlistToggle}
        >
          <Heart 
            size={18} 
            className={`transition-all ${heartAnimating ? 'scale-125' : ''} ${
              inWishlist 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600'
            }`} 
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 
          className="text-sm font-medium text-gray-800 mb-2 h-10 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
          onClick={() => navigate(`/products/${product._id}`)}
        >
          {product.name}
        </h3>
        
        {product.rating && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
        >
          <ShoppingCart size={18} />
          Захиалах
        </button>
      </div>
    </div>
  );
};

export default ProductCard;