import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync cart from server when authenticated
  const fetchServerCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get('/cart');
      if (res.data && res.data.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.warn('Failed to fetch user cart from server:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Whenever auth status changes (login / logout)
  useEffect(() => {
    if (isAuthenticated) {
      fetchServerCart();
    } else {
      // Clear cart state completely on logout
      setCart([]);
      localStorage.removeItem('aquacraft_guest_cart');
    }
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please log in or create an account to add items to your cart.');
      return { requireLogin: true };
    }

    try {
      await API.post('/cart/add', { product_id: product.id, quantity });
      toast.success(`Added ${product.name} to cart!`);
      await fetchServerCart();
      return { success: true };
    } catch (err) {
      toast.error('Failed to add item to cart.');
      return { success: false };
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!isAuthenticated) return;

    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      await API.put(`/cart/update/${cartItemId}`, { quantity: newQuantity });
      await fetchServerCart();
    } catch (err) {
      toast.error('Failed to update quantity.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!isAuthenticated) return;

    try {
      await API.delete(`/cart/remove/${cartItemId}`);
      toast.success('Item removed from cart.');
      await fetchServerCart();
    } catch (err) {
      toast.error('Failed to remove item.');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await API.delete('/cart/clear');
        setCart([]);
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    } else {
      setCart([]);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartSubtotal: parseFloat(cartSubtotal.toFixed(2)),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchServerCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
