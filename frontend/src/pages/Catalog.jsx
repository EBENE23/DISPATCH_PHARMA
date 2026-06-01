import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, cartService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Catalog = () => {
  const { user } = useAuth();
  const { addToCart, selectedDoctorId, loadCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [addingProduct, setAddingProduct] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []);
      
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(response.data.products.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.laboratory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product) => {
    if (!selectedDoctorId) {
      setSelectedProduct(product);
      setShowDoctorModal(true);
      return;
    }
    
    setAddingProduct(product._id);
    await addToCart(selectedDoctorId, product._id, 1);
    setAddingProduct(null);
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
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Catalogue des produits</h1>
        <p className="text-gray-500">Découvrez notre gamme de produits biopharmaceutiques</p>
      </div>
      
      {/* Barre de recherche et filtre */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="relative">
          <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input pl-10 appearance-none"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Grille de produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="card group hover:scale-105 transition-transform duration-300">
            <Link to={`/product/${product._id}`}>
              <div className="relative pb-[100%] mb-4 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.imageUrl || '/images/products/default.png'}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => e.target.src = '/images/products/default.png'}
                />
                {product.stock < 50 && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Stock faible
                  </span>
                )}
              </div>
            </Link>
            
            <div>
              <Link to={`/product/${product._id}`}>
                <h3 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500">{product.type}</p>
              <p className="text-sm text-gray-400">{product.laboratory}</p>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xl font-bold text-primary-600">
                  {product.price.toLocaleString()} FCFA
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingProduct === product._id || product.stock === 0}
                  className="btn-primary py-2 px-4 text-sm"
                >
                  {addingProduct === product._id ? 'Ajout...' : 'Ajouter au panier'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal sélection médecin */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Sélectionner un médecin</h3>
            <p className="text-gray-600 mb-4">
              Pour ajouter {selectedProduct?.name} au panier, veuillez d'abord sélectionner un médecin.
            </p>
            <div className="flex gap-3">
              <Link to="/doctors" className="btn-primary flex-1 text-center">
                Voir mes médecins
              </Link>
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

export default Catalog;