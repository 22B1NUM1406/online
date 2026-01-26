import express from 'express';
import {
  getDashboardStats,
  getOrdersStats,
  getSalesAnalytics
} from '../controllers/adminStatsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, admin);

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Orders statistics
router.get('/stats/orders', getOrdersStats);

// Sales analytics
router.get('/stats/sales', getSalesAnalytics);

export default router;