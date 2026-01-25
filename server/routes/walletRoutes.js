import express from 'express';
import {
  getWalletBalance,
  topUpWallet,
  createQPayInvoice,
  qpayCallback,
  getWalletTransactions,
} from '../controllers/walletController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/', protect, getWalletBalance);
router.post('/topup', protect, topUpWallet);
router.post('/qpay-invoice', protect, createQPayInvoice);
router.get('/transactions', protect, getWalletTransactions);

// Public route (QPay callback)
router.post('/qpay-callback', qpayCallback);

export default router;