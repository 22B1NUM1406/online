import qpayService from '../services/qpayService.js';
import Order from '../models/Order.js';

// @desc    Create QPay invoice
// @route   POST /api/payment/create-invoice
// @access  Private
export const createInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Захиалга олдсонгүй'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Зөвшөөрөл хүрэхгүй байна'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Энэ захиалга аль хэдийн төлөгдсөн байна'
      });
    }

    const invoiceData = {
      orderNumber: order.orderNumber,
      customerPhone: order.shippingAddress?.phone || '',
      description: `Захиалга #${order.orderNumber}`,
      amount: order.totalAmount
    };

    const qpayResult = await qpayService.createInvoice(invoiceData);

    order.qpayInvoiceId = qpayResult.invoice_id;
    order.qpayQRCode = qpayResult.qr_image;
    await order.save();

    res.json({
      success: true,
      message: 'Invoice амжилттай үүслээ',
      data: {
        invoice_id: qpayResult.invoice_id,
        qr_text: qpayResult.qr_text,
        qr_image: qpayResult.qr_image,
        urls: qpayResult.urls,
        order: {
          orderNumber: order.orderNumber,
          amount: order.totalAmount
        }
      }
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Invoice үүсгэхэд алдаа гарлаа'
    });
  }
};

// @desc    Check payment status
// @route   GET /api/payment/check/:orderId
// @access  Private
export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId, invoiceId } = req.params;
    console.log(orderId, invoiceId);
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Захиалга олдсонгүй'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Зөвшөөрөл хүрэхгүй байна'
      });
    }

    if (!order.qpayInvoiceId) {
      return res.status(400).json({
        success: false,
        message: 'QPay invoice үүсээгүй байна'
      });
    }

    const paymentResult = await qpayService.checkPayment(invoiceId);
 
    if (paymentResult.payments[0].payment_status == 'PAID') {
     console.log(
        `starting1111.......`,
      )
      order.paymentStatus = 'paid';
      order.paymentMethod = 'qpay';
      order.paidAt = new Date();
      order.status = 'processing';
      await order.save();

      return res.json({
        success: true,
        message: 'Төлбөр амжилттай төлөгдлөө',
        data: {
          paid: true,
          order: {
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        paid: paymentResult.paid,
        count: paymentResult.count
      }
    });
  } catch (error) {
    console.error('Check payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Төлбөр шалгахад алдаа гарлаа'
    });
  }
};

// @desc    Cancel invoice
// @route   POST /api/payment/cancel/:orderId
// @access  Private
export const cancelInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Захиалга олдсонгүй'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Зөвшөөрөл хүрэхгүй байна'
      });
    }

    if (!order.qpayInvoiceId) {
      return res.status(400).json({
        success: false,
        message: 'QPay invoice үүсээгүй байна'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Төлбөр төлөгдсөн invoice цуцлах боломжгүй'
      });
    }

    await qpayService.cancelInvoice(order.qpayInvoiceId);

    order.qpayInvoiceId = null;
    order.qpayQRCode = null;
    await order.save();

    res.json({
      success: true,
      message: 'Invoice амжилттай цуцлагдлаа'
    });
  } catch (error) {
    console.error('Cancel invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Invoice цуцлахад алдаа гарлаа'
    });
  }
};

// @desc    QPay callback webhook
// @route   POST /api/payment/callback
// @access  Public
export const qpayCallback = async (req, res) => {
  try {
    console.log('QPay callback received:', req.body);

    const { invoice_id, payment_status } = req.body;

    if (payment_status === 'PAID') {
      const order = await Order.findOne({ qpayInvoiceId: invoice_id });

      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.paymentMethod = 'qpay';
        order.paidAt = new Date();
        order.status = 'processing';
        await order.save();

        console.log(`Order ${order.orderNumber} marked as paid`);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('QPay callback error:', error);
    res.status(500).json({ success: false });
  }
};