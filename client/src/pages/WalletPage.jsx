import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet as WalletIcon, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { topUpWallet, createWalletQPayInvoice } from '../services/api';
import { formatPrice } from '../utils/helpers';
import Notification from '../components/Notification';

const WalletPage = () => {
  const { user, updateWallet } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const presetAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const handleTopUp = async (e) => {
    e.preventDefault();
    
    const topUpAmount = parseInt(amount);
    if (!topUpAmount || topUpAmount < 1000) {
      setNotification({ 
        message: 'Дүн 1,000₮-аас их байх ёстой', 
        type: 'error' 
      });
      return;
    }

    try {
      setLoading(true);
      
      // Demo mode - directly add to wallet
      const result = await topUpWallet(topUpAmount);
      updateWallet(result.data.balance);
      
      setNotification({ 
        message: `${formatPrice(topUpAmount)} амжилттай цэнэглэгдлээ!`, 
        type: 'success' 
      });
      setAmount('');
    } catch (error) {
      console.error('Top up error:', error);
      setNotification({ 
        message: error.response?.data?.message || 'Алдаа гарлаа', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQPayTopUp = async () => {
    const topUpAmount = parseInt(amount);
    if (!topUpAmount || topUpAmount < 1000) {
      setNotification({ 
        message: 'Дүн 1,000₮-аас их байх ёстой', 
        type: 'error' 
      });
      return;
    }

    try {
      setLoading(true);
      const result = await createWalletQPayInvoice(topUpAmount);
      
      if (result.success) {
        // Navigate to wallet payment page with QR code
        navigate('/wallet/payment', {
          state: {
            qrImage: result.data.qr_image,
            qrText: result.data.qr_text,
            urls: result.data.urls,
            invoiceId: result.data.invoice_id,
            amount: topUpAmount,
            type: 'wallet'
          }
        });
      }
    } catch (error) {
      console.error('QPay error:', error);
      setNotification({ 
        message: error.response?.data?.message || 'QPay invoice үүсгэхэд алдаа гарлаа', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-2xl mx-auto px-4">
        <Link to="/profile" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft size={20} />
          <span>Буцах</span>
        </Link>

        {/* Current Balance */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-xl p-8 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon size={24} />
              <span className="text-sm opacity-90">Миний хэтэвч</span>
            </div>
            <div className="text-5xl font-bold mb-4">
              {formatPrice(user?.wallet || 0)}
            </div>
            <div className="flex items-center gap-2 text-sm opacity-75">
              <TrendingUp size={16} />
              <span>Идэвхтэй</span>
            </div>
          </div>
        </div>

        {/* Top Up Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Хэтэвч цэнэглэх</h3>
          
          <form onSubmit={handleTopUp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цэнэглэх дүн (₮)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Дүн оруулах"
                min="1000"
                step="1000"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              />
              <p className="mt-2 text-sm text-gray-500">
                Хамгийн бага: 1,000₮
              </p>
            </div>

            {/* Preset Amounts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Түгээмэл дүн
              </label>
              <div className="grid grid-cols-3 gap-3">
                {presetAmounts.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                      parseInt(amount) === preset
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    {formatPrice(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Төлбөрийн хэлбэр
              </label>

              {/* Demo Mode - Direct Top Up */}
              <button
                type="submit"
                disabled={loading || !amount}
                className="w-full flex items-center justify-between p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <WalletIcon className="text-blue-600" size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">Шууд цэнэглэх</div>
                    <div className="text-sm text-gray-600">Demo mode - шууд нэмэгдэнэ</div>
                  </div>
                </div>
                <div className="text-blue-600 font-bold">
                  {loading ? 'Түр хүлээнэ үү...' : 'Цэнэглэх'}
                </div>
              </button>

              {/* QPay Option */}
              <button
                type="button"
                onClick={handleQPayTopUp}
                disabled={loading || !amount}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="text-gray-600" size={24} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">QPay</div>
                    <div className="text-sm text-gray-600">Банкны картаар төлөх</div>
                  </div>
                </div>
                <div className="text-gray-600 font-bold">
                  Үргэлжлүүлэх
                </div>
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Мэдээлэл</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Одоогоор Demo mode - хэтэвч шууд цэнэглэгдэнэ</li>
              <li>• Бодит байдалд QPay-ээр төлбөр төлнө</li>
              <li>• Захиалга өгөхөд wallet-аас автоматаар хасагдана</li>
            </ul>
          </div>
        </div>

        {/* Transaction History Placeholder */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Гүйлгээний түүх</h3>
          <div className="text-center py-8 text-gray-500">
            Гүйлгээ байхгүй байна
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;