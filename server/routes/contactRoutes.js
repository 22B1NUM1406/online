import express from 'express';
import {
  createContactMessage,
  getAllContactMessages,
  updateMessageStatus,
  replyToMessage,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', createContactMessage);

// Admin routes
router.get('/', protect, admin, getAllContactMessages);
router.put('/:id/status', protect, admin, updateMessageStatus);
router.put('/:id/reply', protect, admin, replyToMessage);
router.delete('/:id', protect, admin, deleteContactMessage);

export default router;