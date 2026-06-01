import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon, MapPinIcon, BuildingOffice2Icon, TruckIcon, ShieldCheckIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authService.getMe();
      setProfile(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // TODO: Implémenter la mise à jour du profil
    toast.info('Fonctionnalité à venir');
    setIsEditing(false);
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrateur',
      delegate: 'Délégué Médical',
      pharmacist: 'Pharmacien Hospitalier',
      delivery: 'Livreur'
    };
    return roles[role] || role;
  };

  const getRoleIcon = (role) => {
    if (role === 'delegate') return <BriefcaseIcon className="h-5 w-5" />;
    if (role === 'pharmacist') return <BuildingOffice2Icon className="h-5 w-5" />;
    if (role === 'delivery') return <TruckIcon className="h-5 w-5" />;
    return <CheckBadgeIcon className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <img
            src={profile.avatar || '/images/avatars/default-avatar.png'}
            alt={profile.fullName}
            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary-500"
            onError={(e) => e.target.src = '/images/avatars/default-avatar.png'}
          />
          <div className="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full p-2">
            {getRoleIcon(profile.role)}
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4">{profile.fullName}</h1>
        <p className="text-primary-600">{getRoleLabel(profile.role)}</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{profile.totalOrders || 0}</p>
          <p className="text-sm text-gray-500">Commandes</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{profile.sector || 'Non défini'}</p>
          <p className="text-sm text-gray-500">Secteur</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">
            {new Date(profile.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })}
          </p>
          <p className="text-sm text-gray-500">Membre depuis</p>
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="card p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Informations personnelles</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary-600 hover:text-primary-700"
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Enregistrer</button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <UserCircleIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.fullName}</span>
            </div>
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.phone || 'Non renseigné'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Informations professionnelles */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Informations professionnelles</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">Rôle: {getRoleLabel(profile.role)}</span>
          </div>
          
          {profile.role === 'delegate' && (
            <>
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Secteur: {profile.sector || 'Non défini'}</span>
              </div>
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Matricule: {profile.employeeId || 'Non défini'}</span>
              </div>
            </>
          )}
          
          {profile.role === 'pharmacist' && (
            <>
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Hôpital: {profile.hospitalName || 'Non défini'}</span>
              </div>
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Licence: {profile.licenseNumber || 'Non défini'}</span>
              </div>
            </>
          )}
          
          {profile.role === 'delivery' && (
            <>
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Zone: {profile.zone || 'Non défini'}</span>
              </div>
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Plaque: {profile.vehiclePlate || 'Non défini'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sécurité */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4"><ShieldCheckIcon className="h-5 w-5 inline-block mr-2 text-primary-500" />Sécurité</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Authentification à deux facteurs</p>
              <p className="text-sm text-gray-500">Sécurisez votre compte avec le code email</p>
            </div>
            <span className="badge-success px-3 py-1 text-sm">Activée</span>
          </div>
          
          <div className="border-t pt-4">
            <button
              onClick={() => {
                if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                  logout();
                }
              }}
              className="btn-outline w-full text-red-600 border-red-300 hover:bg-red-50"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;