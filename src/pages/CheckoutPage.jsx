import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Wallet, Smartphone, CheckCircle,
  MapPin, User, Phone, Mail, Shield, Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, walletBalance, deductWalletBalance } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: 'Улаанбаатар',
    district: '',
    additionalInfo: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const shippingCost = cartTotal > 200000 ? 0 : 5000;
  const totalWithShipping = cartTotal + shippingCost;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (paymentMethod === 'wallet' && walletBalance < totalWithShipping) {
        alert('Хэтэвчний үлдэгдэл хүрэлцэхгүй байна');
        setIsProcessing(false);
        return;
      }
      
      if (paymentMethod === 'wallet') {
        deductWalletBalance(totalWithShipping);
      }
      
      setOrderSuccess(true);
      clearCart();
      setIsProcessing(false);
    }, 2000);
  };
  
  if (orderSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Захиалга амжилттай боллоо!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Таны захиалгын дугаар: <span className="font-bold text-blue-600">ORD-{Date.now().toString().slice(-8)}</span>
          </p>
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto mb-8">
            <div className="space-y-4 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Нийт дүн:</span>
                <span className="font-bold text-lg">{formatPrice(totalWithShipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Төлбөрийн хэрэгсэл:</span>
                <span className="font-medium">
                  {paymentMethod === 'wallet' ? 'Хэтэвч' : 
                   paymentMethod === 'card' ? 'Банкны карт' : 'QPay'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Хүргэлтийн хаяг:</span>
                <span className="text-right">{formData.address}, {formData.district}</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/products')}
              className="block w-full max-w-md mx-auto bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Үргэлжлүүлэн дэлгүүрээс сонгох
            </button>
            <button
              onClick={() => navigate('/')}
              className="block w-full max-w-md mx-auto border border-gray-300 text-gray-700 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Нүүр хуудас руу буцах
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Захиалга баталгаажуулах</h1>
        <p className="text-gray-600">Захиалгын мэдээллийг бөглөнө үү</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User size={20} />
                Холбоо барих мэдээлэл
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Нэр *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Нэр"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Овог *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Овог"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Утасны дугаар *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="9999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    И-мэйл *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin size={20} />
                Хүргэлтийн хаяг
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Хот *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="Улаанбаатар">Улаанбаатар</option>
                    <option value="Дархан">Дархан</option>
                    <option value="Эрдэнэт">Эрдэнэт</option>
                    <option value="Бусад">Бусад</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дүүрэг/Сум *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Дүүрэг/Сум"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дэлгэрэнгүй хаяг *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Хороо, гудамж, байрны дугаар"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Нэмэлт мэдээлэл
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field"
                    placeholder="Хаягийн нэмэлт тайлбар, орцны код гэх мэт"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Төлбөрийн хэрэгсэл</h2>
              <div className="space-y-4">
                {/* Wallet */}
                <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'wallet' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'wallet' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'wallet' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Wallet size={20} className="text-green-600" />
                        <span className="font-medium">Хэтэвч</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{formatPrice(walletBalance)}</div>
                      <div className="text-sm text-gray-500">Үлдэгдэл</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                </label>
                
                {/* QPay */}
                <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'qpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'qpay' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'qpay' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone size={20} className="text-purple-600" />
                        <span className="font-medium">QPay</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">QR кодоор төлөх</div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qpay"
                    checked={paymentMethod === 'qpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                </label>
                
                {/* Credit Card */}
                <label className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'card' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={20} className="text-blue-600" />
                        <span className="font-medium">Банкны карт</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">VISA</div>
                      <div className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">Master</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                </label>
              </div>
              
              {/* Card Details (if selected) */}
              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Картын дугаар
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Дуусах хугацаа
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Захиалгын дүн</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                {cart.length > 3 && (
                  <div className="text-center text-sm text-gray-500">
                    + {cart.length - 3} бүтээгдэхүүн
                  </div>
                )}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Бүтээгдэхүүний үнэ</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Хүргэлтийн үнэ</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'ҮНЭГҮЙ' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                  <span>Нийт дүн</span>
                  <span className="text-blue-600">{formatPrice(totalWithShipping)}</span>
                </div>
              </div>
              
              {/* Terms and Submit */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-1 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    Би <a href="#" className="text-blue-600 hover:underline">Үйлчилгээний нөхцөл</a> болон{' '}
                    <a href="#" className="text-blue-600 hover:underline">Нууцлалын бодлого</a>-ыг уншиж зөвшөөрч байна
                  </span>
                </label>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <Shield size={16} />
                    <Lock size={16} />
                    <span>Таны мэдээлэл аюулгүй хадгалагдана</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3.5 rounded-lg font-semibold text-center transition-all ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Төлбөр боловсруулж байна...
                    </div>
                  ) : paymentMethod === 'wallet' ? (
                    `Төлөх (${formatPrice(totalWithShipping)})`
                  ) : (
                    `Төлбөр хийх (${formatPrice(totalWithShipping)})`
                  )}
                </button>
                
                <p className="text-xs text-center text-gray-500">
                  Төлбөр хийгдсэнээр та захиалгын баталгаажуулалт авах болно
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;