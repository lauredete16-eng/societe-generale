import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HistoriquePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const operations = [
    { 
      id: 1,
      date: '2026-05-25',
      libelle: 'Virement reçu',
      expediteur: 'Francois Blataire',
      montant: 286000,
      type: 'credit',
      categorie: 'Virement'
    },

    { id: 2, date: '2026-01-07', libelle: 'Prélèvement EDF', montant: -85.50, type: 'debit', categorie: 'Facture' },
    { id: 3, date: '2026-01-06', libelle: 'Achat Carrefour', montant: -42.30, type: 'debit', categorie: 'Courses' },
    { id: 4, date: '2026-01-05', libelle: 'Virement émis', montant: -200, type: 'debit', categorie: 'Virement' },
    { id: 5, date: '2026-01-04', libelle: 'Retrait DAB', montant: -50, type: 'debit', categorie: 'Retrait' },
    { id: 6, date: '2026-01-03', libelle: 'Achat Amazon', montant: -89.99, type: 'debit', categorie: 'Achat en ligne' },
    { id: 7, date: '2026-01-02', libelle: 'Virement reçu', montant: 150, type: 'credit', categorie: 'Virement' },
    { id: 8, date: '2026-01-01', libelle: 'Abonnement Netflix', montant: -15.99, type: 'debit', categorie: 'Abonnement' },
    { id: 9, date: '2025-12-31', libelle: 'Restaurant Le Bistrot', montant: -67.50, type: 'debit', categorie: 'Restaurant' },
    { id: 10, date: '2025-12-30', libelle: 'Remboursement Sécu', montant: 45.20, type: 'credit', categorie: 'Remboursement' }
  ];

  const filteredOperations = operations.filter(op => {
    const matchSearch = op.libelle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterType === 'all' || op.type === filterType;
    return matchSearch && matchFilter;
  });

  const totalCredit = operations
    .filter(op => op.type === 'credit')
    .reduce((sum, op) => sum + op.montant, 0);

  const totalDebit = operations
    .filter(op => op.type === 'debit')
    .reduce((sum, op) => sum + Math.abs(op.montant), 0);

  const handleExportPDF = () => {
    alert('Export PDF en cours de développement...');
  };

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

          <h1 className="text-xl font-bold flex-1">Historique</h1>

          <img
            src="images/logo sg.jpg"
            alt="SG"
            className="h-10 object-contain"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        {/* Résumé */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-green-600" />
              <p className="text-sm text-green-800">Crédits</p>
            </div>

            <p className="text-2xl font-bold text-green-700">
              +{totalCredit.toLocaleString('fr-FR', {
                minimumFractionDigits: 2
              })} €
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={20} className="text-red-600" />
              <p className="text-sm text-red-800">Débits</p>
            </div>

            <p className="text-2xl font-bold text-red-700">
              -{totalDebit.toLocaleString('fr-FR', {
                minimumFractionDigits: 2
              })} €
            </p>
          </div>
        </div>

        {/* Recherche */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Rechercher une opération..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

          {/* Filtres */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterType === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tout
            </button>

            <button
              onClick={() => setFilterType('credit')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterType === 'credit'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Crédits
            </button>

            <button
              onClick={() => setFilterType('debit')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterType === 'debit'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Débits
            </button>
          </div>
        </div>

        {/* Liste des opérations */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredOperations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />

              <p className="text-lg font-semibold mb-2">
                Aucune opération trouvée
              </p>

              <p className="text-sm">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredOperations.map((op) => (
                <div
                  key={op.id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          op.type === 'credit'
                            ? 'bg-green-100'
                            : 'bg-orange-100'
                        }`}
                      >
                        {op.type === 'credit' ? (
                          <TrendingUp
                            size={20}
                            className="text-green-600"
                          />
                        ) : (
                          <TrendingDown
                            size={20}
                            className="text-orange-600"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {op.libelle}
                        </p>

                        {op.expediteur && (
                          <p className="text-xs text-gray-500 mt-1">
                            De : {op.expediteur}
                          </p>
                        )}

                        {op.destinataire && (
                          <p className="text-xs text-gray-500 mt-1">
                            Vers : {op.destinataire}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>
                            {new Date(op.date).toLocaleDateString('fr-FR')}
                          </span>

                          <span>•</span>

                          <span className="px-2 py-0.5 bg-gray-100 rounded">
                            {op.categorie}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p
                      className={`font-bold text-lg ${
                        op.type === 'credit'
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {op.montant > 0 ? '+' : ''}
                      {op.montant.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2
                      })} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Les opérations sont affichées du plus récent au plus ancien.
            Utilisez les filtres pour affiner votre recherche.
          </p>
        </div>
      </main>
    </div>
  );
}