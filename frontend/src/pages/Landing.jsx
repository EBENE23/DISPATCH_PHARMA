import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import des icônes Heroicons
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { TruckIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

// Import du logo et de l'image de fond
import logo from '../assets/images/logos/dispatch-logo.png';
import doctorBackground from '../assets/images/avatars/avatar-doctor.jpg';

// Import des images produits
import immunobioImg from '../assets/images/products/immunobio.webp';
import hepacareImg from '../assets/images/products/hepacare.jpeg';
import neuroplusImg from '../assets/images/products/neuroplus.jpg';
import cardiostabImg from '../assets/images/products/cardiostab.jpeg';
import immunoboostImg from '../assets/images/products/immunoboost.webp';
import bioferImg from '../assets/images/products/immunoboost.webp';

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <ShoppingBagIcon className="h-8 w-8 text-primary-500" />,
      title: 'Catalogue produits',
      description: 'Accédez à une gamme complète de produits biopharmaceutiques certifiés'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-500" />,
      title: 'Communication directe',
      description: 'Chat intégré pour échanger en temps réel avec les médecins'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-primary-500" />,
      title: 'Statistiques avancées',
      description: 'Suivez vos performances avec des graphiques et indicateurs clés'
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-primary-500" />,
      title: 'Assistant IA',
      description: 'Prédictions et recommandations intelligentes pour optimiser vos visites'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-500" />,
      title: 'Sécurisé',
      description: 'Authentification à deux facteurs pour protéger vos données'
    },
    {
      icon: <TruckIcon className="h-8 w-8 text-primary-500" />,
      title: 'Livraison rapide',
      description: 'Suivi en temps réel de vos commandes'
    }
  ];

  const stats = [
    { value: '500+', label: 'Médecins partenaires' },
    { value: '50+', label: 'Produits disponibles' },
    { value: '1000+', label: 'Commandes traitées' },
    { value: '98%', label: 'Satisfaction client' }
  ];

  const navItems = [
    { label: 'Accueil', onClick: () => scrollToSection('hero'), icon: <ShoppingBagIcon className="h-5 w-5" /> },
    { label: 'Nos produits', onClick: () => scrollToSection('products'), icon: <ShoppingBagIcon className="h-5 w-5" /> },
    { label: 'Fonctionnalités', onClick: () => scrollToSection('features'), icon: <SparklesIcon className="h-5 w-5" /> },
    { label: 'Documentation', onClick: () => scrollToSection('documentation'), icon: <DocumentTextIcon className="h-5 w-5" /> },
    { label: 'En savoir plus', onClick: () => scrollToSection('about'), icon: <InformationCircleIcon className="h-5 w-5" /> },
    { label: 'Contact', onClick: () => scrollToSection('contact'), icon: <EnvelopeIcon className="h-5 w-5" /> },
  ];

  const products = [
    { name: 'ImmunoBio', type: 'Immunostimulant', price: '125 000 FCFA', image: immunobioImg },
    { name: 'HepaCare', type: 'Hépatoprotecteur', price: '15 000 FCFA', image: hepacareImg },
    { name: 'NeuroPlus', type: 'Neurotonique', price: '15 000 FCFA', image: neuroplusImg },
    { name: 'Biofer', type: 'Antianémique', price: '22 500 FCFA', image: bioferImg },
    { name: 'CardioStab', type: 'Antihypertenseur', price: '18 500 FCFA', image: cardiostabImg },
    { name: 'ImmunoBoost', type: 'Immunostimulant', price: '95 000 FCFA', image: immunoboostImg },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ==================== NAVIGATION AVEC MENU LATÉRAL ==================== */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <img src={logo} alt="Dispatch Pharma" className="h-12 w-auto" />
              <span className="font-bold text-2xl hidden md:inline">
                <span style={{ color: '#0157bd' }}>DISPATCH</span>{' '}
                <span style={{ color: '#44ac40' }}>PHARMA</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="text-gray-600 hover:text-primary-500 transition-colors flex items-center gap-1"
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary flex items-center gap-2"
              >
                Connexion
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay (fond sombre) - ferme le menu quand on clique dessus */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Menu latéral (drawer) qui sort de la droite */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* En-tête du menu */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Dispatch Pharma" className="h-8 w-auto" />
            <span className="font-bold text-sm">
              <span style={{ color: '#0157bd' }}>DISPATCH</span>{' '}
              <span style={{ color: '#44ac40' }}>PHARMA</span>
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation mobile */}
        <div className="flex flex-col p-4 space-y-2">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors w-full text-left"
            >
              <span className="text-gray-500">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-2 border-t">
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Connexion
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================== HERO SECTION (reste identique) ==================== */}
      <section id="hero" className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[550px] flex items-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${doctorBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(1px) brightness(0.65)',
            transform: 'scale(1.05)'
          }}
        />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-aos="fade-up">
            L'innovation au service des{' '}
            <span className="text-secondary-500">délégués médicaux</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10" data-aos="fade-up" data-aos-delay="200">
            Gérez vos commandes, communiquez avec vos médecins et optimisez vos tournées
            grâce à notre plateforme intelligente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="400">
            <button
              onClick={() => navigate('/login')}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-all text-lg flex items-center gap-2 justify-center shadow-lg"
            >
              Commencer
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-semibold py-3 px-8 rounded-lg transition-all text-lg border border-white/30"
            >
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* ==================== CARROUSEL PRODUITS PHARES ==================== */}
      <section id="products" className="py-20 px-4 bg-white overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos produits phares</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Une gamme complète de produits biopharmaceutiques de haute qualité</p>
          </div>
          <div className="relative" data-aos="fade-up" data-aos-delay="200">
            <div className="overflow-hidden">
              <div className="carousel-track flex gap-6 animate-scroll">
                {products.map((product, idx) => (
                  <div key={idx} className="carousel-card flex-shrink-0 w-64 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-4 text-center">
                    <div className="w-40 h-40 mx-auto mb-4 overflow-hidden rounded-lg">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.type}</p>
                    <p className="text-primary-600 font-bold mt-2">{product.price}</p>
                    <button onClick={() => navigate('/login')} className="mt-3 text-sm text-primary-500 hover:text-primary-600 font-medium">Voir le produit →</button>
                  </div>
                ))}
                {products.map((product, idx) => (
                  <div key={`dup-${idx}`} className="carousel-card flex-shrink-0 w-64 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-4 text-center">
                    <div className="w-40 h-40 mx-auto mb-4 overflow-hidden rounded-lg">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.type}</p>
                    <p className="text-primary-600 font-bold mt-2">{product.price}</p>
                    <button onClick={() => navigate('/login')} className="mt-3 text-sm text-primary-500 hover:text-primary-600 font-medium">Voir le produit →</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FONCTIONNALITÉS ==================== */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Une plateforme complète</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Tout ce dont vous avez besoin pour réussir vos visites médicales</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="card p-6 text-center hover:shadow-xl transition-all" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-50 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DOCUMENTATION ==================== */}
      <section id="documentation" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Documentation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Ressources pour vous accompagner dans l'utilisation de Dispatch Pharma</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center" data-aos="flip-left" data-aos-delay="0">
              <DocumentTextIcon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Guide d'utilisation</h3>
              <p className="text-gray-500 text-sm mb-4">Tout savoir sur l'application</p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">Télécharger →</button>
            </div>
            <div className="card p-6 text-center" data-aos="flip-left" data-aos-delay="150">
              <DocumentTextIcon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">FAQ</h3>
              <p className="text-gray-500 text-sm mb-4">Questions fréquentes</p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">Consulter →</button>
            </div>
            <div className="card p-6 text-center" data-aos="flip-left" data-aos-delay="300">
              <DocumentTextIcon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">API Documentation</h3>
              <p className="text-gray-500 text-sm mb-4">Pour les développeurs</p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">Explorer →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== À PROPOS ==================== */}
      <section id="about" className="py-20 px-4 bg-primary-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">En savoir plus sur Dispatch Pharma</h2>
              <p className="text-gray-600 mb-6">
                Dispatch Pharma est une plateforme innovante dédiée aux délégués médicaux.
                Nous facilitons la gestion des commandes, la communication avec les médecins
                et l'optimisation des tournées grâce à l'intelligence artificielle.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary-500" /><span>100% camerounais</span></div>
                <div className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary-500" /><span>Support client 7j/7</span></div>
                <div className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary-500" /><span>Mise à jour régulière</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg" data-aos="fade-left" data-aos-delay="200">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-2xl font-bold text-primary-500">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CONTACT AVEC GOOGLE MAPS ==================== */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
            <p className="text-lg text-gray-600">Une question ? Un projet ? N'hésitez pas à nous contacter</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div data-aos="fade-right">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input type="text" placeholder="Votre nom" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="Votre email" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" placeholder="Votre téléphone" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea placeholder="Votre message" rows="4" className="input"></textarea>
                </div>
                <button type="submit" className="btn-primary w-full">Envoyer le message</button>
              </form>
            </div>

            <div data-aos="fade-left" data-aos-delay="200">
              <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg mb-6">
                <iframe
                  title="Dispatch Pharma Location - Yaoundé"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1019183.5536278609!2d11.186645!3d3.848031!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcfc4f27b8b8b%3A0x5b8c9e5e5e5e5e5e!2sYaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-3 bg-primary-100 rounded-full"><EnvelopeIcon className="h-6 w-6 text-primary-500" /></div>
                  <div><p className="font-semibold text-gray-700">Email</p><a href="mailto:dispatchpharma@gmail.com" className="text-gray-600 hover:text-primary-500 transition-colors">dispatchpharma@gmail.com</a></div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-3 bg-primary-100 rounded-full"><PhoneIcon className="h-6 w-6 text-primary-500" /></div>
                  <div><p className="font-semibold text-gray-700">Téléphone</p><a href="tel:+237696922124" className="text-gray-600 hover:text-primary-500 transition-colors">+237 696 922 124</a></div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-3 bg-primary-100 rounded-full"><MapPinIcon className="h-6 w-6 text-primary-500" /></div>
                  <div><p className="font-semibold text-gray-700">Adresse</p><p className="text-gray-600">Yaoundé, Cameroun</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 px-4 bg-secondary-500" data-aos="zoom-in">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à optimiser vos visites médicales ?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Rejoignez Dispatch Pharma et découvrez comment la technologie peut booster votre efficacité.</p>
          <button onClick={() => navigate('/login')} className="bg-white text-secondary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all text-lg">Commencer maintenant</button>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4"><img src={logo} alt="Dispatch Pharma" className="h-10 w-auto" /><span className="font-bold text-xl text-white">DISPATCH PHARMA</span></div>
              <p className="text-sm mb-4">L'innovation au service des délégués médicaux. Une plateforme moderne et sécurisée pour la gestion des commandes biopharmaceutiques.</p>
              <div className="flex gap-3">
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg></a>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg></a>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('hero')} className="hover:text-primary-500 transition-colors">Accueil</button></li>
                <li><button onClick={() => scrollToSection('products')} className="hover:text-primary-500 transition-colors">Nos produits</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-primary-500 transition-colors">Fonctionnalités</button></li>
                <li><button onClick={() => scrollToSection('documentation')} className="hover:text-primary-500 transition-colors">Documentation</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-primary-500 transition-colors">À propos</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-primary-500 transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Informations</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-500 transition-colors">Conditions générales</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-primary-500 transition-colors">Cookies</a></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-primary-500 transition-colors">Connexion</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3"><EnvelopeIcon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" /><a href="mailto:dispatchpharma@gmail.com" className="hover:text-primary-500 transition-colors break-all">dispatchpharma@gmail.com</a></li>
                <li className="flex items-center gap-3"><PhoneIcon className="h-5 w-5 text-primary-500 flex-shrink-0" /><a href="tel:+237696922124" className="hover:text-primary-500 transition-colors">+237 696 922 124</a></li>
                <li className="flex items-start gap-3"><MapPinIcon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" /><span>Yaoundé, Cameroun</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p>&copy; 2025 DISPATCH PHARMA. Tous droits réservés.</p>
              <p className="text-gray-500">Développé avec ❤️ au Cameroun</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;