import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Wallet, User as UserIcon, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../utils/helpers';
import Loading from '../components/Loading';

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft size={20} />
          <span>Буцах</span>
        </Link>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ShoppingCart size={20} />
                  Захиалгууд
                </button>

                <Link
                  to="/wallet"
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-all flex items-center gap-3"
                >
                  <Wallet size={20} />
                  Хэтэвч
                </Link>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <UserIcon size={20} />
                  Профайл
                </button>
              </div>

              {/* Wallet Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90 mb-1">Хэтэвч</div>
                  <div className="text-2xl font-bold">{formatPrice(user?.wallet || 0)}</div>
                  <Link 
                    to="/wallet"
                    className="mt-3 block text-center bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Цэнэглэх
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Миний захиалгууд</h2>

                {loading ? (
                  <Loading />
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Захиалга байхгүй байна
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Хэвлэлийн үйлчилгээ захиалж эхлээрэй
                    </p>
                    <Link 
                      to="/"
                      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Захиалга хийх
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-bold text-lg">Захиалга #{order._id.slice(-6)}</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                            {getOrderStatusLabel(order.status)}
                          </div>
                        </div>

                        <div className="border-t pt-4 mb-4">
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.name} × {item.quantity}
                                </span>
                                <span className="font-medium">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            Төлбөр: <span className="font-medium capitalize">{order.paymentMethod}</span>
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            {formatPrice(order.total)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Профайл мэдээлэл</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Нэр</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">И-мэйл</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Утас</label>
                    <input
                      type="tel"
                      value={user?.phone || 'Тохируулаагүй'}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Хаяг</label>
                    <textarea
                      value={user?.address || 'Тохируулаагүй'}
                      disabled
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Мэдээлэл засах
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;