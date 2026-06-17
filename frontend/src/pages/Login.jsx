import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  ArrowPathIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import logo from '../assets/images/logos/dispatch-logo.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

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

  // Initialiser AOS pour les animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out'
    });
  }, []);

  // ==================== MATRIX EFFECT ====================
  const canvasRef = useRef(null);
  const [matrixRunning, setMatrixRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let columns = Math.floor(width / 20);
    let drops = [];

    const initDrops = () => {
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops.push(Math.floor(Math.random() * -100));
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / 20);
      initDrops();
    };

    canvas.width = width;
    canvas.height = height;
    initDrops();

    const fontSize = 18;
    ctx.font = `${fontSize}px 'Courier New', monospace`;

    let animationId;
    const draw = () => {
      if (!matrixRunning) return;

      ctx.fillStyle = 'rgba(0, 10, 20, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0af';
      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = Math.random() > 0.5 ? '1' : '0';
        const blue = Math.floor(Math.random() * 100 + 100);
        ctx.fillStyle = `rgb(0, ${Math.floor(blue * 0.3)}, ${blue})`;
        
        const x = i * 20;
        const y = drops[i] * 20;
        
        ctx.fillText(char, x, y);
        
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [matrixRunning]);

  // ==================== AUTHENTIFICATION ====================
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
      navigate('/admin');
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
    { value: '1200+', label: 'Livraisons actives', icon: <TruckIcon className="h-8 w-8 text-cyan-400" /> },
    { value: '350+', label: 'Délégués médicaux', icon: <UserGroupIcon className="h-8 w-8 text-cyan-400" /> },
    { value: '800+', label: 'Centres de santé', icon: <BuildingOfficeIcon className="h-8 w-8 text-cyan-400" /> },
  ];

  // ==================== ÉTAPE 2 : VÉRIFICATION DU CODE ====================
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Bouton retour */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 z-20 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/20"
          data-aos="fade-right"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="text-sm font-medium">Retour à l'accueil</span>
        </Link>

        <div className="relative z-10 max-w-md w-full space-y-8 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10" data-aos="fade-up" data-aos-delay="100">
          <div className="text-center" data-aos="fade-down" data-aos-delay="200">
            <img src={logo} alt="Dispatch Pharma" className="mx-auto h-16 w-auto brightness-0 invert" />
            <h2 className="mt-6 text-3xl font-bold text-white">Code de vérification</h2>
            <p className="mt-2 text-cyan-300">
              Un code à 6 chiffres a été envoyé à <br />
              <strong className="text-white">{email}</strong>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            <div data-aos="fade-up" data-aos-delay="300">
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Code à 6 chiffres
              </label>
              <div className="flex gap-2 justify-center">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={code[index] || ''}
                    onChange={(e) => {
                      const newCode = code.split('');
                      newCode[index] = e.target.value.replace(/\D/g, '');
                      setCode(newCode.join(''));
                      if (e.target.value && index < 5) {
                        const nextInput = document.querySelector(`input[name="code-${index + 1}"]`);
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !code[index] && index > 0) {
                        const prevInput = document.querySelector(`input[name="code-${index - 1}"]`);
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    name={`code-${index}`}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-cyan-500/30 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              data-aos="fade-up" data-aos-delay="400"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Vérification...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>

            <div className="text-center" data-aos="fade-up" data-aos-delay="500">
              {countdown > 0 ? (
                <p className="text-cyan-300 text-sm">
                  Renvoyer dans <span className="font-bold text-white">{formatTime(countdown)}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Renvoyer le code
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==================== ÉTAPE 1 : CONNEXION ====================
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Bouton retour */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/20"
        data-aos="fade-right"
        data-aos-duration="600"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Retour à l'accueil</span>
      </Link>

      <div className="relative z-10 flex min-h-screen">
        {/* Colonne de gauche - Présentation */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative" data-aos="fade-right" data-aos-duration="800">
          <div>
            <div className="flex items-center gap-2 mb-12" data-aos="fade-down" data-aos-delay="100">
              <img src={logo} alt="Dispatch Pharma" className="h-12 w-auto brightness-0 invert" />
              <span className="font-bold text-2xl">
                <span style={{ color: '#ffffff' }}>DISPATCH</span>{' '}
                <span style={{ color: '#44ac40' }}>PHARMA</span>
              </span>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent" data-aos="fade-up" data-aos-delay="200">
              La plateforme qui révolutionne la distribution médicale
            </h1>
            <p className="text-cyan-200 text-lg mb-12" data-aos="fade-up" data-aos-delay="300">
              Connectez les équipes médicales, centres de santé et livreurs sur une plateforme sécurisée.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center" data-aos="fade-up" data-aos-delay={400 + idx * 100}>
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-cyan-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-cyan-300" data-aos="fade-up" data-aos-delay="700">
            <ShieldCheckIcon className="h-5 w-5" />
            <span className="text-sm">Plateforme certifiée & sécurisée</span>
          </div>
        </div>

        {/* Colonne de droite - Formulaire */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10" data-aos="fade-left" data-aos-duration="800" data-aos-delay="100">
            <div className="text-center lg:hidden" data-aos="fade-down" data-aos-delay="200">
              <img src={logo} alt="Dispatch Pharma" className="mx-auto h-12 w-auto brightness-0 invert" />
              <h2 className="mt-6 text-3xl font-bold text-white">DISPATCH PHARMA</h2>
            </div>

            <div className="hidden lg:block" data-aos="fade-down" data-aos-delay="200">
              <h2 className="text-2xl font-bold text-white">Connexion</h2>
              <p className="text-cyan-300 mt-1">Accédez à votre espace sécurisé</p>
            </div>

            <div className="lg:hidden text-center mb-8" data-aos="fade-down" data-aos-delay="150">
              <p className="text-cyan-300">Accédez à votre espace sécurisé</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin} autoComplete="off">
              <div data-aos="fade-up" data-aos-delay="300">
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  Adresse email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="superadmin@dispatchpharma.com"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="400">
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white/10 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                data-aos="fade-up" data-aos-delay="500"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Connexion en cours...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            <div className="text-center text-xs text-cyan-400/60 mt-8" data-aos="fade-up" data-aos-delay="600">
              <p>Accès réservé aux membres autorisés de DISPATCH PHARMA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;