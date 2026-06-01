import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [summary, setSummary] = useState({ subtotal: 0, deliveryFee: 2000, total: 0, itemCount: 0 });
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger le panier
  const loadCart = async (doctorId) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await cartService.getCart(doctorId);
      setCart(response.data.cart || []);
      setSummary(response.data.summary);
      setSelectedDoctorId(doctorId);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter au panier
  const addToCart = async (doctorId, productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart({ doctorId, productId, quantity });
      toast.success('Produit ajouté au panier');
      await loadCart(doctorId);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
      return false;
    }
  };

  // Mettre à jour la quantité
  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartService.updateQuantity(itemId, quantity);
      await loadCart(selectedDoctorId);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Supprimer un article
  const removeItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      await loadCart(selectedDoctorId);
      toast.success('Article retiré');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Vider le panier
  const clearCart = async () => {
    if (!selectedDoctorId) return;
    try {
      await cartService.clearCart(selectedDoctorId);
      await loadCart(selectedDoctorId);
      toast.info('Panier vidé');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const value = {
    cart,
    summary,
    loading,
    selectedDoctorId,
    loadCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};