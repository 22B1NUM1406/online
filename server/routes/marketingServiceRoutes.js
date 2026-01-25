import express from 'express';
import {
  getMarketingServices,
  getAllMarketingServices,
  getMarketingServiceBySlug,
  createMarketingService,
  updateMarketingService,
  deleteMarketingService,
} from '../controllers/marketingServiceController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getMarketingServices);
router.get('/:slug', getMarketingServiceBySlug);

// Admin routes
router.get('/admin/all', protect, admin, getAllMarketingServices);
router.post('/', protect, admin, uploadSingle, createMarketingService);
router.put('/:id', protect, admin, uploadSingle, updateMarketingService);
router.delete('/:id', protect, admin, deleteMarketingService);

export default router;