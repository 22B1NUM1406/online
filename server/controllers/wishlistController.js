import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('items.product');
    
    if (!wishlist) {
      // Хоосон wishlist үүсгэх
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: []
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Wishlist-ийг авахад алдаа гарлаа',
      error: error.message
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Бүтээгдэхүүн байгаа эсэхийг шалгах
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Бүтээгдэхүүн олдсонгүй'
      });
    }

    // Wishlist авах эсвэл үүсгэх
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: []
      });
    }

    // Аль хэдийн wishlist-д байгаа эсэхийг шалгах
    const exists = wishlist.items.some(
      item => item.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Бүтээгдэхүүн аль хэдийн хадгалагдсан байна'
      });
    }

    // Wishlist-д нэмэх
    wishlist.items.push({ product: productId });
    await wishlist.save();

    // Populate хийж буцаах
    await wishlist.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Бүтээгдэхүүн хадгалагдлаа',
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Бүтээгдэхүүн хадгалахад алдаа гарлаа',
      error: error.message
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist олдсонгүй'
      });
    }

    // Бүтээгдэхүүнийг хасах
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Бүтээгдэхүүн хасагдлаа',
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Бүтээгдэхүүн хасахад алдаа гарлаа',
      error: error.message
    });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist олдсонгүй'
      });
    }

    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist цэвэрлэгдлээ',
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Wishlist цэвэрлэхэд алдаа гарлаа',
      error: error.message
    });
  }
};