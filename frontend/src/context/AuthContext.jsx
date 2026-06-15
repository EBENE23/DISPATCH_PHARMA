import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempToken, setTempToken] = useState(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Étape 1 : Connexion (email + mot de passe)
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

  // Étape 2 : Vérification du code 2FA
  const verifyCode = async (code) => {
    if (!tempToken) {
      toast.error('Session expirée, veuillez vous reconnecter');
      return false;
    }

    try {
      const response = await authService.verifyCode(tempToken, code);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setTempToken(null);
      toast.success('Connexion réussie !');
      return response.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Code invalide');
      return false;
    }
  };

  // Renvoyer le code
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

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTempToken(null);
    toast.info('Déconnecté');
  };

  const value = {
    user,
    loading,
    login,
    verifyCode,
    resendCode,
    logout,
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