import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getWishlist as getWishlistAPI,
  addToWishlist as addToWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
  clearWishlist as clearWishlistAPI
} from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  // Load wishlist from backend
  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlistAPI();
      setWishlist(data.data.items || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      const data = await addToWishlistAPI(productId);
      setWishlist(data.data.items || []);
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Алдаа гарлаа'
      };
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const data = await removeFromWishlistAPI(productId);
      setWishlist(data.data.items || []);
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Алдаа гарлаа'
      };
    }
  };

  // Toggle wishlist (add or remove)
  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlist.some(
      item => item.product._id === productId || item.product === productId
    );

    if (isInWishlist) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(
      item => item.product._id === productId || item.product === productId
    );
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      await clearWishlistAPI();
      setWishlist([]);
      return { success: true, message: 'Wishlist цэвэрлэгдлээ' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Алдаа гарлаа'
      };
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist: loadWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};