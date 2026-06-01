import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import { toast } from 'react-toastify';
import { EyeIcon, TruckIcon, CheckCircleIcon, ClockIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAll();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      processing: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: TruckIcon },
      delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: ClockIcon },
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune commande</h3>
          <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <div key={order._id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.doctorId?.name} - {order.doctorId?.hospital}
                    </p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <p className="font-bold text-primary-600 text-xl">{order.totalAmount.toLocaleString()} FCFA</p>
                    <p className="text-xs text-gray-400">{formatDate(order.orderDate)}</p>
                  </div>
                </div>

                <div className="border-t pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TruckIcon className="h-4 w-4" />
                    <span>Livraison: {order.shippingAddress || 'Adresse non spécifiée'}</span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Voir les détails
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal détails commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Commande {selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                <p><strong>Statut:</strong> {selectedOrder.status}</p>
                <p><strong>Médecin:</strong> {selectedOrder.doctorId?.name}</p>
                <p><strong>Hôpital:</strong> {selectedOrder.doctorId?.hospital}</p>
                <p><strong>Mode de paiement:</strong> {selectedOrder.paymentMethod === 'bank_transfer' ? 'Virement bancaire' : selectedOrder.paymentMethod === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Mobile Money'}</p>
                <p><strong>Adresse de livraison:</strong> {selectedOrder.shippingAddress || 'Non spécifiée'}</p>
                {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
              </div>
              
              <div className="border-t pt-3">
                <p className="font-bold text-lg">Total: {selectedOrder.totalAmount.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;