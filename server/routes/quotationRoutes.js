import express from 'express';
import {
  createQuotation,
  getMyQuotations,
  getQuotation,
  getAllQuotations,
  replyToQuotation,
  updateQuotationStatus,
  deleteQuotation,
} from '../controllers/quotationController.js';
import { protect, admin, optionalAuth } from '../middleware/auth.js';
import { uploadDesignFile } from '../middleware/upload.js';

const router = express.Router();

// Public/User routes
router.post('/', optionalAuth, uploadDesignFile, createQuotation);
router.get('/my-quotations', protect, getMyQuotations);
router.get('/:id', protect, getQuotation);

// Admin routes
router.get('/', protect, admin, getAllQuotations);
router.put('/:id/reply', protect, admin, replyToQuotation);
router.put('/:id/status', protect, admin, updateQuotationStatus);
router.delete('/:id', protect, admin, deleteQuotation);

export default router;