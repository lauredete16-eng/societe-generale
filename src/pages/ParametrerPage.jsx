import React, { useState } from "react";
import { 
  ArrowLeft, 
  CreditCard, 
  ShoppingCart, 
  Wifi, 
  Globe, 
  Shield,
  Smartphone,
  Check,
  X
} from "lucide-react";

export default function ParametrerPage({ navigateTo, currentUser }) {
  const [parametres, setParametres] = useState({
    paiementSansContact: true,
    paiementInternet: true,
    paiementEtranger: false,
    paiementMobile: true,
    notificationsPush: true,
    securite3D: true
  });

  const handleToggle = (param) => {
    setParametres(prev => ({
      ...prev,
      [param]: !prev[param]
    }));
  };

  const sauvegarderParametres = () => {
    alert("Paramètres enregistrés avec succès !");
    navigateTo('main');
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
        enabled ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const ParametreItem = ({ icon: Icon, titre, description, paramKey, badge }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <div className={`p-2 rounded-lg mr-3 ${
            parametres[paramKey] ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <Icon size={20} className={
              parametres[paramKey] ? 'text-red-600' : 'text-gray-400'
            } />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-800">{titre}</h3>
              {badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        <ToggleSwitch 
          enabled={parametres[paramKey]} 
          onToggle={() => handleToggle(paramKey)}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="w-full bg-red-600 pt-8 pb-6 px-4">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigateTo('main')}
            className="text-white hover:bg-red-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">Paramétrer ma carte</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center mb-2">
            <CreditCard className="text-red-600 mr-3" size={24} />
            <div>
              <p className="font-semibold text-gray-800">{currentUser.nom}</p>
              <p className="text-sm text-gray-600">Carte •••• {currentUser.carte}</p>
            </div>
          </div>
        </div>

        {/* Section Paiements */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 px-2">
            Types de paiement
          </h2>
          
          <ParametreItem
            icon={Wifi}
            titre="Paiement sans contact"
            description="Autoriser les paiements par approche de la carte"
            paramKey="paiementSansContact"
          />

          <ParametreItem
            icon={ShoppingCart}
            titre="Paiement sur Internet"
            description="Autoriser les achats en ligne"
            paramKey="paiementInternet"
          />

          <ParametreItem
            icon={Globe}
            titre="Paiement à l'étranger"
            description="Autoriser les transactions hors France"
            paramKey="paiementEtranger"
            badge="Zone Euro"
          />

          <ParametreItem
            icon={Smartphone}
            titre="Paiement mobile"
            description="Apple Pay, Google Pay, Samsung Pay"
            paramKey="paiementMobile"
          />
        </div>

        {/* Section Sécurité */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 px-2">
            Sécurité et notifications
          </h2>

          <ParametreItem
            icon={Shield}
            titre="Authentification 3D Secure"
            description="Validation par SMS ou application"
            paramKey="securite3D"
            badge="Recommandé"
          />

          <ParametreItem
            icon={Smartphone}
            titre="Notifications push"
            description="Alertes instantanées sur vos transactions"
            paramKey="notificationsPush"
          />
        </div>

        {/* Résumé des paramètres */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Shield size={18} className="mr-2" />
            Résumé de votre configuration
          </h3>
          <div className="space-y-1">
            {Object.entries(parametres).map(([key, value]) => (
              <div key={key} className="flex items-center text-sm">
                {value ? (
                  <Check size={16} className="text-green-600 mr-2" />
                ) : (
                  <X size={16} className="text-red-600 mr-2" />
                )}
                <span className={value ? "text-blue-800" : "text-gray-600"}>
                  {key === 'paiementSansContact' && 'Paiement sans contact'}
                  {key === 'paiementInternet' && 'Paiement sur Internet'}
                  {key === 'paiementEtranger' && 'Paiement à l\'étranger'}
                  {key === 'paiementMobile' && 'Paiement mobile'}
                  {key === 'notificationsPush' && 'Notifications push'}
                  {key === 'securite3D' && 'Authentification 3D Secure'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          <button
            onClick={sauvegarderParametres}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all active:scale-95"
          >
            Enregistrer les modifications
          </button>

          <button
            onClick={() => navigateTo('main')}
            className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
          >
            Annuler
          </button>
        </div>

        {/* Note de sécurité */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-800">
            ⚠️ <strong>Important :</strong> Désactiver certaines protections peut augmenter 
            les risques de fraude. Nous recommandons de garder l'authentification 3D Secure activée.
          </p>
        </div>
      </div>
    </div>
  );
}