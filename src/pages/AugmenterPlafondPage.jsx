import React from "react";
import { ArrowLeft } from "lucide-react";

// Page Augmenter Plafond
export function AugmenterPlafondPage({ navigateTo, nouveauPlafond, setNouveauPlafond, confirmerPlafond }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full bg-red-600 pt-6 pb-8 text-center relative">
        <button 
          onClick={() => navigateTo('main')}
          className="absolute left-4 top-6 text-white hover:bg-red-700 p-2 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white px-4">Augmenter le plafond</h1>
        <p className="text-white mt-2">CB Gold Evolution</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Modifier votre plafond de paiement</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Plafond actuel</span>
              <span className="text-2xl font-bold text-gray-900">300 000,00 €</span>
            </div>
            <p className="text-sm text-gray-500">Valable jusqu'au 30/04/2026</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nouveau plafond souhaité
            </label>
            <input 
              type="number"
              value={nouveauPlafond}
              onChange={(e) => setNouveauPlafond(e.target.value)}
              placeholder="Entrez le nouveau montant"
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-red-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Le nouveau plafond doit être supérieur au montant actuel
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Bon à savoir :</strong> La modification de votre plafond prendra effet immédiatement après validation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigateTo('main')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Annuler
            </button>
            <button 
              onClick={confirmerPlafond}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Modifier Retrait
export function ModifierRetraitPage({ navigateTo, nouveauRetrait, setNouveauRetrait, confirmerRetrait }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full bg-red-600 pt-6 pb-8 text-center relative">
        <button 
          onClick={() => navigateTo('main')}
          className="absolute left-4 top-6 text-white hover:bg-red-700 p-2 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white px-4">Capacité de retrait</h1>
        <p className="text-white mt-2">CB Gold Evolution</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Modifier votre capacité de retrait</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Capacité actuelle</span>
              <span className="text-2xl font-bold text-gray-900">50 000,00 €</span>
            </div>
            <p className="text-sm text-gray-500">Sur 7 jours glissants</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nouvelle capacité souhaitée
            </label>
            <input 
              type="number"
              value={nouveauRetrait}
              onChange={(e) => setNouveauRetrait(e.target.value)}
              placeholder="Entrez le nouveau montant"
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700">
            <p className="font-semibold mb-2">Répartition automatique :</p>
            <p className="mb-1">• Distributeurs Société Générale : 41,4% du montant/jour</p>
            <p>• Autres distributeurs en France : 24% du montant sur 7 jours</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigateTo('main')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Annuler
            </button>
            <button 
              onClick={confirmerRetrait}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Paramétrer
export function ParametrerPage({ navigateTo }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full bg-red-600 pt-6 pb-8 text-center relative">
        <button 
          onClick={() => navigateTo('main')}
          className="absolute left-4 top-6 text-white hover:bg-red-700 p-2 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white px-4">Paramétrer ma carte</h1>
        <p className="text-white mt-2">CB Gold Evolution</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Options de votre carte</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Paiements en ligne</h3>
                <p className="text-sm text-gray-600">Autoriser les achats sur internet</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute  after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Retraits à l'étranger</h3>
                <p className="text-sm text-gray-600">Autoriser les retraits hors France</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute  after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Paiements à l'étranger</h3>
                <p className="text-sm text-gray-600">Autoriser les achats hors France</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute  after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Paiement sans contact</h3>
                <p className="text-sm text-gray-600">Autoriser les paiements NFC</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute  after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>

          <button 
            onClick={() => {
              alert('Paramètres enregistrés !');
              navigateTo('main');
            }}
            className="w-full mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}

// Page Déclarer Voyage
export function DeclarerVoyagePage({ navigateTo, voyageData, setVoyageData, confirmerVoyage }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full bg-red-600 pt-6 pb-8 text-center relative">
        <button 
          onClick={() => navigateTo('main')}
          className="absolute left-4 top-6 text-white hover:bg-red-700 p-2 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white px-4">Déclarer un voyage</h1>
        <p className="text-white mt-2">CB Gold Evolution</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Informations de voyage</h2>
          <p className="text-sm text-gray-600 mb-6">
            Déclarez votre voyage pour éviter tout blocage de votre carte à l'étranger
          </p>
          
          <div className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Pays de destination
              </label>
              <input 
                type="text"
                value={voyageData.pays}
                onChange={(e) => setVoyageData({...voyageData, pays: e.target.value})}
                placeholder="Ex: Espagne, Italie, États-Unis..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Date de début
              </label>
              <input 
                type="date"
                value={voyageData.dateDebut}
                onChange={(e) => setVoyageData({...voyageData, dateDebut: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Date de fin
              </label>
              <input 
                type="date"
                value={voyageData.dateFin}
                onChange={(e) => setVoyageData({...voyageData, dateFin: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Bon à savoir :</strong> Cette déclaration permet à votre banque de ne pas bloquer votre carte lors de vos transactions à l'étranger.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigateTo('main')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Annuler
            </button>
            <button 
              onClick={confirmerVoyage}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}