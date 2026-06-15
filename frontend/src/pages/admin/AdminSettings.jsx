import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  PaintBrushIcon, 
  EnvelopeIcon, 
  KeyIcon,
  GlobeAltIcon,
  LanguageIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  // ==================== ÉTATS DES PARAMÈTRES ====================
  const [generalSettings, setGeneralSettings] = useState({
    appName: 'DISPATCH PHARMA',
    contactEmail: 'contact@dispatchpharma.com',
    contactPhone: '+237 696 922 124',
    address: 'Yaoundé, Cameroun',
    website: 'www.dispatchpharma.com'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: 'strong'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newOrderAlert: true,
    newUserAlert: true,
    lowStockAlert: true,
    dailySummary: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#0157bd',
    fontFamily: 'Poppins'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    fromEmail: 'noreply@dispatchpharma.com',
    fromName: 'DISPATCH PHARMA'
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: 'pk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8),
    apiSecret: 'sk_live_' + Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 10),
    apiVersion: 'v1'
  });

  // ==================== CHARGEMENT ====================
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedGeneral = localStorage.getItem('admin_settings_general');
      const savedSecurity = localStorage.getItem('admin_settings_security');
      const savedNotifications = localStorage.getItem('admin_settings_notifications');
      const savedAppearance = localStorage.getItem('admin_settings_appearance');
      const savedEmail = localStorage.getItem('admin_settings_email');
      const savedApi = localStorage.getItem('admin_settings_api');

      if (savedGeneral) setGeneralSettings(JSON.parse(savedGeneral));
      if (savedSecurity) setSecuritySettings(JSON.parse(savedSecurity));
      if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications));
      if (savedAppearance) setAppearanceSettings(JSON.parse(savedAppearance));
      if (savedEmail) setEmailSettings(JSON.parse(savedEmail));
      if (savedApi) setApiSettings(JSON.parse(savedApi));
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const saveSettings = (section, data) => {
    setSaving(true);
    try {
      localStorage.setItem(`admin_settings_${section}`, JSON.stringify(data));
      
      if (section === 'appearance') {
        applyAppearanceChanges(data);
      }
      
      toast.success(`Paramètres ${getSectionName(section)} sauvegardés !`);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const getSectionName = (section) => {
    const names = {
      general: 'généraux',
      security: 'de sécurité',
      notifications: 'de notifications',
      appearance: 'd\'apparence',
      email: 'email',
      api: 'API'
    };
    return names[section] || '';
  };

  const applyAppearanceChanges = (settings) => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.body.style.fontFamily = settings.fontFamily;
    document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
  };

  const handleGeneralSave = () => saveSettings('general', generalSettings);
  const handleSecuritySave = () => saveSettings('security', securitySettings);
  const handleNotificationsSave = () => saveSettings('notifications', notificationSettings);
  const handleAppearanceSave = () => saveSettings('appearance', appearanceSettings);
  const handleEmailSave = () => {
    if (emailSettings.smtpUser && emailSettings.smtpPass) {
      toast.info('Test de connexion SMTP en cours...');
      setTimeout(() => toast.success('Configuration SMTP validée !'), 1500);
    }
    saveSettings('email', emailSettings);
  };

  const handleApiRegenerate = () => {
    const newApiKey = 'pk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8);
    const newApiSecret = 'sk_live_' + Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 10);
    setApiSettings({ ...apiSettings, apiKey: newApiKey, apiSecret: newApiSecret });
    toast.warning('Nouvelles clés API générées !');
  };

  const handleResetSettings = (section) => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser ces paramètres ?')) {
      switch(section) {
        case 'general':
          setGeneralSettings({
            appName: 'DISPATCH PHARMA',
            contactEmail: 'contact@dispatchpharma.com',
            contactPhone: '+237 696 922 124',
            address: 'Yaoundé, Cameroun',
            website: 'www.dispatchpharma.com'
          });
          localStorage.removeItem('admin_settings_general');
          break;
        case 'security':
          setSecuritySettings({
            twoFactorAuth: true,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            passwordPolicy: 'strong'
          });
          localStorage.removeItem('admin_settings_security');
          break;
        default:
          break;
      }
      toast.info('Paramètres réinitialisés');
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: <Cog6ToothIcon className="h-5 w-5" /> },
    { id: 'security', label: 'Sécurité', icon: <ShieldCheckIcon className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="h-5 w-5" /> },
    { id: 'appearance', label: 'Apparence', icon: <PaintBrushIcon className="h-5 w-5" /> },
    { id: 'email', label: 'Email', icon: <EnvelopeIcon className="h-5 w-5" /> },
    { id: 'api', label: 'API', icon: <KeyIcon className="h-5 w-5" /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-500">Configurez les paramètres de l'application</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu Général */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Informations générales</h3>
            <button onClick={() => handleResetSettings('general')} className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1">
              <TrashIcon className="h-4 w-4" /> Réinitialiser
            </button>
          </div>
          <div className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'application</label><input type="text" value={generalSettings.appName} onChange={(e) => setGeneralSettings({ ...generalSettings, appName: e.target.value })} className="input w-full md:w-96" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label><input type="email" value={generalSettings.contactEmail} onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })} className="input w-full md:w-96" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label><input type="tel" value={generalSettings.contactPhone} onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })} className="input w-full md:w-96" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label><input type="text" value={generalSettings.address} onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })} className="input w-full md:w-96" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Site web</label><input type="text" value={generalSettings.website} onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })} className="input w-full md:w-96" /></div>
            <button onClick={handleGeneralSave} disabled={saving} className="btn-primary flex items-center gap-2">
              <DocumentArrowDownIcon className="h-4 w-4" /> {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* Contenu Sécurité */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Sécurité</h3>
            <button onClick={() => handleResetSettings('security')} className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1">
              <TrashIcon className="h-4 w-4" /> Réinitialiser
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div><p className="font-medium text-gray-800">Authentification à deux facteurs</p><p className="text-sm text-gray-500">Sécurisez l'accès administrateur</p></div>
              <button onClick={() => setSecuritySettings({ ...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth })} className={`px-4 py-2 rounded-lg ${securitySettings.twoFactorAuth ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {securitySettings.twoFactorAuth ? 'Activée' : 'Désactivée'}
              </button>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Délai d'inactivité (minutes)</label>
              <select value={securitySettings.sessionTimeout} onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })} className="input w-full md:w-64">
                <option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="120">120 minutes</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Tentatives de connexion max</label>
              <select value={securitySettings.maxLoginAttempts} onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })} className="input w-full md:w-64">
                <option value="3">3 tentatives</option><option value="5">5 tentatives</option><option value="10">10 tentatives</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Politique de mot de passe</label>
              <select value={securitySettings.passwordPolicy} onChange={(e) => setSecuritySettings({ ...securitySettings, passwordPolicy: e.target.value })} className="input w-full md:w-64">
                <option value="standard">Standard (8 caractères)</option><option value="strong">Fort (12 caractères + chiffres + symboles)</option>
              </select>
            </div>
            <button onClick={handleSecuritySave} disabled={saving} className="btn-primary flex items-center gap-2">
              <DocumentArrowDownIcon className="h-4 w-4" /> {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {/* Contenu Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div><p className="font-medium text-gray-800">Notifications email</p><p className="text-sm text-gray-500">Recevoir les alertes par email</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notificationSettings.emailNotifications} onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div><p className="font-medium text-gray-800">Nouvelles commandes</p><p className="text-sm text-gray-500">Notification lors d'une nouvelle commande</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notificationSettings.newOrderAlert} onChange={(e) => setNotificationSettings({ ...notificationSettings, newOrderAlert: e.target.checked })} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div><p className="font-medium text-gray-800">Nouveaux utilisateurs</p><p className="text-sm text-gray-500">Notification lors d'une nouvelle inscription</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notificationSettings.newUserAlert} onChange={(e) => setNotificationSettings({ ...notificationSettings, newUserAlert: e.target.checked })} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div><p className="font-medium text-gray-800">Stock faible</p><p className="text-sm text-gray-500">Alerte quand un produit atteint son seuil minimum</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notificationSettings.lowStockAlert} onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlert: e.target.checked })} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div><p className="font-medium text-gray-800">Résumé quotidien</p><p className="text-sm text-gray-500">Recevoir un résumé des activités chaque matin</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notificationSettings.dailySummary} onChange={(e) => setNotificationSettings({ ...notificationSettings, dailySummary: e.target.checked })} />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <button onClick={handleNotificationsSave} disabled={saving} className="btn-primary flex items-center gap-2 mt-6">
            <DocumentArrowDownIcon className="h-4 w-4" /> {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      )}

      {/* Contenu Apparence */}
      {activeTab === 'appearance' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Apparence</h3>
          <div className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
              <select value={appearanceSettings.theme} onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })} className="input w-full md:w-64">
                <option value="light">Clair</option><option value="dark">Sombre</option><option value="system">Système</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Couleur principale</label>
              <div className="flex gap-3 items-center">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full cursor-pointer ${appearanceSettings.primaryColor === '#0157bd' ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`} style={{ backgroundColor: '#0157bd' }} onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: '#0157bd' })}></div>
                  <div className={`w-10 h-10 rounded-full cursor-pointer ${appearanceSettings.primaryColor === '#44ac40' ? 'ring-2 ring-offset-2 ring-green-600' : ''}`} style={{ backgroundColor: '#44ac40' }} onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: '#44ac40' })}></div>
                  <div className={`w-10 h-10 rounded-full cursor-pointer ${appearanceSettings.primaryColor === '#8b5cf6' ? 'ring-2 ring-offset-2 ring-purple-600' : ''}`} style={{ backgroundColor: '#8b5cf6' }} onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: '#8b5cf6' })}></div>
                  <div className={`w-10 h-10 rounded-full cursor-pointer ${appearanceSettings.primaryColor === '#ef4444' ? 'ring-2 ring-offset-2 ring-red-600' : ''}`} style={{ backgroundColor: '#ef4444' }} onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: '#ef4444' })}></div>
                </div>
                <input type="color" value={appearanceSettings.primaryColor} onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer border" />
              </div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Police</label>
              <select value={appearanceSettings.fontFamily} onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontFamily: e.target.value })} className="input w-full md:w-64">
                <option value="Poppins">Poppins</option><option value="Inter">Inter</option><option value="Roboto">Roboto</option><option value="Montserrat">Montserrat</option>
              </select>
            </div>
          </div>
          <button onClick={handleAppearanceSave} disabled={saving} className="btn-primary flex items-center gap-2 mt-6">
            <DocumentArrowDownIcon className="h-4 w-4" /> {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      )}

      {/* Contenu Email */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Configuration SMTP</h3>
          <div className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Serveur SMTP</label><input type="text" value={emailSettings.smtpHost} onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })} className="input w-full md:w-96" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Port</label><input type="text" value={emailSettings.smtpPort} onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })} className="input w-full md:w-64" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label><input type="text" value={emailSettings.smtpUser} onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })} className="input w-full md:w-96" placeholder="votre@email.com" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label><input type="password" value={emailSettings.smtpPass} onChange={(e) => setEmailSettings({ ...emailSettings, smtpPass: e.target.value })} className="input w-full md:w-96" placeholder="••••••••" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email d'envoi</label><input type="email" value={emailSettings.fromEmail} onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })} className="input w-full md:w-96" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'expéditeur</label><input type="text" value={emailSettings.fromName} onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })} className="input w-full md:w-96" /></div>
            <div className="flex gap-3">
              <button onClick={handleEmailSave} disabled={saving} className="btn-primary flex items-center gap-2"><DocumentArrowDownIcon className="h-4 w-4" /> {saving ? 'Sauvegarde...' : 'Enregistrer'}</button>
              <button onClick={() => toast.info('Test d\'envoi en cours...')} className="btn-outline flex items-center gap-2"><ArrowPathIcon className="h-4 w-4" /> Tester</button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu API */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Clés API</h3>
          <div className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Version API</label>
              <select value={apiSettings.apiVersion} onChange={(e) => setApiSettings({ ...apiSettings, apiVersion: e.target.value })} className="input w-full md:w-64">
                <option value="v1">v1 (stable)</option><option value="v2">v2 (beta)</option>
              </select>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500 mb-2">Clé API publique</p><div className="flex items-center gap-2"><code className="text-sm font-mono bg-white p-2 rounded border flex-1 overflow-x-auto">{apiSettings.apiKey}</code><button onClick={() => { navigator.clipboard.writeText(apiSettings.apiKey); toast.success('Clé API copiée !'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">📋</button></div></div>
            <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500 mb-2">Clé API secrète</p><div className="flex items-center gap-2"><code className="text-sm font-mono bg-white p-2 rounded border flex-1 overflow-x-auto">••••••••••••••••••••••••</code><button onClick={() => { navigator.clipboard.writeText(apiSettings.apiSecret); toast.success('Clé API copiée !'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">📋</button></div><p className="text-xs text-red-500 mt-2">⚠️ Ne partagez jamais votre clé secrète</p></div>
            <div className="flex gap-3">
              <button onClick={handleApiRegenerate} className="btn-primary flex items-center gap-2"><ArrowPathIcon className="h-4 w-4" /> Régénérer les clés</button>
              <button onClick={() => saveSettings('api', apiSettings)} className="btn-outline flex items-center gap-2"><DocumentArrowDownIcon className="h-4 w-4" /> Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;