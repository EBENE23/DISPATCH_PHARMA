import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { doctorService, aiService } from '../services/api';
import { toast } from 'react-toastify';
import { MagnifyingGlassIcon, ShoppingBagIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Doctors = () => {
  const { user } = useAuth();
  const { selectedDoctorId, loadCart } = useCart();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, selectedSpecialty, doctors]);

  const loadDoctors = async () => {
    try {
      const response = await doctorService.getAll();
      setDoctors(response.data.doctors || []);
      setFilteredDoctors(response.data.doctors || []);
      
      const uniqueSpecialties = [...new Set(response.data.doctors.map(d => d.specialty))];
      setSpecialties(uniqueSpecialties);
    } catch (error) {
      console.error('Erreur chargement médecins:', error);
      toast.error('Erreur lors du chargement des médecins');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];
    
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialty) {
      filtered = filtered.filter(d => d.specialty === selectedSpecialty);
    }
    
    setFilteredDoctors(filtered);
  };

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    await loadCart(doctor._id);
    toast.success(`Médecin sélectionné: ${doctor.name}`);
    
    // Charger la prédiction IA
    try {
      const response = await aiService.predict(doctor._id);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Erreur IA:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mes médecins</h1>
        <p className="text-gray-500">Gérez vos relations avec les médecins prescripteurs</p>
      </div>

      {/* Barre de recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un médecin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="">Toutes spécialités</option>
          {specialties.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* Médecin sélectionné */}
      {selectedDoctor && (
        <div className="card p-4 mb-6 bg-primary-50 border border-primary-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-primary-600">Médecin actif</p>
              <p className="font-semibold">{selectedDoctor.name}</p>
              <p className="text-sm text-gray-600">{selectedDoctor.specialty} - {selectedDoctor.hospital}</p>
            </div>
            <div className="text-right">
              <ShoppingBagIcon className="h-8 w-8 text-primary-500 mx-auto" />
              <p className="text-xs text-gray-500">Panier actif</p>
            </div>
          </div>
          
          {prediction && (
            <div className="mt-3 p-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4 text-primary-500" />
                <span className="text-xs font-medium">Prédiction IA: {prediction.message}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Liste des médecins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className={`card p-4 cursor-pointer transition-all ${
              selectedDoctorId === doctor._id ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-lg'
            }`}
            onClick={() => handleSelectDoctor(doctor)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                <p className="text-sm text-primary-600">{doctor.specialty}</p>
                <p className="text-xs text-gray-500 mt-1">{doctor.hospital}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(doctor.visitScore || 50)}`}>
                Score: {doctor.visitScore || 50}%
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t flex justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ChartBarIcon className="h-3 w-3" />
                <span>{doctor.totalOrders || 0} commandes</span>
              </div>
              <div>
                <span>Meilleur moment: {doctor.preferredContactHour || 10}:00</span>
              </div>
            </div>
            
            {selectedDoctorId === doctor._id && (
              <div className="mt-2 text-center">
                <span className="text-primary-600 text-xs font-medium">✓ Actuellement sélectionné</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun médecin trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;