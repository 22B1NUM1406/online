import { useEffect, useState } from 'react';
import { 
  DollarSign, ShoppingCart, FileText, MessageSquare, Users, Package,
  TrendingUp, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { getDashboardStats } from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';

const DashboardTab = ({ onTabChange }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, recent } = stats;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div 
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onTabChange('orders')}
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-10 h-10" />
            <div className="text-right">
              <p className="text-sm opacity-90">Нийт борлуулалт</p>
              <p className="text-2xl font-bold">{formatPrice(overview.totalSales)}</p>
            </div>
          </div>
          <div className="flex items-center text-sm opacity-90">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{overview.paidOrdersCount} төлөгдсөн захиалга</span>
          </div>
        </div>

        {/* Total Orders */}
        <div 
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onTabChange('orders')}
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-10 h-10" />
            <div className="text-right">
              <p className="text-sm opacity-90">Захиалгууд</p>
              <p className="text-2xl font-bold">{overview.totalOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm opacity-90">
            <span>⏳ {overview.pendingOrders}</span>
            <span>⚙️ {overview.processingOrders}</span>
            <span>✅ {overview.completedOrders}</span>
          </div>
        </div>

        {/* Quotations */}
        <div 
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onTabChange('quotations')}
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-10 h-10" />
            <div className="text-right">
              <p className="text-sm opacity-90">Үнийн санал</p>
              <p className="text-2xl font-bold">{overview.totalQuotations}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm opacity-90">
            <span>⏳ {overview.pendingQuotations} хүлээгдэж байна</span>
          </div>
        </div>

        {/* Messages */}
        <div 
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onTabChange('contacts')}
        >
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-10 h-10" />
            <div className="text-right">
              <p className="text-sm opacity-90">Мессежүүд</p>
              <p className="text-2xl font-bold">{overview.totalMessages}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm opacity-90">
            <AlertCircle className="w-4 h-4" />
            <span>{overview.unreadMessages} уншаагүй</span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Users */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Хэрэглэгчид</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">
                +{overview.newUsersToday} өнөөдөр
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Бүтээгдэхүүн</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalProducts}</p>
              <p className="text-sm text-orange-600 mt-1">
                {overview.lowStockProducts} бага нөөцтэй
              </p>
            </div>
            <Package className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-600 text-sm mb-3">Захиалгын статус</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Хүлээгдэж буй</span>
              <span className="font-semibold text-yellow-600">{overview.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Боловсруулж буй</span>
              <span className="font-semibold text-blue-600">{overview.processingOrders}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Дууссан</span>
              <span className="font-semibold text-green-600">{overview.completedOrders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Сүүлийн захиалгууд</h3>
            <button
              onClick={() => onTabChange('orders')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Бүгдийг харах →
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {recent.orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Захиалга байхгүй байна
              </div>
            ) : (
              recent.orders.map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{order.user?.name || 'Guest'}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-gray-500">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Сүүлийн үнийн саналууд</h3>
            <button
              onClick={() => onTabChange('quotations')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Бүгдийг харах →
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {recent.quotations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Үнийн санал байхгүй байна
              </div>
            ) : (
              recent.quotations.map((quot) => (
                <div key={quot._id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{quot.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      quot.status === 'responded' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {quot.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{quot.email}</span>
                    <span>{formatDate(quot.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Сүүлийн мессежүүд</h3>
          <button
            onClick={() => onTabChange('contacts')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Бүгдийг харах →
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {recent.messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Мессеж байхгүй байна
            </div>
          ) : (
            recent.messages.map((msg) => (
              <div key={msg._id} className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{msg.name}</span>
                    {!msg.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{msg.subject}</p>
                <p className="text-sm text-gray-500 truncate">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;