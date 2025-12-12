import React, { useState } from "react";
import { ArrowLeft, Banknote, AlertCircle, TrendingUp, Info } from "lucide-react";

export default function ModifierRetraitPage({
  navigateTo,
  nouveauRetrait,
  setNouveauRetrait,
  confirmerRetrait,
  currentUser
}) {
  const [showInfo, setShowInfo] = useState(false);
  
  // Plafonds de retrait prédéfinis
  const plafondsRetrait = [
    { montant: 300, label: "300 €/jour" },
    { montant: 500, label: "500 €/jour" },
    { montant: 800, label: "800 €/jour" },
    { montant: 1000, label: "1 000 €/jour" },
    { montant: 1500, label: "1 500 €/jour" },
    { montant: 2000, label: "2 000 €/jour" }
  ];

  const handleMontantClick = (montant) => {
    setNouveauRetrait(montant.toString());
  };

  const handleCustomInput = (value) => {
    // Accepter seulement les chiffres
    if (/^\d*$/.test(value)) {
      setNouveauRetrait(value);
    }
  };

  const isValid = nouveauRetrait && parseFloat(nouveauRetrait) >= 100 && parseFloat(nouveauRetrait) <= 3000;

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
          <h1 className="text-2xl font-bold text-white ml-4">Modifier capacité de retrait</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Info actuelle */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Banknote className="text-red-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Capacité actuelle</p>
                <p className="text-2xl font-bold text-gray-800">1 000 €</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Info size={20} className="text-gray-600" />
            </button>
          </div>
          <p className="text-xs text-gray-500">Par jour aux distributeurs automatiques</p>
        </div>

        {/* Info supplémentaire */}
        {showInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-fadeIn">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Info size={18} className="mr-2" />
              À propos de la capacité de retrait
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Limite quotidienne aux distributeurs (DAB/GAB)</li>
              <li>• Renouvellement chaque jour à minuit</li>
              <li>• Modification immédiate après validation</li>
              <li>• Protection contre les retraits frauduleux</li>
            </ul>
          </div>
        )}

        {/* Montants prédéfinis */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Choisir un montant
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {plafondsRetrait.map((plafond) => (
              <button
                key={plafond.montant}
                onClick={() => handleMontantClick(plafond.montant)}
                className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                  nouveauRetrait === plafond.montant.toString()
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                }`}
              >
                {plafond.label}
              </button>
            ))}
          </div>
        </div>

        {/* Montant personnalisé */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Ou saisissez un montant personnalisé
          </h2>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={nouveauRetrait}
              onChange={(e) => handleCustomInput(e.target.value)}
              placeholder="Montant en euros"
              className="w-full px-4 py-4 pr-12 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">
              €
            </span>
          </div>
          
          {/* Validation messages */}
          {nouveauRetrait && parseFloat(nouveauRetrait) < 100 && (
            <div className="flex items-start mt-3 text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>Le montant minimum est de 100 €</span>
            </div>
          )}
          
          {nouveauRetrait && parseFloat(nouveauRetrait) > 3000 && (
            <div className="flex items-start mt-3 text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>Le montant maximum est de 3 000 €</span>
            </div>
          )}

          {/* Limites */}
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Min: 100 €</span>
            <span>Max: 3 000 €</span>
          </div>
        </div>

        {/* Conseil */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <TrendingUp className="text-green-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Conseil sécurité</h3>
              <p className="text-sm text-green-800">
                Adaptez votre capacité de retrait à vos besoins réels. Un montant trop élevé 
                augmente les risques en cas de perte ou vol de votre carte.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de confirmation */}
        <button
          onClick={confirmerRetrait}
          disabled={!isValid}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
            isValid
              ? 'bg-red-600 hover:bg-red-700 active:scale-95'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isValid 
            ? `Confirmer ${nouveauRetrait} € / jour`
            : 'Saisissez un montant valide'
          }
        </button>

        {/* Note légale */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 text-center">
            ⚠️ Cette modification prend effet immédiatement et reste valable jusqu'à 
            votre prochaine modification. Vous pouvez la modifier à tout moment.
          </p>
        </div>
      </div>
    </div>
  );
}