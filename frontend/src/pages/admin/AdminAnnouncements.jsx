import React, { useState } from 'react';
import { 
  MegaphoneIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon,
  XMarkIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

// Import des images produits pour les annonces
import immunobioImg from '../../assets/images/products/immunobio.webp';
import hepacareImg from '../../assets/images/products/hepacare.jpeg';
import neuroplusImg from '../../assets/images/products/neuroplus.jpg';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: 'Nouveau produit : ImmunoBio Plus', 
      content: 'Nous sommes ravis d\'annoncer l\'arrivée de notre nouveau produit ImmunoBio Plus, une formule avancée pour le renforcement immunitaire. Disponible dès maintenant en commande.',
      target: 'all', 
      status: 'published', 
      date: '2025-06-15',
      productImage: immunobioImg,
      productName: 'ImmunoBio Plus',
      productPrice: 145000
    },
    { 
      id: 2, 
      title: 'Promotion exceptionnelle sur HepaCare', 
      content: 'Profitez de 20% de réduction sur HepaCare jusqu\'au 30 juin 2025. Code promo : HEPA20',
      target: 'pharmacists', 
      status: 'published', 
      date: '2025-06-10',
      productImage: hepacareImg,
      productName: 'HepaCare',
      productPrice: 12000
    },
    { 
      id: 3, 
      title: 'Maintenance programmée', 
      content: 'L\'application sera indisponible le dimanche 22 juin de 02h00 à 04h00 pour maintenance et améliorations.',
      target: 'all', 
      status: 'published', 
      date: '2025-06-08',
      productImage: null,
      productName: null,
      productPrice: null
    },
    { 
      id: 4, 
      title: 'Nouveau produit : NeuroPlus Premium', 
      content: 'Découvrez NeuroPlus Premium, notre nouvelle formule avancée pour la mémoire et la concentration.',
      target: 'delegates', 
      status: 'draft', 
      date: '2025-06-05',
      productImage: neuroplusImg,
      productName: 'NeuroPlus Premium',
      productPrice: 25000
    },
    { 
      id: 5, 
      title: 'Formation des délégués médicaux', 
      content: 'Une formation en ligne sur les nouveaux protocoles de prescription aura lieu le 5 juillet.',
      target: 'delegates', 
      status: 'published', 
      date: '2025-06-01',
      productImage: null,
      productName: null,
      productPrice: null
    },
    { 
      id: 6, 
      title: 'Nouveaux horaires de livraison', 
      content: 'Les livraisons seront désormais effectuées du lundi au samedi de 08h à 18h.',
      target: 'delivery', 
      status: 'published', 
      date: '2025-05-28',
      productImage: null,
      productName: null,
      productPrice: null
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'all',
    status: 'draft',
    productImage: null,
    productName: '',
    productPrice: ''
  });

  // ==================== FILTRES ====================
  const targets = [
    { value: 'all', label: 'Tous les utilisateurs', icon: <UserGroupIcon className="h-4 w-4" /> },
    { value: 'pharmacists', label: 'Pharmaciens uniquement', icon: '💊' },
    { value: 'delegates', label: 'Délégués uniquement', icon: '👨‍⚕️' },
    { value: 'delivery', label: 'Livreurs uniquement', icon: '🚚' },
  ];

  const getTargetLabel = (target) => {
    return targets.find(t => t.value === target)?.label || 'Tous';
  };

  const getStatusBadge = (status) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusLabel = (status) => {
    return status === 'published' ? 'Publiée' : 'Brouillon';
  };

  // Tri des annonces par date (plus récent au plus ancien)
  const getFilteredAnnouncements = () => {
    let filtered = [...announcements];
    
    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par cible
    if (selectedTarget !== 'all') {
      filtered = filtered.filter(a => a.target === selectedTarget);
    }
    
    // Filtrer par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }
    
    // Filtrer par date (calendrier)
    const selectedDate = currentDate.toISOString().split('T')[0];
    filtered = filtered.filter(a => a.date === selectedDate);
    
    // Tri du plus récent au plus ancien
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return filtered;
  };

  const filteredAnnouncements = getFilteredAnnouncements();
  
  const stats = { 
    total: announcements.length, 
    published: announcements.filter(a => a.status === 'published').length, 
    draft: announcements.filter(a => a.status === 'draft').length 
  };

  // ==================== NAVIGATION CALENDRIER ====================
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectDate = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setCurrentDate(newDate);
    setShowCalendar(false);
  };

  // ==================== GESTION CRUD ====================
  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        target: announcement.target,
        status: announcement.status,
        productImage: announcement.productImage,
        productName: announcement.productName || '',
        productPrice: announcement.productPrice || ''
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        target: 'all',
        status: 'draft',
        productImage: null,
        productName: '',
        productPrice: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    
    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => 
        a.id === editingAnnouncement.id 
          ? { ...a, ...formData, date: today }
          : a
      ));
    } else {
      const newId = Math.max(...announcements.map(a => a.id), 0) + 1;
      setAnnouncements([{
        id: newId,
        ...formData,
        date: today
      }, ...announcements]);
    }
    setShowModal(false);
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      content: '',
      target: 'all',
      status: 'draft',
      productImage: null,
      productName: '',
      productPrice: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  // ==================== RENDU CALENDRIER ====================
  const renderCalendarPopup = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasAnnouncements = announcements.some(a => a.date === dateStr);
      days.push(
        <button
          key={d}
          onClick={() => selectDate(d)}
          className={`h-8 w-8 rounded-full text-sm transition-colors flex items-center justify-center ${
            hasAnnouncements ? 'bg-blue-100 text-blue-700 font-medium hover:bg-blue-200' : 'hover:bg-gray-100'
          } ${currentDate.getDate() === d && currentDate.getMonth() === month ? 'bg-primary-500 text-white hover:bg-primary-600' : ''}`}
        >
          {d}
        </button>
      );
    }
    
    return (
      <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-lg border p-4 z-30 w-80">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="font-medium">{monthNames[month]} {year}</span>
          <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-gray-500">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
        <button 
          onClick={() => setCurrentDate(new Date())}
          className="w-full mt-3 text-xs text-blue-600 hover:text-blue-700 text-center"
        >
          Aujourd'hui
        </button>
      </div>
    );
  };

  return (
    <div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <MegaphoneIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total annonces</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <EyeIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.published}</p>
          <p className="text-sm text-gray-500">Publiées</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <PencilIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.draft}</p>
          <p className="text-sm text-gray-500">Brouillons</p>
        </div>
      </div>

      {/* Barre de contrôle */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-2">
          <select 
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="input w-40"
          >
            <option value="all">Toutes les cibles</option>
            <option value="all">Tous les utilisateurs</option>
            <option value="pharmacists">Pharmaciens</option>
            <option value="delegates">Délégués</option>
            <option value="delivery">Livreurs</option>
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input w-40"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiées</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">
                {currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </button>
            {showCalendar && renderCalendarPopup()}
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Nouvelle annonce
          </button>
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div 
            key={announcement.id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedAnnouncement(announcement);
              setShowDetailModal(true);
            }}
          >
            <div className="flex">
              {/* Image du produit à gauche */}
              {announcement.productImage ? (
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                  <img 
                    src={announcement.productImage} 
                    alt={announcement.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <MegaphoneIcon className="h-12 w-12 text-white opacity-50" />
                </div>
              )}
              
              {/* Contenu de l'annonce */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{announcement.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString('fr-FR')}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(announcement.status)}`}>
                        {getStatusLabel(announcement.status)}
                      </span>
                      <span className="text-xs text-gray-500">Cible : {getTargetLabel(announcement.target)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleOpenModal(announcement)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{announcement.content}</p>
                {announcement.productName && (
                  <div className="mt-2 flex items-center gap-2">
                    <ShoppingBagIcon className="h-4 w-4 text-primary-500" />
                    <span className="text-xs text-gray-500">{announcement.productName}</span>
                    {announcement.productPrice && (
                      <span className="text-xs font-bold text-primary-600">{announcement.productPrice.toLocaleString()} FCFA</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <MegaphoneIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune annonce trouvée pour cette date</p>
        </div>
      )}

      {/* ==================== MODAL DETAILS ANNONCE ==================== */}
      {showDetailModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Détail de l'annonce</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {selectedAnnouncement.productImage && (
                <div className="mb-6">
                  <img 
                    src={selectedAnnouncement.productImage} 
                    alt={selectedAnnouncement.productName}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedAnnouncement.title}</h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-500">{new Date(selectedAnnouncement.date).toLocaleDateString('fr-FR')}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedAnnouncement.status)}`}>
                  {getStatusLabel(selectedAnnouncement.status)}
                </span>
                <span className="text-sm text-gray-500">Cible : {getTargetLabel(selectedAnnouncement.target)}</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">{selectedAnnouncement.content}</p>
              {selectedAnnouncement.productName && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-800">Produit concerné</p>
                  <p className="text-gray-600">{selectedAnnouncement.productName}</p>
                  {selectedAnnouncement.productPrice && (
                    <p className="text-primary-600 font-bold mt-1">{selectedAnnouncement.productPrice.toLocaleString()} FCFA</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL AJOUT/MODIFICATION ==================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingAnnouncement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Titre de l'annonce"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  required
                  rows="4"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input"
                  placeholder="Contenu de l'annonce..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cible</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="input"
                  >
                    {targets.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publier</option>
                  </select>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Produit concerné (optionnel)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Nom du produit</label>
                    <input
                      type="text"
                      value={formData.productName || ''}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="input"
                      placeholder="Nom du produit"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Prix</label>
                    <input
                      type="number"
                      value={formData.productPrice || ''}
                      onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                      className="input"
                      placeholder="Prix en FCFA"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingAnnouncement ? 'Mettre à jour' : 'Publier'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
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

export default AdminAnnouncements;