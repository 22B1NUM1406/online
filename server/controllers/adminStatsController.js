import Order from '../models/Order.js';
import Quotation from '../models/Quotation.js';
import ContactMessage from '../models/ContactMessage.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Total Sales (paid orders only)
    const salesData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const totalSales = salesData[0]?.totalSales || 0;
    const paidOrdersCount = salesData[0]?.totalOrders || 0;

    // Total Orders (all statuses)
    const totalOrders = await Order.countDocuments();

    // Pending Orders
    const pendingOrders = await Order.countDocuments({ 
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Processing Orders
    const processingOrders = await Order.countDocuments({ 
      status: 'processing'
    });

    // Completed Orders
    const completedOrders = await Order.countDocuments({ 
      status: 'completed'
    });

    // Quotations
    const totalQuotations = await Quotation.countDocuments();
    const pendingQuotations = await Quotation.countDocuments({ 
      status: 'pending'
    });
    const respondedQuotations = await Quotation.countDocuments({ 
      status: 'responded'
    });

    // Contact Messages
    const totalMessages = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ 
      isRead: false
    });

    // Users
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    // Products
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 10 }
    });

    // Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('orderNumber totalAmount status paymentStatus createdAt');

    // Recent Quotations
    const recentQuotations = await Quotation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('name email phone status createdAt');

    // Recent Messages
    const recentMessages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject message isRead createdAt');

    // Sales by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalSales,
          totalOrders,
          paidOrdersCount,
          pendingOrders,
          processingOrders,
          completedOrders,
          totalQuotations,
          pendingQuotations,
          respondedQuotations,
          totalMessages,
          unreadMessages,
          totalUsers,
          newUsersToday,
          totalProducts,
          lowStockProducts
        },
        recent: {
          orders: recentOrders,
          quotations: recentQuotations,
          messages: recentMessages
        },
        charts: {
          monthlySales
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Статистик авахад алдаа гарлаа'
    });
  }
};

// @desc    Get orders statistics
// @route   GET /api/admin/stats/orders
// @access  Private/Admin
export const getOrdersStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const orders = await Order.find({
      createdAt: { $gte: startDate }
    }).select('totalAmount status paymentStatus createdAt');

    const stats = {
      total: orders.length,
      paid: orders.filter(o => o.paymentStatus === 'paid').length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalAmount, 0)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get orders stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Захиалгын статистик авахад алдаа гарлаа'
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/stats/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    
    let groupBy = {};
    let startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 30);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 90);
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 12);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 5);
        groupBy = {
          year: { $year: '$createdAt' }
        };
        break;
    }

    const analytics = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Борлуулалтын статистик авахад алдаа гарлаа'
    });
  }
};