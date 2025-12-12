import React, { useState } from "react";
import { FileText, Euro, CreditCard, Banknote, Globe, Download, ArrowLeft } from "lucide-react";

export default function ConditionsTarifaires({ navigateTo }) {
  const [activeTab, setActiveTab] = useState('carte');

  const tarifsData = {
    carte: [
      { label: 'Cotisation annuelle', montant: '45,00 €', frequence: 'par an' },
      { label: 'Carte supplémentaire', montant: '25,00 €', frequence: 'par an' },
      { label: 'Renouvellement anticipé', montant: '15,00 €', frequence: 'par opération' },
      { label: 'Réédition du code secret', montant: '10,00 €', frequence: 'par opération' }
    ],
    retraits: [
      { label: 'Retrait dans un DAB en France', montant: 'Gratuit', frequence: '' },
      { label: 'Retrait dans un DAB en zone euro', montant: 'Gratuit', frequence: '' },
      { label: 'Retrait hors zone euro', montant: '2,50 €', frequence: 'par retrait' },
      { label: 'Frais de change hors zone euro', montant: '2,90 %', frequence: 'du montant' }
    ],
    paiements: [
      { label: 'Paiement en France', montant: 'Gratuit', frequence: '' },
      { label: 'Paiement en zone euro', montant: 'Gratuit', frequence: '' },
      { label: 'Paiement hors zone euro', montant: 'Gratuit', frequence: '' },
      { label: 'Frais de change hors zone euro', montant: '2,90 %', frequence: 'du montant' }
    ],
    incidents: [
      { label: 'Frais de rejet de paiement', montant: '20,00 €', frequence: 'par incident' },
      { label: 'Lettre d\'information préalable', montant: '25,00 €', frequence: 'par envoi' },
      { label: 'Opposition sur carte', montant: 'Gratuit', frequence: '' },
      { label: 'Envoi carte de remplacement', montant: '15,00 €', frequence: 'par envoi' }
    ]
  };

  const tabs = [
    { id: 'carte', label: 'Carte', icon: CreditCard },
    { id: 'retraits', label: 'Retraits', icon: Banknote },
    { id: 'paiements', label: 'Paiements', icon: Euro },
    { id: 'incidents', label: 'Incidents', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="w-full bg-red-600 pt-8 pb-6">
        <div className="max-w-md mx-auto px-4">
          <button 
            onClick={() => navigateTo('main')}
            className="flex items-center text-white mb-4 hover:opacity-80 transition"
          >
            <ArrowLeft size={24} />
            <span className="ml-2">Retour</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Conditions tarifaires</h1>
          <p className="text-white opacity-90 mt-2">CB Gold Evolution</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Info date */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Tarifs en vigueur au</p>
              <p className="font-bold text-gray-900">1er janvier 2025</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium">
              <Download size={16} />
              <span>Télécharger</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="grid grid-cols-4 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 flex flex-col items-center justify-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'bg-red-50 border-b-2 border-red-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={activeTab === tab.id ? 'text-red-600' : 'text-gray-400'}
                  />
                  <span 
                    className={`text-xs font-medium ${
                      activeTab === tab.id ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tarifs list */}
          <div className="p-1">
            {tarifsData[activeTab].map((tarif, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 ${
                  index < tarifsData[activeTab].length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{tarif.label}</p>
                  {tarif.frequence && (
                    <p className="text-xs text-gray-500 mt-1">{tarif.frequence}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    tarif.montant === 'Gratuit' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tarif.montant}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plafonds */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe size={20} className="text-red-600" />
            Plafonds par défaut
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">Paiements</p>
                <p className="text-xs text-gray-500">Par période de 30 jours glissants</p>
              </div>
              <p className="font-bold text-gray-900">5 000 €</p>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">Retraits</p>
                <p className="text-xs text-gray-500">Par période de 7 jours glissants</p>
              </div>
              <p className="font-bold text-gray-900">1 000 €</p>
            </div>
          </div>
        </div>

        {/* Informations importantes */}
        <div className="bg-blue-50 rounded-xl p-5">
          <h3 className="font-bold text-blue-900 mb-3 text-sm">
            Informations importantes
          </h3>
          <ul className="space-y-2 text-xs text-blue-800">
            <li className="flex gap-2">
              <span className="text-blue-600 ">•</span>
              <span>Les tarifs sont susceptibles d'être modifiés. Vous serez informé 2 mois avant toute modification.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 ">•</span>
              <span>La cotisation annuelle est prélevée automatiquement à la date anniversaire de votre carte.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 ">•</span>
              <span>Les frais de change sont appliqués selon le taux de conversion en vigueur au moment de la transaction.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 ">•</span>
              <span>Zone euro : Allemagne, Autriche, Belgique, Chypre, Espagne, Estonie, Finlande, France, Grèce, Irlande, Italie, Lettonie, Lituanie, Luxembourg, Malte, Pays-Bas, Portugal, Slovaquie, Slovénie.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}