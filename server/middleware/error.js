// Алдааны мэдээлэл боловсруулах middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Энэ утга аль хэдийн бүртгэгдсэн байна';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message, statusCode: 400 };
  }

  // Mongoose cast error (буруу ID format)
  if (err.name === 'CastError') {
    const message = 'Өгөгдөл олдсонгүй';
    error = { message, statusCode: 404 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Серверийн алдаа гарлаа',
  });
};

// 404 алдааг барих
export const notFound = (req, res, next) => {
  const error = new Error(`Олдсонгүй - ${req.originalUrl}`);
  res.status(404);
  next(error);
};