import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import { useState } from 'react';

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(null);

  const handleRemove = async (productId) => {
    const result = await removeFromWishlist(productId);
    setNotification({
      message: result.message,
      type: result.success ? 'success' : 'error'
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification({
      message: 'Сагсанд нэмэгдлээ!',
      type: 'success'
    });
  };

  if (loading) {
    return <Loading fullScreen />;
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

        <div className="flex items-center gap-3 mb-8">
          <Heart size={32} className="text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold text-gray-800">Хадгалсан бүтээгдэхүүн</h1>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">
            {wishlist.length}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Хадгалсан бүтээгдэхүүн байхгүй байна
            </h2>
            <p className="text-gray-600 mb-6">
              Таалагдсан бүтээгдэхүүнүүдээ хадгалж, дараа нь авах боломжтой
            </p>
            <Link 
              to="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Бүтээгдэхүүн үзэх
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map(item => {
              const product = item.product;
              return (
                <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all group border border-gray-100 relative">
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>

                  {/* Product image */}
                  <div className="relative overflow-hidden bg-gray-50">
                    <Link to={`/products/${product._id}`}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    {product.badge && (
                      <div className={`absolute top-3 left-3 ${product.badgeColor || 'bg-red-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-sm font-medium text-gray-800 mb-2 h-10 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart size={18} />
                      Сагсанд нэмэх
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;