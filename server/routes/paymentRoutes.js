import express from 'express';
import {
  createInvoice,
  checkPaymentStatus,
  cancelInvoice,
  qpayCallback
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create QPay invoice
router.post('/create-invoice', protect, createInvoice);

// Check payment status
router.get('/check/:orderId', protect, checkPaymentStatus);

// Cancel invoice
router.post('/cancel/:orderId', protect, cancelInvoice);

// QPay callback webhook (public - no auth)
router.post('/callback', qpayCallback);

export default router;