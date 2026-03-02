import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Load user
  const loadUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      setUser(data.data);
    } catch (error) {
      console.error('Load user error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.data.token);
      setToken(data.data.token);
      setUser(data.data);
      return { 
        success: true, 
        message: data.message,
        user: data.data  // ✅ Return user object
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Нэвтрэхэд алдаа гарлаа' 
      };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', data.data.token);
      setToken(data.data.token);
      setUser(data.data);
      return { success: true, message: data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Бүртгэлд алдаа гарлаа' 
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update wallet
  const updateWallet = (newBalance) => {
    setUser(prev => ({ ...prev, wallet: newBalance }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateWallet,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};