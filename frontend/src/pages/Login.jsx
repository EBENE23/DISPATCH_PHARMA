import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { EnvelopeIcon, LockClosedIcon, ShieldCheckIcon, TruckIcon, UserGroupIcon, BuildingOfficeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import logo from '../assets/images/logos/dispatch-logo.png';
import doctorBackground from '../assets/images/avatars/avatar-doctor.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyCode, resendCode } = useAuth();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Clear inputs on mount
  useEffect(() => {
    setEmail('');
    setPassword('');
    setCode('');
  }, []);

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result?.requiresCode) {
      setStep(2);
      setCountdown(300);
      startCountdown();
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await verifyCode(code);
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    setLoading(true);
    await resendCode();
    setCountdown(300);
    startCountdown();
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = [
    { value: '1200+', label: 'Livraisons actives', icon: <TruckIcon className="h-8 w-8 text-white" /> },
    { value: '350+', label: 'Délégués médicaux', icon: <UserGroupIcon className="h-8 w-8 text-white" /> },
    { value: '800+', label: 'Centres de santé', icon: <BuildingOfficeIcon className="h-8 w-8 text-white" /> },
  ];

  // ÉTAPE 2 : Vérification du code
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <img src={logo} alt="Dispatch Pharma" className="mx-auto h-16 w-auto" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Code de vérification</h2>
            <p className="mt-2 text-gray-600">
              Un code à 6 chiffres a été envoyé à <br />
              <strong>{email}</strong>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code à 6 chiffres
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="input text-center text-2xl tracking-widest"
                placeholder="000000"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Vérification...' : 'Se connecter'}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Renvoyer dans {formatTime(countdown)}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Renvoyer le code
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ÉTAPE 1 : Connexion email + mot de passe
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Colonne de gauche - Présentation avec image de fond */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Image de fond avec effet */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${doctorBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          {/* Overlay sombre pour lisibilité */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-800/95 to-primary-900/95" />
          
          {/* Motif décoratif */}
          <div className="absolute inset-0 opacity-10 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
            <div>
              <div className="flex items-center gap-2 mb-12">
           