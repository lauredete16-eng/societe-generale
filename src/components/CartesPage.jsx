import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  FileText,
  Edit,
  Lock,
} from "lucide-react";

export default function CartesPage({ currentUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [carteActive, setCarteActive] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header rouge */}
        <div className="w-full bg-red-600 pt-8 pb-12 text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white px-4">CB Gold Evolution</h1>
          <p className="text-white font-semibold mt-2">Compte n° •••• 9527</p>
          <p className="text-white mt-1">Débit immédiat</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <Loader2 size={64} className="text-gray-400 animate-spin mb-6" />
          <p className="text-gray-600 text-lg">Un instant ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header rouge */}
      <div className="w-full bg-red-600 pt-6 pb-24 sm:pb-32 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 px-4">CB Gold Evolution</h2>
        <p className="text-white font-semibold">Compte n° •••• 9527</p>
        <p className="text-white mt-1">Débit immédiat</p>
      </div>

      {/* Carte bancaire chevauche header et bg gris */}
      <div className="relative z-20 -mt-20 sm:-mt-28 max-w-sm mx-auto w-full px-4">
        <div
          className="rounded-xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden aspect-[1.586/1] bg-pink-900"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between py-1">
            {/* Header carte */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white rounded-sm flex flex-col overflow-hidden relative">
                  <div className="w-full flex-1 bg-red-600"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2 z-10"></div>
                  <div className="w-full flex-1 bg-black"></div>
                </div>
                <div className="text-xs sm:text-[15px] font-semibold text-gray-100 leading-tight tracking-wide">
                  <div>SOCIETE</div>
                  <div>GENERALE</div>
                </div>
              </div>

              {/* Logo CB */}
              <div
                 className="border-2 border-white rounded-sm px-1.5 py-0.5 sm:px-2 sm:py-1"
                 style={{ background: "rgba(92, 58, 94, 0.6)" }}
              >
                <div className="flex items-center gap-0" style={{ width: "24px", height: "14px" }}>
                  <svg width="24" height="14" viewBox="0 0 28 16" fill="none" className="w-full h-full">
                    {/* C blanc */}
                    <path 
                       d="M11 2 A6 6 0 1 0 11 14"
                       stroke="white" 
                       strokeWidth="8" 
                       fill="none" 
                    />
                    {/* Rectangles blancs */}
                    <rect x="15" y="1" width="12" height="6.5" rx="1.5" fill="white" />
                    <rect x="15" y="8.5" width="12" height="6.5" rx="1.5" fill="white" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Palette */}
            <div className="flex items-center gap-2 sm:gap-3 my-2">                          
              {/* Icône Palette avec pinceau */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[22px] sm:h-[22px]">
                  {/* Palette */}
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" stroke="#5c3a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Points de couleur sur la palette */}
                  <circle cx="7.5" cy="10" r="1" fill="#5c3a5e"/>
                  <circle cx="12" cy="7.5" r="1" fill="#5c3a5e"/>
                  <circle cx="16" cy="10" r="1" fill="#5c3a5e"/>
                  <circle cx="9.5" cy="13.5" r="1" fill="#5c3a5e"/>
                  {/* Pinceau */}
                  <path d="M18 4l2-2m0 0l1 1m-1-1l-3 3" stroke="#5c3a5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="19" y1="5" x2="16.5" y2="7.5" stroke="#5c3a5e" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Numéro de carte */}
            <div className="text-xs sm:text-base tracking-wider sm:tracking-widest font-mono mb-2">
              •••• •••• •••• {currentUser?.carte || "4298"}
            </div>

            {/* Bas de la carte - CORRIGÉ MOBILE */}
            <div className="flex justify-between items-end gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-sm font-semibold truncate uppercase">
                  {currentUser?.nom || "JEAN DUPONT"}
                </p>
              </div>
              
              <div className="text-center flex-shrink-0">
                <p className="text-[8px] sm:text-[10px] opacity-75 leading-none mb-0.5">EXP</p>
                <p className="text-[11px] sm:text-xs font-semibold leading-none">12/25</p>
              </div>
              
              <div className="flex-shrink-0">
                <span
                  className="text-base sm:text-xl font-black italic text-white block"
                  style={{ 
                    fontFamily: "sans-serif", 
                    letterSpacing: "-0.02em",
                    lineHeight: "1"
                  }}
                >
                  VISA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reste du contenu */}
      <div className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
        {/* Boutons Verrouiller / Faire opposition */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 mb-6">
          <button className="flex items-center justify-center gap-2 bg-white text-red-600 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100 transition">
            <Lock size={18} /> Verrouiller
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-red-600 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100 transition">
            <ChevronRight size={18} /> Faire opposition
          </button>
        </div>

        {/* Gérer mes plafonds */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Gérer mes plafonds</h2>
          <div className="mb-6">
            <div className="mb-1">
              <span className="text-xs sm:text-sm text-gray-900 font-semibold">Plafond de paiement mensuel <span className="text-[10px] sm:text-xs text-gray-500 font-normal">(jusqu'au 30/04/2026)</span></span>
            </div>
            <div className="flex justify-end mb-3">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">300000,00 €</p>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-green-600 font-semibold">Utilisé : 25043,15 €</span>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center cursor-help" title="Montant utilisé ce mois">
                    <span className="text-gray-400 text-xs font-bold">i</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '8.3%' }}></div>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-700 font-semibold">Restant : 274956,85 €</span>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center cursor-help" title="Montant restant disponible">
                    <span className="text-gray-400 text-xs font-bold">i</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <Edit size={18} />
              <span className="font-semibold underline text-sm sm:text-base">Augmenter</span>
            </button>
          </div>

          <div className="border-t pt-6">
            <div className="mb-3">
              <h3 className="text-xs sm:text-sm text-gray-900 font-semibold mb-1">Capacité de retrait (France et étranger)</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">sur 7 jours glissants</p>
            </div>
            <div className="flex justify-end mb-3">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">50000,00 €</p>
            </div>
            <div className="text-xs sm:text-sm text-gray-700 mb-3">
              <p className="mb-1"><strong>Dont :</strong></p>
              <p className="mb-1">- 20700,00 € par jour aux distributeurs Société Générale et Crédit du Nord, en France</p>
              <p>- 12000,00 € sur 7 jours glissants aux distributeurs des autres banques en France</p>
            </div>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <Edit size={18} />
              <span className="font-semibold underline text-sm sm:text-base">Modifier</span>
            </button>
          </div>
        </div>

        {/* Vos options */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <button
            onClick={() => setOptionsOpen(!optionsOpen)}
            className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Vos options</h2>
            {optionsOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          {optionsOpen && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 my-4 text-center">Mes options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base text-gray-900 font-medium">Option e-Carte Bleue</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Actif/Désactiver */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${carteActive ? "bg-green-500" : "bg-gray-400"}`}></div>
            <span className="font-semibold text-sm sm:text-base text-gray-900">{carteActive ? "Actif" : "Inactif"}</span>
          </div>
          <button
            onClick={() => setCarteActive(!carteActive)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <FileText size={20} />
            <span className="font-semibold text-sm sm:text-base">{carteActive ? "Désactiver" : "Activer"}</span>
          </button>
        </div>

        {/* Sections Consulter code secret, Paramétrer carte, Déclarer voyage et Liens utiles */}
        <div className="space-y-4">
          <button className="w-full bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:bg-gray-50 transition text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Consulter mon code secret</h3>
              <ChevronRight size={24} className="text-gray-400 flex-shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Vous avez oublié le code secret de votre carte bancaire ? Consultez-le à l'abri des regards indiscrets.
            </p>
          </button>

          <button className="w-full bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:bg-gray-50 transition text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Paramétrer ma carte</h3>
              <ChevronRight size={24} className="text-gray-400 flex-shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Achats en ligne, retraits ou opérations à l'étranger ne vous servent pas ? Ajustez-les à votre usage.
            </p>
          </button>

          <button className="w-full bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:bg-gray-50 transition text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Déclarer un voyage à l'étranger</h3>
              <ChevronRight size={24} className="text-gray-400 flex-shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Vous partez à l'étranger ? Dites-le nous pour éviter tout blocage de votre carte.
            </p>
          </button>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Liens utiles</h2>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 sm:gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <Star size={24} className="text-gray-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-900 font-medium flex-1 text-left">Mes avantages</span>
                <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
              </button>
              <button className="w-full flex items-center gap-3 sm:gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <Shield size={24} className="text-gray-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-900 font-medium flex-1 text-left">
                  Guide assurance et assistance
                </span>
                <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
              </button>
              <button className="w-full flex items-center gap-3 sm:gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                <FileText size={24} className="text-gray-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-900 font-medium flex-1 text-left">
                  Conditions générales de ma carte
                </span>
                <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}