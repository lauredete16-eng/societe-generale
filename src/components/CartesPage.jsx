import React, { useState, useEffect } from "react";
import { Loader2, ChevronRight, ChevronDown, ChevronUp, Star, Shield, FileText, Edit, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function CartesPage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [carteActive, setCarteActive] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const formatCardName = (fullName) => {
    if (!fullName) return "NOM UTILISATEUR";
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0].toUpperCase()} ${parts[1].toUpperCase()}`;
    }
    return fullName.toUpperCase();
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <div className="w-full bg-red-600 pt-6 pb-24 sm:pb-32 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 px-4">CB Gold Evolution</h2>
        <p className="text-white font-semibold">Compte n° •••• 9527</p>
        <p className="text-white mt-1">Débit immédiat</p>
      </div>

      {/* CARTE BANCAIRE */}
      <div className="relative z-20 -mt-20 sm:-mt-28 max-w-sm mx-auto w-full px-4 mb-6">
        <div className="relative rounded-xl shadow-2xl overflow-hidden aspect-[1.586/1]">
          {/* Image de fond de la carte */}
          <img 
            src="/images/logo carte.jpg" 
            alt="Carte bancaire"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Numéro de carte */}
          <div 
            className="font-mono absolute"
            style={{
              bottom: '25%',
              left: '6%',
              fontSize: '1.1rem',
              fontWeight: '500',
              color: '#FFFFFF',
              letterSpacing: '0.15em',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            •••• •••• •••• {currentUser?.carte}
          </div>

          {/* Date d'expiration */}
          <div
            className="absolute font-mono"
            style={{
              bottom: '5%',
              left: '65%',
              transform: 'translateX(-50%)',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#FFFFFF',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span style={{ fontSize: '0.5rem', letterSpacing: '0.1em' }}>EXP</span>
            <span>{currentUser?.exp}</span>
          </div>

          {/* Nom du titulaire */}
          <div
            className="uppercase absolute"
            style={{
              bottom: '12%',
              left: '6%',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#FFFFFF',
              letterSpacing: '0.05em',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {formatCardName(currentUser?.nom)}
          </div>
        </div>
      </div>

      {/* RESTE DU CONTENU */}
      <div className="flex-1 px-4 py-2 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 bg-white text-red-600 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100 transition">
            <Lock size={18} /> Verrouiller
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-red-600 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100 transition">
            <ChevronRight size={18} /> Faire opposition
          </button>
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Gérer mes plafonds</h2>
          <div className="mb-6">
            <div className="mb-1">
              <span className="text-xs sm:text-sm text-gray-900 font-semibold">
                Plafond de paiement mensuel <span className="text-[10px] sm:text-xs text-gray-500 font-normal">(jusqu'au 30/04/2026)</span>
              </span>
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

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <button onClick={() => setOptionsOpen(!optionsOpen)} className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 transition">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Vos options</h2>
            {optionsOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          {optionsOpen && (
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 my-4 text-center">Mes options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <span className="text-sm sm:text-base text-gray-900 font-medium">Option e-Carte Bleue</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${carteActive ? "bg-green-500" : "bg-gray-400"}`}></div>
            <span className="font-semibold text-sm sm:text-base text-gray-900">{carteActive ? "Actif" : "Inactif"}</span>
          </div>
          <button onClick={() => setCarteActive(!carteActive)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <FileText size={20} />
            <span className="font-semibold text-sm sm:text-base">{carteActive ? "Désactiver" : "Activer"}</span>
          </button>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:bg-gray-50 transition text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Consulter mon code secret</h3>
              <ChevronRight size={24} className="text-gray-400" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Vous avez oublié le code secret de votre carte bancaire ? Consultez-le à l'abri des regards indiscrets.
            </p>
          </button>

          <button className="w-full bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:bg-gray-50 transition text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Paramétrer ma carte</h3>
              <ChevronRight size={24} className="text-gray-400" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Achats en ligne, retraits ou opérations à l'étranger ne vous servent pas ? Ajustez-les à votre usage.
            </p>
          </button>

          <button className="w-full bg-white rounded-lg p-4 sm:p-5 shadow-sm hover:bg-gray-50 transition text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Déclarer un voyage à l'étranger</h3>
              <ChevronRight size={24} className="text-gray-400" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Vous partez à l'étranger ? Dites-le nous pour éviter tout blocage de votre carte.
            </p>
          </button>

          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Liens utiles</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-gray-900 text-sm sm:text-base">
                <Shield size={20} /> Services Sécurité
              </button>
              <button className="w-full flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-gray-900 text-sm sm:text-base">
                <Star size={20} /> Vos avantages
              </button>
              <button className="w-full flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-gray-900 text-sm sm:text-base">
                <FileText size={20} /> Conditions générales d'utilisation
              </button>
              <button className="w-full flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-gray-900 text-sm sm:text-base">
                <ChevronRight size={20} /> Assurances et garanties de ma carte
              </button>
              <button className="w-full flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-gray-900 text-sm sm:text-base">
                <Shield size={20} /> Conseils de sécurité bancaire
              </button>
              <button className="w-full flex items-center gap-3 sm:gap-4 text-gray-700 hover:text-gray-900 text-sm sm:text-base">
                <Star size={20} /> Programme de fidélité et récompenses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}