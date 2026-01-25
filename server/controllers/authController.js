import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// @desc    Бүртгүүлэх
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Хэрэглэгч бүртгэлтэй эсэхийг шалгах
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Энэ и-мэйл хаяг аль хэдийн бүртгэгдсэн байна',
      });
    }

    // Шинэ хэрэглэгч үүсгэх
    const user = await User.create({
      name,
      email,
      password,
    });

    // Token үүсгэх
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Амжилттай бүртгэгдлээ',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wallet: user.wallet,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Нэвтрэх
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'И-мэйл болон нууц үгээ оруулна уу',
      });
    }

    // Хэрэглэгч олох (password-тай хамт)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'И-мэйл эсвэл нууц үг буруу байна',
      });
    }

    // Password шалгах
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'И-мэйл эсвэл нууц үг буруу байна',
      });
    }

    // Token үүсгэх
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Амжилттай нэвтэрлээ',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wallet: user.wallet,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Хэрэглэгчийн мэдээлэл авах
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wallet: user.wallet,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Профайл засах
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй',
      });
    }

    // Мэдээлэл шинэчлэх
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    // Password өөрчлөх (хэрвээ байвал)
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Профайл шинэчлэгдлээ',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        wallet: updatedUser.wallet,
        phone: updatedUser.phone,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};