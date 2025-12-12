import React from "react";
import { ArrowLeft, Plane, Calendar, MapPin } from "lucide-react";

export default function DeclarerVoyagePage({
  navigateTo,
  voyageData,
  setVoyageData,
  confirmerVoyage
}) {
  const handleInputChange = (field, value) => {
    setVoyageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          <h1 className="text-2xl font-bold text-white ml-4">Déclarer un voyage</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Plane className="text-blue-600 mt-1 mr-3 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Pourquoi déclarer votre voyage ?
              </h3>
              <p className="text-sm text-blue-800">
                Déclarez vos voyages à l'étranger pour éviter le blocage de votre carte bancaire 
                lors de vos transactions. Votre sécurité est notre priorité.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Informations du voyage
          </h2>

          {/* Pays de destination */}
          <div className="mb-5">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin size={18} className="mr-2 text-red-600" />
              Pays de destination
            </label>
            <input
              type="text"
              value={voyageData.pays}
              onChange={(e) => handleInputChange('pays', e.target.value)}
              placeholder="Ex: Espagne, Italie, États-Unis..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Date de début */}
          <div className="mb-5">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar size={18} className="mr-2 text-red-600" />
              Date de début
            </label>
            <input
              type="date"
              value={voyageData.dateDebut}
              onChange={(e) => handleInputChange('dateDebut', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Date de fin */}
          <div className="mb-5">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar size={18} className="mr-2 text-red-600" />
              Date de fin
            </label>
            <input
              type="date"
              value={voyageData.dateFin}
              onChange={(e) => handleInputChange('dateFin', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Bouton de confirmation */}
        <button
          onClick={confirmerVoyage}
          disabled={!voyageData.pays || !voyageData.dateDebut || !voyageData.dateFin}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
            voyageData.pays && voyageData.dateDebut && voyageData.dateFin
              ? 'bg-red-600 hover:bg-red-700 active:scale-95'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Confirmer la déclaration
        </button>

        {/* Note de sécurité */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 text-center">
            💡 Astuce : Déclarez votre voyage au moins 24h avant votre départ pour garantir 
            la disponibilité de votre carte à l'étranger.
          </p>
        </div>
      </div>
    </div>
  );
}