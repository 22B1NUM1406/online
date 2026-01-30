import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Wallet, CreditCard, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, createQPayInvoice } from '../services/api';
import { formatPrice } from '../utils/helpers';
import Notification from '../components/Notification';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, updateWallet } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    paymentMethod: 'wallet',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitShipping = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Check wallet balance if paying with wallet
    if (formData.paymentMethod === 'wallet' && user.wallet < getCartTotal()) {
      setNotification({ 
        message: 'Хэтэвчний үлдэгдэл хүрэлцэхгүй байна', 
        type: 'error' 
      });
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        shippingInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const result = await createOrder(orderData);
      const orderId = result.data._id;
      
      // Handle payment method
      if (formData.paymentMethod === 'wallet') {
        // Wallet payment - instant
        updateWallet(user.wallet - getCartTotal());
        clearCart();
        setNotification({ 
          message: 'Захиалга амжилттай илгээгдлээ!', 
          type: 'success' 
        });
        setTimeout(() => navigate('/profile'), 1500);
        
      } else if (formData.paymentMethod === 'qpay') {
        // QPay payment - redirect to payment page
        try {
          const qpayResult = await createQPayInvoice(orderId);
          
          clearCart();
          
          // Navigate to payment page with QPay data
          navigate(`/payment/${orderId}`, {
            state: {
              qrImage: qpayResult.data.qr_image,
              qrText: qpayResult.data.qr_text,
              urls: qpayResult.data.urls,
              invoiceId: qpayResult.data.invoice_id,
              orderNumber: qpayResult.data.order?.orderNumber,
              amount: qpayResult.data.order?.amount || getCartTotal()
            }
          });
        } catch (qpayError) {
          console.error('QPay error:', qpayError);
          setNotification({ 
            message: 'QPay invoice үүсгэхэд алдаа гарлаа', 
            type: 'error' 
          });
        }
      } else {
        // Other payment methods (cash, etc)
        clearCart();
        setNotification({ 
          message: 'Захиалга амжилттай илгээгдлээ!', 
          type: 'success' 
        });
        setTimeout(() => navigate('/profile'), 1500);
      }
      
    } catch (error) {
      console.error('Order error:', error);
      setNotification({ 
        message: error.response?.data?.message || 'Захиалгад алдаа гарлаа', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Сагс хоосон байна</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Худалдан авалт үргэлжлүүлэх
          </Link>
        </div>
      </div>
    );
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

      <div className="max-w-4xl mx-auto px-4">
        <Link 
          to={step === 1 ? '/cart' : '#'}
          onClick={(e) => { if (step === 2) { e.preventDefault(); setStep(1); }}}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Буцах</span>
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
          </div>
        </div>

        {/* Step 1: Shipping Info */}
        {step === 1 && (
          <form onSubmit={handleSubmitShipping} className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Хүргэлтийн мэдээлэл</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Нэр <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Овог нэр"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Утасны дугаар <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="99112233"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    И-мэйл <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хаяг <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Дэлгэрэнгүй хаяг"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тэмдэглэл (заавал биш)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Нэмэлт тэмдэглэл..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Үргэлжлүүлэх
              <ChevronRight size={20} />
            </button>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-6">
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Төлбөрийн хэлбэр</h2>
              
              <div className="space-y-4">
                {/* Wallet Option */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'wallet' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={formData.paymentMethod === 'wallet'}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <Wallet size={32} className="text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">Хэтэвч</div>
                    <div className="text-sm text-gray-600">
                      Үлдэгдэл: {formatPrice(user?.wallet || 0)}
                    </div>
                  </div>
                  {user?.wallet < getCartTotal() && (
                    <span className="text-xs text-red-500">Үлдэгдэл хүрэлцэхгүй</span>
                  )}
                </label>

                {/* QPay Option */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'qpay' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qpay"
                    checked={formData.paymentMethod === 'qpay'}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <CreditCard size={32} className="text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">QPay</div>
                    <div className="text-sm text-gray-600">Банкны картаар төлөх</div>
                  </div>
                </label>

                {/* Cash Option */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.paymentMethod === 'cash' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <CreditCard size={32} className="text-green-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">Бэлэн мөнгө</div>
                    <div className="text-sm text-gray-600">Хүргэлтийн үед төлнө</div>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || (formData.paymentMethod === 'wallet' && user?.wallet < getCartTotal())}
                className="w-full mt-6 bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Түр хүлээнэ үү...'
                ) : (
                  <>
                    <Check size={24} />
                    Захиалга баталгаажуулах
                  </>
                )}
              </button>
            </form>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Захиалгын дүн</h3>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Нийт</span>
                  <span className="text-blue-600">{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;