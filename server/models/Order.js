import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Тоо ширхэг 1-ээс бага байж болохгүй'],
        },
        image: String,
      },
    ],
    total: {
      type: Number,
      required: true,
      min: [0, 'Нийт дүн сөрөг байж болохгүй'],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    // Хүргэлтийн мэдээлэл
    shippingInfo: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['wallet', 'qpay', 'cash'],
      required: true,
    },
    paymentInfo: {
      transactionId: String,
      paidAt: Date,
    },
    notes: {
      type: String,
      maxlength: [500, 'Тэмдэглэл 500 тэмдэгтээс ихгүй байх ёстой'],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;