import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategoryStats,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadProductImage } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/stats/categories', getCategoryStats);
router.get('/:id', getProduct);

// Admin only routes
router.post('/', protect, admin, uploadProductImage, createProduct);
router.put('/:id', protect, admin, uploadProductImage, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;