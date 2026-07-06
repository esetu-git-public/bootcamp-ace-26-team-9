import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hr_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // For demo purposes, accept standard corporate login
    const userData = {
      email,
      name: email.split('@')[0].toUpperCase(),
      role: 'Senior HR Analytics Lead',
      department: 'Global Human Resources',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
    };
    setUser(userData);
    localStorage.setItem('hr_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hr_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
