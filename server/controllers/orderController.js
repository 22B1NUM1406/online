import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Захиалга үүсгэх
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Захиалгын бүтээгдэхүүн байхгүй байна',
      });
    }

    // Нийт дүн тооцоолох
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Бүтээгдэхүүн олдсонгүй: ${item.product}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      total += product.price * item.quantity;
    }

    // Wallet төлбөр бол үлдэгдэл шалгах
    if (paymentMethod === 'wallet') {
      const user = await User.findById(req.user._id);
      
      if (user.wallet < total) {
        return res.status(400).json({
          success: false,
          message: 'Хэтэвчний үлдэгдэл хүрэлцэхгүй байна',
        });
      }

      // Wallet-с хасах
      user.wallet -= total;
      await user.save();
    }

    // Захиалга үүсгэх
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      shippingInfo,
      paymentMethod,
      notes,
      status: paymentMethod === 'wallet' ? 'paid' : 'pending',
    });

    // Wallet төлбөр бол payment info нэмэх
    if (paymentMethod === 'wallet') {
      order.paymentInfo = {
        transactionId: `WALLET-${order._id}`,
        paidAt: Date.now(),
      };
      await order.save();
    }

    res.status(201).json({
      success: true,
      message: 'Захиалга амжилттай үүсгэгдлээ',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Хэрэглэгчийн захиалгууд
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('items.product', 'name image');

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Нэг захиалга авах
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Захиалга олдсонгүй',
      });
    }

    // Зөвхөн өөрийн захиалга эсвэл админ үзэх боломжтой
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Энэ захиалгыг үзэх эрхгүй байна',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Бүх захиалга авах (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort('-createdAt')
      .limit(Number(limit))
      .skip(skip)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Захиалгын статус солих (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Захиалга олдсонгүй',
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Захиалгын статус шинэчлэгдлээ',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Захиалга устгах (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Захиалга олдсонгүй',
      });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: 'Захиалга устгагдлаа',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Dashboard статистик (Admin)
// @route   GET /api/orders/stats/dashboard
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    // Нийт борлуулалт
    const totalSales = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    // Статус тоо
    const statusCount = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Сүүлийн 7 хоногийн борлуулалт
    const last7Days = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalSales: totalSales[0]?.total || 0,
        statusCount,
        last7Days,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};