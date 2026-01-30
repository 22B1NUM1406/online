import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { checkQPayPayment } from '../services/api';
import { formatPrice } from '../utils/helpers';
import Notification from '../components/Notification';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get QPay data from CheckoutPage
  const { qrImage, qrText, urls, invoiceId, orderNumber, amount } = location.state || {};
  
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [checking, setChecking] = useState(false);
  const [notification, setNotification] = useState(null);
  const [checkCount, setCheckCount] = useState(0);
  const [error, setError] = useState('');

  // Auto-check payment status every 5 seconds
  useEffect(() => {
    if (!orderId || !invoiceId) {
      setError('Төлбөрийн мэдээлэл дутуу байна');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const checkInterval = setInterval(async () => {
      await checkPayment();
    }, 5000); // Check every 5 seconds

    // Stop checking after 10 minutes
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (paymentStatus !== 'paid') {
        setNotification({
          message: 'Төлбөр баталгаажих хугацаа дууслаа. Profile хэсэгт очиж шалгана уу.',
          type: 'warning'
        });
      }
    }, 600000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [orderId, invoiceId, paymentStatus]);

  const checkPayment = async () => {
    try {
      setChecking(true);
      setCheckCount(prev => prev + 1);
      
      const response = await checkQPayPayment(orderId);
      
      if (response.success && response.data.paymentStatus === 'paid') {
        setPaymentStatus('paid');
        setNotification({ 
          message: 'Төлбөр амжилттай төлөгдлөө!', 
          type: 'success' 
        });
        
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (err) {
      console.error('Payment check error:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleManualCheck = async () => {
    try {
      setChecking(true);
      const response = await checkQPayPayment(orderId);
      
      if (response.success && response.data.paymentStatus === 'paid') {
        setPaymentStatus('paid');
        setNotification({ 
          message: 'Төлбөр амжилттай төлөгдлөө!', 
          type: 'success' 
        });
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setNotification({ 
          message: 'Төлбөр төлөгдөөгүй байна. Төлбөр хийсэн бол хэсэг хүлээгээд дахин шалгана уу.', 
          type: 'info' 
        });
      }
    } catch (err) {
      setNotification({ 
        message: 'Алдаа гарлаа. Дахин оролдоно уу.', 
        type: 'error' 
      });
    } finally {
      setChecking(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Алдаа гарлаа</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/profile"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Profile руу буцах</span>
        </Link>

        {/* Payment Success */}
        {paymentStatus === 'paid' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Төлбөр амжилттай!
            </h2>
            <p className="text-gray-600 mb-2">
              Таны төлбөр амжилттай төлөгдлөө
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Захиалга #{orderNumber}
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Захиалгууд руу очих
            </button>
          </div>
        )}

        {/* Payment Pending - QR Code */}
        {paymentStatus === 'pending' && qrImage && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">QPay Төлбөр</h2>
              <p className="text-blue-100">Захиалга #{orderNumber}</p>
              <p className="text-3xl font-bold mt-2">{formatPrice(amount)}</p>
            </div>

            <div className="p-8">
              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="inline-block bg-white p-4 rounded-xl shadow-lg mb-4">
                  <img 
                    src={qrImage}
                    alt="QPay QR Code"
                    className="w-72 h-72 mx-auto"
                  />
                </div>
                
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  QPay програм ашиглан QR код уншуулна уу
                </p>
                <p className="text-sm text-gray-500">
                  Эсвэл доорх банкны апп дээр дарж нээнэ үү
                </p>
              </div>

              {/* Bank Apps */}
              {urls && urls.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                    Банкны апп дээр нээх:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {urls.map((bank) => (
                      <a
                        key={bank.name}
                        href={bank.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        {bank.logo && (
                          <img 
                            src={bank.logo} 
                            alt={bank.name}
                            className="w-8 h-8"
                          />
                        )}
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{bank.name}</p>
                          {bank.description && (
                            <p className="text-xs text-gray-500">{bank.description}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">Төлбөр хүлээгдэж байна...</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Төлбөр хийсний дараа автоматаар баталгаажна
                      {checking && <span className="ml-2">(шалгаж байна... {checkCount})</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual Check Button */}
              <button
                onClick={handleManualCheck}
                disabled={checking}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Шалгаж байна...' : 'Төлбөр шалгах'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Төлбөр автоматаар 5 секунд тутамд шалгагдана. 
                Хэрэв төлбөр хийсэн боловч баталгаажихгүй байвал дээрх товч дээр дарж гараар шалгана уу.
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Төлбөр хийх заавар:</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>QPay програм эсвэл банкны апп нээнэ үү</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>QR код уншуулна уу (эсвэл банкны товч дээр дарж нээнэ)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Дүнг шалгаад төлбөр төлнө үү</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Төлбөр автоматаар баталгаажна (5-10 секунд)</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;