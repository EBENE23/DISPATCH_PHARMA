import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';
import { TrashIcon, PlusIcon, MinusIcon, ArrowLeftIcon, ShoppingCartIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, summary, loading, loadCart, updateQuantity, removeItem, clearCart, selectedDoctorId } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedDoctorId) {
      loadCart(selectedDoctorId);
    }
  }, [selectedDoctorId]);

  const handleQuantityChange = async (itemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = async () => {
    if (!selectedDoctorId) {
      toast.error('Veuillez sélectionner un médecin');
      navigate('/doctors');
      return;
    }

    if (cart.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await orderService.create({
        doctorId: selectedDoctorId,
        paymentMethod: paymentMethod,
        shippingAddress: 'Adresse de livraison',
        notes: notes,
      });
      
      toast.success(`Commande ${response.data.orderNumber} créée avec succès !`);
      
      // Afficher la prédiction IA si disponible
      if (response.data.aiPrediction) {
        toast.info(`Prédiction IA: ${response.data.aiPrediction.message}`);
      }
      
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6">
        <div className="text-center">
          <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-6">Ajoutez des produits depuis le catalogue</p>
          <button onClick={() => navigate('/catalog')} className="btn-primary">
            Découvrir le catalogue
          </button>
        </div>
      </div>
    );
  }

  const doctor = cart[0]?.doctorId;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/catalog')} className="text-gray-600 hover:text-primary-500">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Mon panier</h1>
        {doctor && (
          <span className="text-sm text-gray-500">
            Pour: {doctor.name} - {doctor.hospital}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="card flex items-center gap-4 p-4">
              <img
                src={item.productId?.imageUrl || '/images/products/default.png'}
                alt={item.productId?.name}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => e.target.src = '/images/products/default.png'}
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.productId?.name}</h3>
                <p className="text-sm text-gray-500">{item.productId?.type}</p>
                <p className="text-primary-600 font-bold">{item.productId?.price.toLocaleString()} FCFA</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-gray-800">{(item.productId?.price * item.quantity).toLocaleString()} FCFA</p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => clearCart()}
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <TrashIcon className="h-4 w-4" />
            Vider le panier
          </button>
        </div>

        {/* Résumé de la commande */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="text-lg font-bold mb-4">Résumé de la commande</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{summary.subtotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span className="font-medium">{summary.deliveryFee.toLocaleString()} FCFA</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-primary-600">{summary.total.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input"
            >
              <option value="bank_transfer">Virement bancaire</option>
              <option value="cash_on_delivery">Paiement à la livraison</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              rows="3"
              placeholder="Instructions particulières..."
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="btn-primary w-full py-3"
          >
            {checkoutLoading ? 'Commande en cours...' : 'Valider la commande'}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-2">
            <CheckBadgeIcon className="h-4 w-4 text-primary-500" />
            Paiement 100% sécurisé
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;