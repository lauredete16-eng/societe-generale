import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Smartphone, Eye, EyeOff, CheckCircle, AlertTriangle, Key, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SecuritePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [securiteOptions, setSecuriteOptions] = useState({
    authentification2FA: false,
    notificationConnexion: true,
    biometrie: false,
    verrouillageAuto: true
  });

  const dernieresConnexions = [
    { id: 1, date: '2026-01-08 10:30', appareil: 'iPhone 13', lieu: 'Paris, France', statut: 'success' },
    { id: 2, date: '2026-01-07 18:45', appareil: 'Chrome Windows', lieu: 'Paris, France', statut: 'success' },
    { id: 3, date: '2026-01-06 09:15', appareil: 'Safari iPad', lieu: 'Lyon, France', statut: 'success' }
  ];

  const handleToggle = (option) => {
    setSecuriteOptions({
      ...securiteOptions,
      [option]: !securiteOptions[option]
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordForm.new.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    alert('Mot de passe changé avec succès !');
    setShowChangePassword(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const niveauSecurite = () => {
    let score = 0;
    if (securiteOptions.authentification2FA) score += 30;
    if (securiteOptions.notificationConnexion) score += 20;
    if (securiteOptions.biometrie) score += 30;
    if (securiteOptions.verrouillageAuto) score += 20;
    
    if (score >= 80) return { niveau: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 50) return { niveau: 'Bon', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    return { niveau: 'À améliorer', color: 'text-orange-600', bgColor: 'bg-orange-100' };
  };

  const securityStatus = niveauSecurite();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/compte')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1">Sécurité</h1>
          <img 
            src="images/logo sg.jpg" 
            alt="SG" 
            className="h-10 object-contain"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        {/* Niveau de sécurité */}
        <div className={`${securityStatus.bgColor} border-2 ${securityStatus.color.replace('text', 'border')} rounded-lg p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={32} className={securityStatus.color} />
              <div>
                <p className="text-sm text-gray-600">Niveau de sécurité</p>
                <p className={`text-2xl font-bold ${securityStatus.color}`}>{securityStatus.niveau}</p>
              </div>
            </div>
            <CheckCircle size={40} className={securityStatus.color} />
          </div>
        </div>

        {/* Mot de passe */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock size={24} className="text-red-600" />
            <h2 className="text-lg font-bold">Mot de passe</h2>
          </div>

          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Changer mon mot de passe
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  minLength="8"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  minLength="8"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Valider
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Options de sécurité */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Key size={24} className="text-red-600" />
            <h2 className="text-lg font-bold">Options de sécurité</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Authentification à deux facteurs</p>
                  <p className="text-xs text-gray-500">Sécurité renforcée avec code SMS</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={securiteOptions.authentification2FA}
                  onChange={() => handleToggle('authentification2FA')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all">
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${securiteOptions.authentification2FA ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Notifications de connexion</p>
                  <p className="text-xs text-gray-500">Alertes pour nouvelles connexions</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={securiteOptions.notificationConnexion}
                  onChange={() => handleToggle('notificationConnexion')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all">
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${securiteOptions.notificationConnexion ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Authentification biométrique</p>
                  <p className="text-xs text-gray-500">Face ID / Touch ID</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={securiteOptions.biometrie}
                  onChange={() => handleToggle('biometrie')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all">
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${securiteOptions.biometrie ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-gray-600" />
                <div>
                  <p className="font-semibold text-sm">Verrouillage automatique</p>
                  <p className="text-xs text-gray-500">Après 5 min d'inactivité</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={securiteOptions.verrouillageAuto}
                  onChange={() => handleToggle('verrouillageAuto')}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 transition-all">
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${securiteOptions.verrouillageAuto ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Dernières connexions */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <History size={24} className="text-red-600" />
            <h2 className="text-lg font-bold">Dernières connexions</h2>
          </div>

          <div className="space-y-3">
            {dernieresConnexions.map((connexion) => (
              <div key={connexion.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{connexion.appareil}</p>
                  <p className="text-xs text-gray-500">{connexion.lieu}</p>
                  <p className="text-xs text-gray-400 mt-1">{connexion.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}