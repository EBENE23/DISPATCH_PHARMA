import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  ShoppingBagIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

// ==================== IMPORT DES IMAGES EXISTANTES ====================
import immunobioImg from '../../assets/images/products/immunobio.webp';
import hepacareImg from '../../assets/images/products/hepacare.jpeg';
import neuroplusImg from '../../assets/images/products/neuroplus.jpg';
import cardiostabImg from '../../assets/images/products/cardiostab.jpeg';
import immunoboostImg from '../../assets/images/products/immunoboost.webp';
import hepatoprimeImg from '../../assets/images/products/hepatoprime.webp';
import calmstressImg from '../../assets/images/products/calmstress.png';
import articomfortImg from '../../assets/images/products/articomfort.png';

// Gestion de l'image pedialol (peut avoir deux noms)
let pedialolImg;
try {
  pedialolImg = require('../../assets/images/products/pedialol.jpg');
} catch {
  try {
    pedialolImg = require('../../assets/images/products/pediadol.jpg');
  } catch {
    pedialolImg = null;
  }
}

const AdminCatalog = () => {
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'ImmunoBio', 
      type: 'Immunostimulant', 
      price: 125000, 
      stock: 45, 
      status: 'disponible', 
      lastUpdate: '2025-06-10',
      image: immunobioImg,
      laboratory: 'BioPharma Cameroun',
      description: 'Solution injectable pour le renforcement du système immunitaire'
    },
    { 
      id: 2, 
      name: 'HepaCare', 
      type: 'Hépatoprotecteur', 
      price: 15000, 
      stock: 128, 
      status: 'disponible', 
      lastUpdate: '2025-06-09',
      image: hepacareImg,
      laboratory: 'PharmaLab Cameroon',
      description: 'Protection hépatique naturelle à base de chardon-marie'
    },
    { 
      id: 3, 
      name: 'NeuroPlus', 
      type: 'Neurotonique', 
      price: 15000, 
      stock: 8, 
      status: 'bientot', 
      lastUpdate: '2025-06-05',
      image: neuroplusImg,
      laboratory: 'NeuroPharma',
      description: 'Complément alimentaire pour la mémoire et la concentration'
    },
    { 
      id: 4, 
      name: 'CardioStab', 
      type: 'Antihypertenseur', 
      price: 18500, 
      stock: 56, 
      status: 'disponible', 
      lastUpdate: '2025-06-08',
      image: cardiostabImg,
      laboratory: 'CardioLab',
      description: 'Régulateur de pression artérielle'
    },
    { 
      id: 5, 
      name: 'ImmunoBoost', 
      type: 'Immunostimulant', 
      price: 95000, 
      stock: 23, 
      status: 'disponible', 
      lastUpdate: '2025-06-07',
      image: immunoboostImg,
      laboratory: 'BioPharma Cameroun',
      description: 'Boosteur immunitaire nouvelle génération'
    },
    { 
      id: 6, 
      name: 'HepatoPrime', 
      type: 'Hépatoprotecteur', 
      price: 25000, 
      stock: 67, 
      status: 'disponible', 
      lastUpdate: '2025-06-06',
      image: hepatoprimeImg,
      laboratory: 'PharmaLab Cameroon',
      description: 'Détoxifiant hépatique avancé'
    },
    { 
      id: 7, 
      name: 'CalmStress', 
      type: 'Anxiolytique', 
      price: 12000, 
      stock: 89, 
      status: 'disponible', 
      lastUpdate: '2025-06-04',
      image: calmstressImg,
      laboratory: 'NeuroPharma',
      description: 'Solution naturelle contre le stress et l\'anxiété'
    },
    { 
      id: 8, 
      name: 'ArticoMfort', 
      type: 'Anti-inflammatoire', 
      price: 18500, 
      stock: 34, 
      status: 'disponible', 
      lastUpdate: '2025-06-03',
      image: articomfortImg,
      laboratory: 'BioPharma Cameroun',
      description: 'Soulagement des douleurs articulaires'
    },
  ]);

  // Ajouter PediaDol seulement si l'image existe
  if (pedialolImg && products.length === 8) {
    products.push({
      id: 9, 
      name: 'PediaDol', 
      type: 'Antipyrétique', 
      price: 5000, 
      stock: 120, 
      status: 'disponible', 
      lastUpdate: '2025-06-02',
      image: pedialolImg,
      laboratory: 'ChildCare Pharma',
      description: 'Fièvre chez l\'enfant de 3 mois à 12 ans'
    });
  }

  // ==================== ÉTATS ====================
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    stock: '',
    status: 'disponible',
    laboratory: '',
    description: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ==================== FILTRES ====================
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedStatus === 'all' || p.status === selectedStatus)
  );

  // ==================== GESTION DU FORMULAIRE ====================
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        type: product.type,
        price: product.price,
        stock: product.stock,
        status: product.status,
        laboratory: product.laboratory,
        description: product.description
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        type: '',
        price: '',
        stock: '',
        status: 'disponible',
        laboratory: '',
        description: ''
      });
      setImagePreview(null);
      setSelectedImage(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      type: '',
      price: '',
      stock: '',
      status: 'disponible',
      laboratory: '',
      description: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    
    if (editingProduct) {
      // Modification d'un produit existant
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...p, 
              ...formData, 
              price: parseFloat(formData.price), 
              stock: parseInt(formData.stock),
              lastUpdate: today,
              image: imagePreview || p.image
            }
          : p
      ));
    } else {
      // Ajout d'un nouveau produit
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, {
        id: newId,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        lastUpdate: today,
        image: imagePreview || 'https://placehold.co/400x300/0157bd/white?text=' + encodeURIComponent(formData.name)
      }]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // ==================== RENDU DES BADGES ====================
  const getStatusBadge = (status) => {
    switch(status) {
      case 'disponible': return { text: 'Disponible', color: 'bg-green-100 text-green-800', icon: '✅' };
      case 'bientot': return { text: 'Bientôt disponible', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' };
      case 'rupture': return { text: 'Rupture de stock', color: 'bg-red-100 text-red-800', icon: '❌' };
      default: return { text: 'Inconnu', color: 'bg-gray-100 text-gray-800', icon: '❓' };
    }
  };

  const getStockColor = (stock) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 20) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Catalogue produits</h1>
        <p className="text-gray-500">Gérez les produits biopharmaceutiques</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input w-40"
          >
            <option value="all">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="bientot">Bientôt disponible</option>
            <option value="rupture">Rupture</option>
          </select>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Nouveau produit
          </button>
        </div>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const status = getStatusBadge(product.status);
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
              {/* Image du produit */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300/0157bd/white?text=' + encodeURIComponent(product.name);
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${status.color} flex items-center gap-1 shadow-sm`}>
                    <span>{status.icon}</span>
                    {status.text}
                  </span>
                </div>
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg px-3 py-1 bg-red-600 rounded-lg">RUPTURE DE STOCK</span>
                  </div>
                )}
              </div>

              {/* Informations du produit */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{product.name}</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenModal(product)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Voir détails">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-2">{product.type}</p>
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Laboratoire</span>
                    <span className="text-xs font-medium text-gray-700">{product.laboratory}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Prix unitaire</span>
                    <span className="text-lg font-bold text-primary-600">{product.price.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Stock disponible</span>
                    <span className={`text-sm font-semibold ${getStockColor(product.stock)}`}>
                      {product.stock} unités
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Dernière mise à jour</span>
                    <span className="text-xs text-gray-500">{product.lastUpdate}</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors">
                  Gérer le stock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun produit */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      )}

      {/* ==================== MODAL AJOUT/MODIFICATION PRODUIT ==================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h3>
              <button onClick={handleCloseModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Upload d'image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Ex: ImmunoBio Plus"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input"
                    placeholder="Ex: Immunostimulant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratoire *</label>
                  <input
                    type="text"
                    required
                    value={formData.laboratory}
                    onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                    className="input"
                    placeholder="Ex: BioPharma Cameroun"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    placeholder="Ex: 125000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input"
                    placeholder="Ex: 45"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input"
                >
                  <option value="disponible">Disponible</option>
                  <option value="bientot">Bientôt disponible</option>
                  <option value="rupture">Rupture de stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  placeholder="Description du produit..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Mettre à jour' : 'Ajouter le produit'}
                </button>
                <button type="button" onClick={handleCloseModal} className="btn-outline flex-1">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalog;