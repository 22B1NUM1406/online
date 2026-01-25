import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
            <ArrowLeft size={20} />
            <span>Үргэлжлүүлэх</span>
          </Link>
          
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Таны сагс хоосон байна
            </h2>
            <p className="text-gray-600 mb-6">
              Хэвлэлийн үйлчилгээ сонгож эхлээрэй
            </p>
            <Link 
              to="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Худалдан авалт хийх
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft size={20} />
          <span>Үргэлжлүүлэх</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Миний сагс</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.material}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Захиалгын дүн</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Бүтээгдэхүүн ({cart.length})</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Хүргэлт</span>
                  <span className="text-green-600">Үнэгүй</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Нийт</span>
                  <span className="text-blue-600">{formatPrice(getCartTotal())}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Төлбөр төлөх
                <ChevronRight size={20} />
              </button>
              
              <Link 
                to="/"
                className="block text-center mt-4 text-blue-600 hover:text-blue-700"
              >
                Үргэлжлүүлэх
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;