import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Нэр оруулна уу'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Утасны дугаар оруулна уу'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'И-мэйл оруулна уу'],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'И-мэйл хаяг буруу байна',
      ],
    },
    productType: {
      type: String,
      required: [true, 'Бүтээгдэхүүний төрөл сонгоно уу'],
    },
    description: {
      type: String,
      required: [true, 'Дэлгэрэнгүй тайлбар оруулна уу'],
      maxlength: [2000, 'Тайлбар 2000 тэмдэгтээс ихгүй байх ёстой'],
    },
    designFile: {
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    status: {
      type: String,
      enum: ['pending', 'replied', 'completed', 'cancelled'],
      default: 'pending',
    },
    adminReply: {
      message: String,
      price: Number,
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      repliedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;