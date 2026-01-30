import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getProduct } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState(null);
  const [heartAnimating, setHeartAnimating] = useState(false);

  const inWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data.data);
    } catch (error) {
      console.error('Error loading product:', error);
      setNotification({ message: 'Бүтээгдэхүүн олдсонгүй', type: 'error' });
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setNotification({ message: 'Нэвтэрсний дараа сагсанд нэмнэ үү', type: 'info' });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    addToCart(product, quantity);
    setNotification({ message: 'Сагсанд нэмэгдлээ!', type: 'success' });
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      setNotification({ message: 'Нэвтэрсний дараа wishlist-д нэмнэ үү', type: 'info' });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    
    setHeartAnimating(true);
    const result = await toggleWishlist(product._id);
    
    setTimeout(() => setHeartAnimating(false), 300);
    
    if (result.success) {
      setNotification({ 
        message: inWishlist ? 'Wishlist-с хасагдлаа' : 'Wishlist-д нэмэгдлээ', 
        type: 'success' 
      });
    } else {
      setNotification({ message: result.message, type: 'error' });
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft size={20} />
          <span>Буцах</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
              {product.badge && (
                <div className={`absolute top-4 left-4 ${product.badgeColor || 'bg-red-500'} text-white px-4 py-2 rounded-full font-bold shadow-lg`}>
                  {product.badge}
                </div>
              )}
              <button 
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg transition-all duration-300 ${
                  heartAnimating ? 'scale-125' : 'scale-100'
                } ${inWishlist ? 'bg-red-50' : 'hover:bg-red-50'}`}
              >
                <Heart 
                  size={24} 
                  className={`transition-colors ${
                    inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={20}
                        className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-700">{product.rating}</span>
                  <span className="text-gray-400">({product.reviews} үнэлгээ)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-3">Дэлгэрэнгүй</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div className="space-y-2">
                  {product.material && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Материал:</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  {product.size && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Хэмжээ:</span>
                      <span className="font-medium">{product.size}</span>
                    </div>
                  )}
                  {product.format && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Формат:</span>
                      <span className="font-medium">{product.format}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тоо ширхэг
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center border-x-2 py-2 focus:outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">
                    Нийт: <span className="font-bold text-blue-600">{formatPrice(product.price * quantity)}</span>
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <ShoppingCart size={24} />
                Сагсанд нэмэх
              </button>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Truck className="text-green-600" size={24} />
                  <div>
                    <div className="font-semibold text-sm">Үнэгүй хүргэлт</div>
                    <div className="text-xs text-gray-600">200,000₮-с дээш</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Shield className="text-blue-600" size={24} />
                  <div>
                    <div className="font-semibold text-sm">Баталгаат</div>
                    <div className="text-xs text-gray-600">Бүх бүтээгдэхүүн баталгаатай</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      
       
      </div>
    </div>
  );
};

export default ProductDetailPage;