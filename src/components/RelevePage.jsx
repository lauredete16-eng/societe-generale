import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RelevePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('2026-01');
  const [isGenerating, setIsGenerating] = useState(false);

  const moisDisponibles = [
    { value: '2026-01', label: 'Janvier 2026' },
    { value: '2025-12', label: 'Décembre 2025' },
    { value: '2025-11', label: 'Novembre 2025' },
    { value: '2025-10', label: 'Octobre 2025' },
    { value: '2025-09', label: 'Septembre 2025' },
    { value: '2025-08', label: 'Août 2025' }
  ];

  const operations = [
    { date: '08/01/2026', libelle: 'Virement reçu - Salaire', montant: 2500, type: 'credit' },
    { date: '07/01/2026', libelle: 'Prélèvement EDF', montant: -85.50, type: 'debit' },
    { date: '06/01/2026', libelle: 'Achat Carrefour', montant: -42.30, type: 'debit' },
    { date: '05/01/2026', libelle: 'Virement émis', montant: -200, type: 'debit' },
    { date: '04/01/2026', libelle: 'Retrait DAB', montant: -50, type: 'debit' }
  ];

  const soldeDebut = 5000;
  const totalOperations = operations.reduce((sum, op) => sum + op.montant, 0);
  const soldeFin = soldeDebut + totalOperations;

  const handleDownloadReleve = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const releveHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relevé de compte - ${selectedMonth}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
        .releve-container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border: 2px solid #e60028; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #e60028; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #e60028; font-size: 28px; margin-bottom: 10px; }
        .header p { color: #666; font-size: 14px; }
        .info-client { margin-bottom: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .info-label { color: #666; font-weight: 600; }
        .info-value { color: #333; font-weight: bold; }
        .soldes { display: flex; gap: 20px; margin-bottom: 30px; }
        .solde-box { flex: 1; padding: 20px; border-radius: 8px; text-align: center; }
        .solde-debut { background: #e3f2fd; border: 2px solid #2196f3; }
        .solde-fin { background: #e8f5e9; border: 2px solid #4caf50; }
        .solde-label { color: #666; font-size: 14px; margin-bottom: 5px; }
        .solde-montant { font-size: 28px; font-weight: bold; }
        .operations-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .operations-table th { background: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #e60028; font-weight: bold; }
        .operations-table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        .operation-debit { color: #d32f2f; }
        .operation-credit { color: #388e3c; font-weight: bold; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0; text-align: center; color: #666; font-size: 12px; }
        @media print {
            body { background: white; padding: 0; }
            .releve-container { box-shadow: none; border: none; }
        }
    </style>
</head>
<body>
    <div class="releve-container">
        <div class="header">
            <h1>🏦 SOCIÉTÉ GÉNÉRALE</h1>
            <p>Relevé de Compte Bancaire</p>
            <p style="margin-top: 5px; font-weight: bold;">Période : ${moisDisponibles.find(m => m.value === selectedMonth)?.label}</p>
        </div>

        <div class="info-client">
            <div class="info-row">
                <span class="info-label">Titulaire</span>
                <span class="info-value">${currentUser?.nom || 'Nom Titulaire'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Numéro de compte</span>
                <span class="info-value">${currentUser?.numeroCompte || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date d'édition</span>
                <span class="info-value">${new Date().toLocaleDateString('fr-FR')}</span>
            </div>
        </div>

        <div class="soldes">
            <div class="solde-box solde-debut">
                <div class="solde-label">Solde au début</div>
                <div class="solde-montant" style="color: #2196f3;">${soldeDebut.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
            </div>
            <div class="solde-box solde-fin">
                <div class="solde-label">Solde à la fin</div>
                <div class="solde-montant" style="color: #4caf50;">${soldeFin.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
            </div>
        </div>

        <h2 style="font-size: 20px; margin-bottom: 15px; color: #333;">Opérations du mois</h2>
        
        <table class="operations-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Libellé</th>
                    <th style="text-align: right;">Débit</th>
                    <th style="text-align: right;">Crédit</th>
                </tr>
            </thead>
            <tbody>
                ${operations.map(op => `
                    <tr>
                        <td>${op.date}</td>
                        <td>${op.libelle}</td>
                        <td style="text-align: right;" class="${op.type === 'debit' ? 'operation-debit' : ''}">
                            ${op.type === 'debit' ? Math.abs(op.montant).toFixed(2) + ' €' : ''}
                        </td>
                        <td style="text-align: right;" class="${op.type === 'credit' ? 'operation-credit' : ''}">
                            ${op.type === 'credit' ? op.montant.toFixed(2) + ' €' : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="text-align: right; padding: 20px; background: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Total des opérations</div>
            <div style="font-size: 24px; font-weight: bold; color: ${totalOperations >= 0 ? '#4caf50' : '#d32f2f'};">
                ${totalOperations >= 0 ? '+' : ''}${totalOperations.toFixed(2)} €
            </div>
        </div>

        <div class="footer">
            <p><strong>SOCIÉTÉ GÉNÉRALE</strong></p>
            <p>29 Boulevard Haussmann, 75009 Paris, France</p>
            <p style="margin-top: 10px;">Document officiel - Conservez ce relevé pour vos archives</p>
        </div>
    </div>
</body>
</html>`;

      const blob = new Blob([releveHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Releve_${selectedMonth}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsGenerating(false);
    }, 1500);
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
          <h1 className="text-xl font-bold flex-1">Relevés de compte</h1>
          <img 
            src="images/logo sg.jpg" 
            alt="SG" 
            className="h-10 object-contain"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        {/* Sélection du mois */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={24} className="text-red-600" />
            <h2 className="text-lg font-bold">Sélectionnez une période</h2>
          </div>
          
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-semibold"
          >
            {moisDisponibles.map((mois) => (
              <option key={mois.value} value={mois.value}>
                {mois.label}
              </option>
            ))}
          </select>
        </div>

        {/* Aperçu du relevé */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText size={24} className="text-red-600" />
            <h2 className="text-lg font-bold">Aperçu du relevé</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">Solde de début</p>
              <p className="text-2xl font-bold text-blue-700">
                {soldeDebut.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-2">Solde de fin</p>
              <p className="text-2xl font-bold text-green-700">
                {soldeFin.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total des opérations</p>
            <p className={`text-xl font-bold ${totalOperations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalOperations >= 0 ? '+' : ''}{totalOperations.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </p>
          </div>
        </div>

        {/* Bouton de téléchargement */}
        <button
          onClick={handleDownloadReleve}
          disabled={isGenerating}
          className="w-full bg-red-600 text-white rounded-lg p-4 shadow-sm flex items-center justify-center gap-3 hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span className="font-semibold">Génération en cours...</span>
            </>
          ) : (
            <>
              <Download size={24} />
              <span className="font-semibold">Télécharger le relevé</span>
            </>
          )}
        </button>

        {/* Historique des téléchargements */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">Relevés récents</h3>
          <div className="space-y-3">
            {moisDisponibles.slice(0, 3).map((mois) => (
              <div key={mois.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-sm">{mois.label}</p>
                    <p className="text-xs text-gray-500">Disponible</p>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-700 font-semibold text-sm">
                  Télécharger
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Info :</strong> Les relevés sont générés au format HTML et peuvent être 
            imprimés ou convertis en PDF depuis votre navigateur.
          </p>
        </div>
      </main>
    </div>
  );
}