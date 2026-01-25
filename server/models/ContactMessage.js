import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Нэр оруулна уу'],
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
    subject: {
      type: String,
      required: [true, 'Гарчиг оруулна уу'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Мессеж оруулна уу'],
      maxlength: [2000, 'Мессеж 2000 тэмдэгтээс ихгүй байх ёстой'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    adminReply: {
      message: String,
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

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;