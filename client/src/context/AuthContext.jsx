import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aquacraft_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('aquacraft_token') || null);
  const [loading, setLoading] = useState(true);

  const checkUserAuth = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get('/auth/me');
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('aquacraft_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuth();

    const handleAuthChange = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { user: userData, token: userToken, message } = res.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('aquacraft_token', userToken);
      localStorage.setItem('aquacraft_user', JSON.stringify(userData));

      toast.success(message || 'Welcome back!');
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await API.post('/auth/register', { name, email, password, phone });
      const { user: userData, token: userToken, message } = res.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('aquacraft_token', userToken);
      localStorage.setItem('aquacraft_user', JSON.stringify(userData));

      toast.success(message || 'Account created successfully!');
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aquacraft_token');
    localStorage.removeItem('aquacraft_user');
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
