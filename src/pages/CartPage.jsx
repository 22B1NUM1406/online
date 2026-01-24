import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Trash2, Plus, Minus, ChevronLeft,
  Truck, Shield, CreditCard, ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const CartPage = () => {
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const shippingCost = cartTotal > 200000 ? 0 : 5000;
  const totalWithShipping = cartTotal + shippingCost;

  if (cartCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Таны сагс хоосон байна</h2>
          <p className="text-gray-600 mb-8">
            Сагсанд бүтээгдэхүүн нэмээд энд харах боломжтой
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Бүтээгдэхүүн үзэх
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Таны сагс</h1>
        <p className="text-gray-600">{cartCount} бүтээгдэхүүн байна</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Сагсны бүтээгдэхүүн</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Бүгдийг устгах
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                          <div className="text-sm text-gray-500 mb-2">
                            Хэмжээ: {item.selectedSize || 'A4'} | Материал: {item.selectedMaterial || 'Стандарт'}
                          </div>
                          <div className="flex items-center gap-4">
                            {/* Quantity Control */}
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-lg font-semibold text-blue-600">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-4">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                          <div className="text-sm text-gray-500">
                            Нэгж үнэ: {formatPrice(item.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="p-6 border-t border-gray-200">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <ChevronLeft size={18} />
                Үргэлжлүүлэн дэлгүүрээс сонгох
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck size={20} className="text-green-600" />
                </div>
                <h4 className="font-semibold">Үнэгүй хүргэлт</h4>
              </div>
              <p className="text-sm text-gray-600">
                200,000₮-с дээш захиалгад үнэгүй хүргэлт
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <h4 className="font-semibold">Баталгаат ажил</h4>
              </div>
              <p className="text-sm text-gray-600">
                Чанарын баталгаатай, шаардлага хангаагүй тохиолдолд буцаан солино
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <CreditCard size={20} className="text-purple-600" />
                </div>
                <h4 className="font-semibold">Аюулгүй төлбөр</h4>
              </div>
              <p className="text-sm text-gray-600">
                QPay, банкны карт, хэтэвчээр аюулгүй төлбөр хийх боломжтой
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-6">Захиалгын дүн</h2>

            <div className="space-y-4 mb-6">
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
              {cartTotal < 200000 && (
                <div className="text-sm text-gray-500">
                  {formatPrice(200000 - cartTotal)}-р нэмээд үнэгүй хүргэлт авах боломжтой
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Нийт дүн</span>
                <span className="text-blue-600">{formatPrice(totalWithShipping)}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                НӨАТ орсон
              </div>
            </div>

            {/* Discount Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Хөнгөлөлтийн код
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="КОД ОРУУЛАХ"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Хэрэглэх
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-lg font-semibold text-center hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl mb-4"
            >
              Захиалга үүсгэх
            </Link>

            {/* Payment Methods */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3">Төлбөрийн хэрэгсэл:</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                  <div className="text-xs font-semibold">QPay</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                  <div className="text-xs font-semibold text-blue-600">VISA</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                  <div className="text-xs font-semibold text-red-600">Master</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                  <div className="text-xs font-semibold text-green-600">Wallet</div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <Shield size={16} className="inline mr-2" />
                Таны мэдээлэл нууцлагдаж, аюулгүй хадгалагдана
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;