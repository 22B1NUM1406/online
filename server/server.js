import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Environment variables
dotenv.config();

// Database холболт
connectDB();

// Express app үүсгэх
const app = express();

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);  // Security headers

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:5173', // Vite dev
  'http://localhost:3000'  // CRA dev
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    // Allow if in allowedOrigins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Allow all Vercel deployments (production + previews)
    if (origin && origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json()); // JSON parse
app.use(express.urlencoded({ extended: true })); // URL encoded parse

// Static files - uploads folder
app.use('/uploads', express.static('uploads'));

// Logging (development mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Production logging
}

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
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Development mode - show API info
app.get('/', (req, res) => {
  res.json({
    message: 'Print Shop API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: '/api/*',
    health: '/health'
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server эхлүүлэх
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Important for Render

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Сервер ${PORT} порт дээр ажиллаж байна`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Listening on ${HOST}:${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} хүлээн авлаа. Сервер зогсож байна...`);
  
  server.close(() => {
    console.log('✅ Сервер амжилттай зогслоо');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('⚠️ Албадан зогсож байна');
    process.exit(1);
  }, 30000);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Promise Rejection: ${err.message}`);
  console.error(err.stack);
  
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught exception
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

export default app;