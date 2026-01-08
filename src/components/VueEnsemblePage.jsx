import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VueEnsemblePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const soldeTotal = currentUser?.solde || 0;

  const comptes = [
    {
      nom: 'Compte Courant',
      solde: currentUser?.solde || 0,
      type: 'courant',
      icon: Wallet
    },
    {
      nom: 'Compte Épargne',
      solde: 0,
      type: 'epargne',
      icon: PiggyBank
    }
  ];

  const dernieresOperations = [
    { date: '08/01/2026', libelle: 'Virement reçu', montant: 1500, type: 'credit' },
    { date: '07/01/2026', libelle: 'Prélèvement Électricité', montant: -85.50, type: 'debit' },
    { date: '06/01/2026', libelle: 'Achat carte bancaire', montant: -42.30, type: 'debit' },
    { date: '05/01/2026', libelle: 'Virement émis', montant: -200, type: 'debit' }
  ];

  const objectifs = [
    { nom: 'Vacances 2026', cible: 3000, actuel: 1250, icon: Target },
    { nom: 'Fonds d\'urgence', cible: 5000, actuel: 2800, icon: PiggyBank }
  ];

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
          <h1 className="text-xl font-bold flex-1">Vue d'ensemble</h1>
          <img 
            src="images/logo sg.jpg" 
            alt="SG" 
            className="h-10 object-contain"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        {/* Solde total */}
        <div className="bg-red-600 to-red-700 text-white rounded-xl p-6 mb-6 shadow-lg">
          <p className="text-sm opacity-90 mb-2">Solde total</p>
          <p className="text-4xl font-bold mb-4">
            {soldeTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </p>
          <div className="flex gap-4 text-sm">
            <div>
              <p className="opacity-75">Ce mois</p>
              <p className="font-semibold">+ 450 €</p>
            </div>
            <div>
              <p className="opacity-75">Dépenses</p>
              <p className="font-semibold">- 1 250 €</p>
            </div>
          </div>
        </div>

        {/* Mes comptes */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Mes comptes</h2>
          <div className="space-y-3">
            {comptes.map((compte, index) => {
              const Icon = compte.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Icon size={24} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{compte.nom}</p>
                      <p className="text-sm text-gray-500">{compte.type}</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">
                    {compte.solde.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dernières opérations */}
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3">Dernières opérations</h2>
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {dernieresOperations.map((op, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    op.type === 'credit' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {op.type === 'credit' ? (
                      <TrendingUp size={20} className="text-green-600" />
                    ) : (
                      <TrendingDown size={20} className="text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{op.libelle}</p>
                    <p className="text-xs text-gray-500">{op.date}</p>
                  </div>
                </div>
                <p className={`font-bold ${op.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                  {op.montant > 0 ? '+' : ''}{op.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Objectifs */}
        <section>
          <h2 className="text-lg font-bold mb-3">Mes objectifs</h2>
          <div className="space-y-3">
            {objectifs.map((obj, index) => {
              const Icon = obj.icon;
              const progression = (obj.actuel / obj.cible) * 100;
              return (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{obj.nom}</p>
                      <p className="text-sm text-gray-500">
                        {obj.actuel.toLocaleString('fr-FR')} € / {obj.cible.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">{progression.toFixed(0)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${progression}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}