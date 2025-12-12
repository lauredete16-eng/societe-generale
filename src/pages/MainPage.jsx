import React from "react";
import { ChevronRight, ChevronDown, ChevronUp, Star, Shield, FileText, Edit, Lock, X, AlertCircle, Download } from "lucide-react";

// Fonction pour formater le nom sur la carte
const formatCardName = (nom) => {
  if (!nom) return "";
  return nom.toUpperCase().trim();
};

export default function MainPage({ 
  currentUser, 
  navigateTo, 
  optionsOpen,
  setOptionsOpen,
  handleVerrouiller,
  handleOpposition,
  showVerrouillerModal,
  setShowVerrouillerModal,
  confirmerVerrouillage,
  showOppositionModal,
  setShowOppositionModal,
  handleLienUtile,
  downloadDocument
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="w-full bg-red-600 pt-8 pb-12 text-center relative z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white px-4">CB Gold Evolution</h1>
        <p className="text-white font-semibold mt-2">Compte n° •••• {currentUser?.carte}</p>
        <p className="text-white mt-1">Débit immédiat</p>
      </div>

      {/* Virtual Card */}
      <div className="max-w-md mx-auto px-4 -mt-10 mb-8 relative z-20">
        <div className="rounded-2xl shadow-2xl overflow-hidden relative">
          <img 
            src="images/logo carte.jpg" 
            alt="Carte bancaire" 
            className="w-full h-auto rounded-2xl"
          />
          
          {/* Overlay pour afficher les informations dynamiques de l'utilisateur */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            {/* Informations en bas de la carte */}
            <div>
              {/* Numéro de carte - décalé vers la droite et un peu plus haut */}
              <div className="mb-4 flex justify-end pr-16">
                <p className="text-base sm:text-lg font-mono tracking-widest" 
                   style={{textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>
                  {currentUser?.numeroComplet || '•••• •••• •••• ••••'}
                </p>
              </div>
              
              {/* Titulaire et Date d'expiration */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-90 mb-1" 
                     style={{textShadow: '0 2px 6px rgba(0,0,0,0.9)'}}>
                    TITULAIRE
                  </p>
                  <p className="text-sm font-semibold tracking-wide" 
                     style={{textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>
                    {formatCardName(currentUser?.nom)}
                  </p>
                </div>
                <div className="text-center absolute left-1/2 transform -translate-x-1/2 bottom-6">
                  <p className="text-xs opacity-90 mb-1" 
                     style={{textShadow: '0 2px 6px rgba(0,0,0,0.9)'}}>
                    EXPIRE FIN
                  </p>
                  <p className="text-sm font-semibold" 
                     style={{textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>
                    {currentUser?.exp || 'MM/AA'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Actions rapides */}
      <div className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigateTo('code-secret')}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col items-center justify-center text-center"
          >
            <Shield className="text-red-600 mb-2" size={28} />
            <span className="text-sm font-semibold text-gray-900">Code secret</span>
          </button>
          
          <button 
            onClick={handleVerrouiller}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col items-center justify-center text-center"
          >
            <Lock className="text-red-600 mb-2" size={28} />
            <span className="text-sm font-semibold text-gray-900">Verrouiller</span>
          </button>
          
          <button 
            onClick={handleOpposition}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col items-center justify-center text-center"
          >
            <X className="text-red-600 mb-2" size={28} />
            <span className="text-sm font-semibold text-gray-900">Opposition</span>
          </button>
          
          <button 
            onClick={() => navigateTo('parametrer')}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col items-center justify-center text-center"
          >
            <Edit className="text-red-600 mb-2" size={28} />
            <span className="text-sm font-semibold text-gray-900">Paramétrer</span>
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-md mx-auto px-4 mb-8">
        <button 
          onClick={() => setOptionsOpen(!optionsOpen)}
          className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
        >
          <h2 className="text-lg font-bold text-gray-900">Gérer ma carte</h2>
          {optionsOpen ? <ChevronUp size={24} className="text-gray-600" /> : <ChevronDown size={24} className="text-gray-600" />}
        </button>

        {optionsOpen && (
          <div className="mt-3 bg-white rounded-xl shadow-sm overflow-hidden">
            <button 
              onClick={() => navigateTo('augmenter-plafond')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100"
            >
              <span className="text-gray-900 font-medium">Augmenter le plafond</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo('modifier-retrait')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100"
            >
              <span className="text-gray-900 font-medium">Modifier capacité de retrait</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo('declarer-voyage')}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span className="text-gray-900 font-medium">Déclarer un voyage</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Liens utiles */}
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Liens utiles</h2>
        <div className="space-y-3">
          <button 
            onClick={() => navigateTo('assurances')}
            className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <Star size={20} className="text-yellow-500" />
              <span className="text-gray-900 font-medium">Assurances et assistance</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          <button 
            onClick={() => navigateTo('conditions-tarifaires')}
            className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-blue-500" />
              <span className="text-gray-900 font-medium">Conditions tarifaires</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Modal Verrouiller */}
      {showVerrouillerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Verrouiller la carte</h3>
            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir verrouiller votre carte ? Vous ne pourrez plus effectuer de paiements ni de retraits jusqu'au déverrouillage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowVerrouillerModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Annuler
              </button>
              <button 
                onClick={confirmerVerrouillage}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Opposition */}
      {showOppositionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Faire opposition</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Attention :</strong> L'opposition est irréversible. Votre carte sera définitivement bloquée et une nouvelle carte vous sera envoyée.
              </p>
            </div>
            <p className="text-gray-700 mb-6">
              Pour faire opposition, veuillez contacter notre service client au :
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-2xl font-bold text-red-600">09 69 39 99 00</p>
              <p className="text-sm text-gray-600 mt-1">Disponible 24h/24, 7j/7</p>
            </div>
            <button 
              onClick={() => setShowOppositionModal(false)}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}