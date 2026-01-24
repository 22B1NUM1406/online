import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletBalance, setWalletBalance] = useState(500000);

  const login = (email, password) => {
    // Mock login - Backend connection will be added later
    const mockUser = {
      id: 1,
      name: 'Баярмагнай',
      email: email,
      role: 'user',
      phone: '99112233'
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return Promise.resolve(mockUser);
  };

  const loginWithGoogle = () => {
    // Mock Google login
    const mockUser = {
      id: 2,
      name: 'Google хэрэглэгч',
      email: 'googleuser@gmail.com',
      role: 'user',
      phone: '99001122'
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return Promise.resolve(mockUser);
  };

  const register = (userData) => {
    // Mock registration
    const mockUser = {
      id: 3,
      name: userData.name,
      email: userData.email,
      role: 'user',
      phone: userData.phone
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const addWalletBalance = (amount) => {
    setWalletBalance(prev => prev + amount);
  };

  const deductWalletBalance = (amount) => {
    setWalletBalance(prev => prev - amount);
  };

  const value = {
    user,
    isAuthenticated,
    walletBalance,
    login,
    loginWithGoogle,
    register,
    logout,
    addWalletBalance,
    deductWalletBalance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};