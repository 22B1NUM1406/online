import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Нэр оруулна уу'],
      trim: true,
      maxlength: [50, 'Нэр 50 тэмдэгтээс ихгүй байх ёстой'],
    },
    email: {
      type: String,
      required: [true, 'И-мэйл оруулна уу'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'И-мэйл хаяг буруу байна',
      ],
    },
    password: {
      type: String,
      required: [true, 'Нууц үг оруулна уу'],
      minlength: [6, 'Нууц үг 6-аас дээш тэмдэгт байх ёстой'],
      select: false, // query-д автоматаар ирэхгүй
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    wallet: {
      type: Number,
      default: 0,
      min: [0, 'Wallet үлдэгдэл сөрөг байж болохгүй'],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt автоматаар нэмнэ
  }
);

// Password hash хийх (save хийхээс өмнө)
userSchema.pre('save', async function (next) {
  // Password өөрчлөгдөөгүй бол skip
  if (!this.isModified('password')) {
    return next();
  }

  // Password hash
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password шалгах method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;