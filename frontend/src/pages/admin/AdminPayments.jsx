import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AdminPayments = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'day', 'month', 'year'
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Données des paiements
  const [payments, setPayments] = useState([
    { id: 1, date: '2025-06-15', amount: 125000, type: 'Virement bancaire', status: 'Payé', user: 'Dr. Pierre Fouda', userType: 'pharmacist' },
    { id: 2, date: '2025-06-14', amount: 75000, type: 'Mobile Money', status: 'Payé', user: 'Jean Kamga', userType: 'delegate' },
    { id: 3, date: '2025-06-14', amount: 150000, type: 'Virement bancaire', status: 'En attente', user: 'Dr. Claire Ngo', userType: 'pharmacist' },
    { id: 4, date: '2025-06-13', amount: 22500, type: 'Espèces', status: 'Payé', user: 'Paul Ndi', userType: 'delivery' },
    { id: 5, date: '2025-06-12', amount: 98000, type: 'Mobile Money', status: 'Payé', user: 'Marie Ngo', userType: 'delegate' },
    { id: 6, date: '2025-05-28', amount: 120000, type: 'Virement bancaire', status: 'Payé', user: 'Dr. Jean Mbarga', userType: 'pharmacist' },
    { id: 7, date: '2025-05-20', amount: 45000, type: 'Mobile Money', status: 'Payé', user: 'Jacques Mbarga', userType: 'delivery' },
    { id: 8, date: '2025-04-15', amount: 250000, type: 'Virement bancaire', status: 'Payé', user: 'Dr. Pierre Fouda', userType: 'pharmacist' },
    { id: 9, date: '2025-04-10', amount: 35000, type: 'Espèces', status: 'En attente', user: 'Robert Ndongo', userType: 'delivery' },
    { id: 10, date: '2025-03-25', amount: 185000, type: 'Mobile Money', status: 'Payé', user: 'Jean Kamga', userType: 'delegate' },
  ]);

  // ==================== FILTRES PAR DATE ====================
  const getFilteredPaymentsByDate = () => {
    let filtered = payments;
    
    if (viewMode === 'day') {
      const dateStr = currentDate.toISOString().split('T')[0];
      filtered = filtered.filter(p => p.date === dateStr);
    } else if (viewMode === 'month') {
      const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      filtered = filtered.filter(p => p.date.startsWith(monthStr));
    } else if (viewMode === 'year') {
      filtered = filtered.filter(p => p.date.startsWith(currentDate.getFullYear().toString()));
    }
    
    return filtered;
  };

  // ==================== FILTRES RECHERCHE ====================
  const getFilteredPayments = () => {
    let filtered = getFilteredPaymentsByDate();
    filtered = filtered.filter(p => 
      p.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    return filtered;
  };

  const filteredPayments = getFilteredPayments();
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = filteredPayments.filter(p => p.status === 'Payé').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  // ==================== NAVIGATION ====================
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + direction);
    } else if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (viewMode === 'year') {
      newDate.setFullYear(currentDate.getFullYear() + direction);
    }
    setCurrentDate(newDate);
  };

  const getDateDisplay = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } else if (viewMode === 'month') {
      return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    } else {
      return currentDate.getFullYear().toString();
    }
  };

  const handleDateSelect = (year, month, day) => {
    if (day) {
      setCurrentDate(new Date(year, month, day));
      setViewMode('day');
    } else if (month !== undefined) {
      setCurrentDate(new Date(year, month, 1));
      setViewMode('month');
    } else {
      setCurrentDate(new Date(year, 0, 1));
      setViewMode('year');
    }
    setShowCalendar(false);
  };

  // ==================== RENDU CALENDRIER POPUP ====================
  const renderCalendarPopup = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    
    const days = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const hasPayments = payments.some(p => p.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      days.push(
        <button
          key={d}
          onClick={() => handleDateSelect(year, month, d)}
          className={`h-8 w-8 rounded-full text-sm transition-colors flex items-center justify-center ${
            hasPayments ? 'bg-blue-100 text-blue-700 font-medium hover:bg-blue-200' : 'hover:bg-gray-100'
          } ${currentDate.getDate() === d && viewMode === 'day' ? 'bg-primary-500 text-white hover:bg-primary-600' : ''}`}
        >
          {d}
        </button>
      );
    }
    
    return (
      <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border p-4 z-30 w-80">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="font-medium">{monthNames[month]} {year}</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-gray-100 rounded">
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
        <div className="flex justify-between mt-4 pt-3 border-t">
          <button onClick={() => handleDateSelect(year)} className="text-xs text-blue-600 hover:text-blue-700">Année</button>
          <button onClick={() => handleDateSelect(year, month)} className="text-xs text-blue-600 hover:text-blue-700">Mois</button>
          <button onClick={() => handleDateSelect(year, month, currentDate.getDate())} className="text-xs text-blue-600 hover:text-blue-700">Aujourd'hui</button>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'Payé' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div>
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Total transactions</p>
          <p className="text-2xl font-bold text-gray-800">{filteredPayments.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Montant total</p>
          <p className="text-2xl font-bold text-green-600">{totalAmount.toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingAmount.toLocaleString()} FCFA</p>
        </div>
      </div>

      {/* Barre de contrôle */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            Jour
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            Mois
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'year' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            Année
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{getDateDisplay()}</span>
            </button>
            {showCalendar && renderCalendarPopup()}
          </div>
          <button onClick={() => navigateDate(1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filtres recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-40"
        >
          <option value="all">Tous les statuts</option>
          <option value="Payé">Payés</option>
          <option value="En attente">En attente</option>
        </select>
      </div>

      {/* Liste des paiements */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concerné</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{payment.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.type}</td>
                  <td className="px-6 py-4 font-bold text-primary-600">{payment.amount.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl mt-6">
          <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun paiement trouvé pour cette période</p>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;