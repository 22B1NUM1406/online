import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import marketingServiceRoutes from './routes/marketingServiceRoutes.js';

// Environment variables
dotenv.config();

// Database холболт
connectDB();

// Express app үүсгэх
const app = express();

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json()); // JSON parse
app.use(express.urlencoded({ extended: true })); // URL encoded parse

// Static files - uploads folder
app.use('/uploads', express.static('uploads'));

// Logging (development mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 300, // 300 хүсэлт хэрэглэгч тутамд
  message: 'Хэт олон хүсэлт илгээсэн байна. Түр хүлээнэ үү.',
});

app.use('/api/', limiter);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Сервер ажиллаж байна',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/marketing-services', marketingServiceRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server эхлүүлэх
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж байна`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.error(`❌ Алдаа: ${err.message}`);
  // Server-ийг зогсоох
  process.exit(1);
});