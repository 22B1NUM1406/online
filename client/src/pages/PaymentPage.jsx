import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, CheckCircle, XCircle, Clock, QrCode } from 'lucide-react';
import { createQPayInvoice, checkQPayPayment } from '../services/api';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('qpay');
  const [qpayData, setQpayData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  // Load order details
  useEffect(() => {
    const loadOrder = async () => {
      try {
        // TODO: Fetch order from API
        // const response = await getOrder(orderId);
        // setOrder(response.data);
        
        // Mock data for now
        setOrder({
          _id: orderId,
          orderNumber: 'ORD-12345',
          totalAmount: 150000,
          items: [
            { name: 'Нэрийн хуудас', quantity: 100, price: 150000 }
          ]
        });
      } catch (err) {
        setError('Захиалга ачааллахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  // Handle QPay payment
  const handleQPayPayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Create QPay invoice
      const response = await createQPayInvoice(order._id);

      if (response.success) {
        setQpayData(response.data);
        setPaymentStatus('waiting');
        
        // Start checking payment status
        startPaymentCheck();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Төлбөр үүсгэхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  // Check payment status periodically
  const startPaymentCheck = () => {
    const checkInterval = setInterval(async () => {
      try {
        setChecking(true);
        const response = await checkQPayPayment(order._id);
        
        if (response.data.paid) {
          setPaymentStatus('paid');
          clearInterval(checkInterval);
          
          // Redirect to success page after 2 seconds
          setTimeout(() => {
            navigate(`/order-success/${order._id}`);
          }, 2000);
        }
      } catch (err) {
        console.error('Payment check error:', err);
      } finally {
        setChecking(false);
      }
    }, 3000); // Check every 3 seconds

    // Stop checking after 10 minutes
    setTimeout(() => clearInterval(checkInterval), 600000);
  };

  // Handle wallet payment
  const handleWalletPayment = async () => {
    // TODO: Implement wallet payment
    alert('Түрнийхээр боломжгүй');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Захиалга олдсонгүй</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Нүүр хуудас руу буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Төлбөр төлөх</h1>
          <p className="text-gray-600">Захиалга #{order.orderNumber}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Payment Methods */}
          <div className="md:col-span-2 space-y-6">
            {/* QPay QR Code */}
            {qpayData && paymentStatus === 'waiting' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    QPay QR код уншуулна уу
                  </h3>
                  
                  {/* QR Code Image */}
                  <div className="bg-white p-4 rounded-xl inline-block mb-6">
                    <img 
                      src={qpayData.qr_image}
                      alt="QPay QR Code"
                      className="w-64 h-64 mx-auto"
                    />
                  </div>

                  {/* Bank Links */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-gray-600 mb-3">Эсвэл банкны апп дээр нээх:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {qpayData.urls?.map((bank) => (
                        <a
                          key={bank.name}
                          href={bank.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                        >
                          <span className="font-medium text-gray-900">{bank.name}</span>
                          <p className="text-xs text-gray-500 mt-1">{bank.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center text-yellow-600 mb-4">
                    <Clock className="w-5 h-5 mr-2 animate-pulse" />
                    <span>Төлбөр хүлээгдэж байна...</span>
                    {checking && <span className="ml-2 text-sm">(шалгаж байна)</span>}
                  </div>

                  <p className="text-sm text-gray-500">
                    Төлбөр хийсний дараа автоматаар баталгаажна
                  </p>
                </div>
              </div>
            )}

            {/* Payment Success */}
            {paymentStatus === 'paid' && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Төлбөр амжилттай!
                </h3>
                <p className="text-gray-600 mb-6">
                  Таны төлбөр амжилттай төлөгдлөө
                </p>
                <button
                  onClick={() => navigate(`/order-success/${order._id}`)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Захиалга үзэх
                </button>
              </div>
            )}

            {/* Payment Methods (before payment) */}
            {!qpayData && paymentStatus === 'pending' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Төлбөрийн хэлбэр</h3>
                
                <div className="space-y-3">
                  {/* QPay */}
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'qpay'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('qpay')}
                  >
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">QPay</p>
                        <p className="text-sm text-gray-500">QR код ашиглан төлөх</p>
                      </div>
                      {paymentMethod === 'qpay' && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wallet (disabled for now) */}
                  <div className="p-4 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                    <div className="flex items-center">
                      <Wallet className="w-6 h-6 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-600">Түрийвч</p>
                        <p className="text-sm text-gray-400">Түрнийхээр боломжгүй</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  onClick={paymentMethod === 'qpay' ? handleQPayPayment : handleWalletPayment}
                  disabled={loading}
                  className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Боловсруулж байна...' : `${order.totalAmount.toLocaleString()}₮ төлөх`}
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Захиалгын дэлгэрэнгүй</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {item.price.toLocaleString()}₮
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Нийт дүн:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {order.totalAmount.toLocaleString()}₮
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;