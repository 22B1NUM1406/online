import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Бүх route-үүд хамгаалагдсан (logged in хэрэглэгч шаардлагатай)
router.use(protect);

router.route('/')
  .get(getWishlist)      // Wishlist авах
  .delete(clearWishlist); // Wishlist цэвэрлэх

router.route('/:productId')
  .post(addToWishlist)    // Бүтээгдэхүүн нэмэх
  .delete(removeFromWishlist); // Бүтээгдэхүүн хасах

export default router;