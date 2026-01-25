import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Нэвтэрсэн хэрэглэгч эсэхийг шалгах
export const protect = async (req, res, next) => {
  let token;

  // Header-с token авах
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Token байхгүй бол
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Нэвтрэх шаардлагатай',
    });
  }

  try {
    // Token verify хийх
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Хэрэглэгчийг олох (password-г авахгүй)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token буруу байна',
    });
  }
};

// Admin эрх шалгах
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Админ эрх шаардлагатай',
    });
  }
};

// Optional authentication - token байвал user set хийх, байхгүй бол үргэлжлүүлэх
export const optionalAuth = async (req, res, next) => {
  let token;

  // Header-с token авах
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Token байхгүй бол үргэлжлүүлэх
  if (!token) {
    return next();
  }

  try {
    // Token verify хийх
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Хэрэглэгчийг олох (password-г авахгүй)
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    // Token буруу байвал ч үргэлжлүүлэх
    next();
  }
};