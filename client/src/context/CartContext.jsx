import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);

  // User-д тохирсон cart key үүсгэх
  const getCartKey = () => {
    return user ? `cart_${user._id}` : 'cart_guest';
  };

  // LocalStorage-аас cart уншина
  useEffect(() => {
    if (isAuthenticated && user) {
      const cartKey = getCartKey();
      const saved = localStorage.getItem(cartKey);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } else {
      // Нэвтрээгүй бол хоосон
      setCart([]);
    }
  }, [user, isAuthenticated]);

  // Cart өөрчлөгдөх үед localStorage-д хадгална
  useEffect(() => {
    if (isAuthenticated && user) {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, user, isAuthenticated]);

  // Logout хийхэд cart-ийг цэвэрлэх
  useEffect(() => {
    if (!isAuthenticated) {
      setCart([]);
    }
  }, [isAuthenticated]);

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};