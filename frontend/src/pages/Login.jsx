import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    const user = await verifyCode(code);
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
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
                <img src={logo} alt="Dispatch Pharma" className="h-12 w-auto brightness-0 invert" />
                <span className="font-bold text-2xl">
                  <span style={{ color: '#ffffff' }}>DISPATCH</span>{' '}
                  <span style={{ color: '#44ac40' }}>PHARMA</span>
                </span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                La plateforme qui révolutionne la distribution médicale
              </h1>
              <p className="text-primary-100 text-lg mb-12">
                Connectez les équipes médicales, centres de santé et livreurs sur une plateforme sécurisée.
              </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-primary-100 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Badge certification */}
            <div className="flex items-center gap-2 text-primary-100">
              <ShieldCheckIcon className="h-5 w-5" />
              <span className="text-sm">Plateforme certifiée & sécurisée</span>
            </div>
          </div>
        </div>

        {/* Colonne de droite - Formulaire de connexion */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            {/* Logo visible sur mobile */}
            <div className="text-center lg:hidden">
              <img src={logo} alt="Dispatch Pharma" className="mx-auto h-12 w-auto" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">DISPATCH PHARMA</h2>
            </div>

            {/* Titre caché sur desktop car déjà dans colonne gauche */}
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
              <p className="text-gray-600 mt-1">Accédez à votre espace sécurisé</p>
            </div>

            <div className="lg:hidden text-center mb-8">
              <p className="text-gray-600">Accédez à votre espace sécurisé</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin} autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="abcde@wxyz.com"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            <div className="text-center text-xs text-gray-400 mt-8">
              <p>Accès réservé aux membres autorisés de DISPATCH PHARMA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;