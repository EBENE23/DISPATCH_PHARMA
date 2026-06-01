import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService, aiService } from '../services/api';
import { toast } from 'react-toastify';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, TruckIcon, ShieldCheckIcon, BeakerIcon, CheckBadgeIcon, ArrowPathIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, selectedDoctorId, loadCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productService.getById(id);
      setProduct(response.data.product);
      
      // Charger les recommandations IA similaires
      const productsRes = await productService.getAll();
      const similarProducts = (productsRes.data.products || [])
        .filter(p => p._id !== id && p.category === response.data.product.category)
        .slice(0, 4);
      setRecommendations(similarProducts);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      toast.error('Produit non trouvé');
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedDoctorId) {
      setShowDoctorModal(true);
      return;
    }
    
    setAdding(true);
    await addToCart(selectedDoctorId, product._id, quantity);
    setAdding(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="p-6">
      {/* Bouton retour */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-6">
        <ArrowLeftIcon className="h-4 w-4" />
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image produit */}
        <div className="card p-4">
          <img
            src={product.imageUrl || '/images/products/default.png'}
            alt={product.name}
            className="w-full rounded-lg object-cover"
            onError={(e) => e.target.src = '/images/products/default.png'}
          />
        </div>

        {/* Informations produit */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{product.category}</span>
              {product.stock < 50 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Stock limité</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-500">{product.laboratory}</p>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{renderStars(product.rating || 4.5)}</div>
              <span className="text-sm text-gray-500">({product.reviewCount || 120} avis)</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-3xl font-bold text-primary-600">{product.price.toLocaleString()} FCFA</p>
            <p className="text-sm text-gray-500">TVA incluse</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description || 'Aucune description disponible.'}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Indications thérapeutiques</h3>
            <p className="text-gray-600">{product.indications || 'Information non disponible'}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Spécialités ciblées</h3>
            <div className="flex flex-wrap gap-2">
              {(product.targetSpecialties || ['Généraliste']).map((spec, idx) => (
                <span key={idx} className="text-sm bg-gray-100 px-3 py-1 rounded-full">{spec}</span>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantité</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Stock disponible</p>
                <p className="font-medium">{product.stock} unités</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {adding ? 'Ajout...' : 'Ajouter au panier'}
            </button>
          </div>

          {/* Livraison info */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-primary-500" />
              <span>Livraison 2-3 jours</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-primary-500" />
              <span>100% authentique</span>
            </div>
            <div className="flex items-center gap-2">
              <BeakerIcon className="h-5 w-5 text-primary-500" />
              <span>Certifié ISO</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckBadgeIcon className="h-5 w-5 text-primary-500" />
              <span>Retour 14 jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {recommendations.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4"><ArrowPathIcon className="h-5 w-5 inline-block mr-2 text-primary-500" />Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.map(rec => (
              <div
                key={rec._id}
                onClick={() => navigate(`/product/${rec._id}`)}
                className="card p-3 cursor-pointer hover:shadow-lg transition-all"
              >
                <img
                  src={rec.imageUrl || '/images/products/default.png'}
                  alt={rec.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  onError={(e) => e.target.src = '/images/products/default.png'}
                />
                <h3 className="font-medium text-sm truncate">{rec.name}</h3>
                <p className="text-primary-600 font-bold text-sm">{rec.price.toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal sélection médecin */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4"><UserGroupIcon className="h-5 w-5 inline-block mr-2 text-primary-500" />Sélectionner un médecin</h3>
            <p className="text-gray-600 mb-4">
              Pour ajouter ce produit au panier, vous devez d'abord sélectionner un médecin.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/doctors')}
                className="btn-primary flex-1"
              >
                Voir mes médecins
              </button>
              <button
                onClick={() => setShowDoctorModal(false)}
                className="btn-outline flex-1"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;