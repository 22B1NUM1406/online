import express from 'express';
import {
  getBlogs,
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getFeaturedBlogs,
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.get('/admin/all', protect, admin, getAllBlogs);
router.get('/admin/:id', protect, admin, getBlogById);
router.post('/', protect, admin, uploadSingle, createBlog);
router.put('/:id', protect, admin, uploadSingle, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

export default router;