import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempToken, setTempToken] = useState(null);

  // ==================== CHARGEMENT DE L'UTILISATEUR ====================
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      // Récupérer les données du localStorage d'abord
      const savedUser = localStorage.getItem('user');
      let localUser = null;
      if (savedUser) {
        try {
          localUser = JSON.parse(savedUser);
        } catch (e) {
          console.error('Erreur parsing user:', e);
        }
      }
      
      if (token) {
        try {
          const response = await authService.getMe();
          const backendUser = response.data.user;
          
          // Fusionner : garder l'avatar du localStorage s'il existe
          const mergedUser = {
            ...backendUser,
            avatar: localUser?.avatar || backendUser?.avatar || null
          };
          
          setUser(mergedUser);
          localStorage.setItem('user', JSON.stringify(mergedUser));
        } catch (error) {
          console.error('Erreur chargement utilisateur:', error);
          // Si erreur, on garde l'utilisateur du localStorage
          if (localUser) {
            setUser(localUser);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } else if (localUser) {
        // Si pas de token mais user dans localStorage (cas rare)
        setUser(localUser);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // ==================== MISE À JOUR DU PROFIL ====================
  const updateUser = (updatedData) => {
    const currentUser = user || {};
    const updatedUser = { ...currentUser, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // ==================== ÉTAPE 1 : CONNEXION ====================
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.data.requiresCode) {
        setTempToken(response.data.tempToken);
        return { success: true, requiresCode: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
      return { success: false };
    }
  };

  // ==================== ÉTAPE 2 : VÉRIFICATION DU CODE 2FA ====================
  const verifyCode = async (code) => {
    if (!tempToken) {
      toast.error('Session expirée, veuillez vous reconnecter');
      return false;
    }

    try {
      const response = await authService.verifyCode(tempToken, code);
      localStorage.setItem('token', response.data.token);
      
      // Récupérer l'avatar existant s'il y en a un
      const savedUser = localStorage.getItem('user');
      const localUser = savedUser ? JSON.parse(savedUser) : {};
      
      const userData = {
        ...response.data.user,
        avatar: localUser?.avatar || response.data.user?.avatar || null
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setTempToken(null);
      toast.success('Connexion réussie !');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Code invalide');
      return false;
    }
  };

  // ==================== RENVOYER LE CODE ====================
  const resendCode = async () => {
    if (!tempToken) {
      toast.error('Session expirée');
      return false;
    }

    try {
      const response = await authService.resendCode(tempToken);
      setTempToken(response.data.tempToken);
      toast.success('Nouveau code envoyé par email');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur');
      return false;
    }
  };

  // ==================== DÉCONNEXION ====================
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTempToken(null);
    toast.info('Déconnecté');
  };

  // ==================== CONTEXTE ====================
  const value = {
    user,
    loading,
    login,
    verifyCode,
    resendCode,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isDelegate: user?.role === 'delegate',
    isPharmacist: user?.role === 'pharmacist',
    isDelivery: user?.role === 'delivery',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};