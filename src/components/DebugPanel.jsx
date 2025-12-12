// DebugPanel.jsx
// Composant à ajouter temporairement en haut de VirementPage pour debug

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { VirementService } from '../services/VirementService';

export default function DebugPanel({ currentUser }) {
  const [showDebug, setShowDebug] = useState(false);
  const [storageData, setStorageData] = useState({});
  const [virementsCount, setVirementsCount] = useState(0);

  const checkStorage = async () => {
    try {
      // Vérifier les virements
      const virements = await VirementService.getTousLesVirements();
      setVirementsCount(virements.length);

      // Vérifier les données de storage
      const userResult = await window.storage.get('current-user-data');
      const virementsResult = await window.storage.get('virements-data');
      const usersDbResult = await window.storage.get('users-database');

      setStorageData({
        user: userResult ? JSON.parse(userResult.value) : null,
        virements: virementsResult ? JSON.parse(virementsResult.value) : [],
        usersDb: usersDbResult ? Object.keys(JSON.parse(usersDbResult.value)).length : 0
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du storage:', error);
    }
  };

  useEffect(() => {
    if (showDebug) {
      checkStorage();
    }
  }, [showDebug]);

  const clearAllStorage = async () => {
    if (window.confirm('⚠️ ATTENTION : Cela va supprimer TOUTES les données (utilisateur + virements). Continuer ?')) {
      try {
        await window.storage.delete('current-user-data');
        await window.storage.delete('virements-data');
        await window.storage.delete('users-database');
        alert('✅ Toutes les données ont été supprimées');
        window.location.reload();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-purple-600 rounded-lg shadow-2xl p-4 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-purple-600">🔍 Debug Panel</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <EyeOff className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="bg-blue-50 p-3 rounded">
          <div className="font-semibold text-blue-700 mb-2">👤 Utilisateur Connecté</div>
          {currentUser ? (
            <div className="space-y-1 text-xs">
              <div><strong>Username:</strong> {currentUser.username}</div>
              <div><strong>Nom:</strong> {currentUser.nom}</div>
              <div><strong>Solde:</strong> {currentUser.solde?.toLocaleString('fr-FR')} €</div>
            </div>
          ) : (
            <div className="text-red-600">Aucun utilisateur</div>
          )}
        </div>

        <div className="bg-green-50 p-3 rounded">
          <div className="font-semibold text-green-700 mb-2">💾 Storage</div>
          <div className="space-y-1 text-xs">
            <div><strong>Virements totaux:</strong> {virementsCount}</div>
            <div><strong>User sauvegardé:</strong> {storageData.user ? '✅ Oui' : '❌ Non'}</div>
            <div><strong>Virements sauvegardés:</strong> {storageData.virements?.length || 0}</div>
            <div><strong>UsersDB:</strong> {storageData.usersDb || 0} utilisateurs</div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded">
          <div className="font-semibold text-yellow-700 mb-2">📊 Détails Virements</div>
          {storageData.virements && storageData.virements.length > 0 ? (
            <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
              {storageData.virements.map((v, i) => (
                <div key={i} className="border-b border-yellow-200 pb-1">
                  <div><strong>#{i+1}</strong> {v.beneficiaire?.nom} - {v.montant}€</div>
                  <div className="text-gray-600">Statut: {v.statut} ({v.pourcentageProgression}%)</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">Aucun virement</div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={checkStorage}
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 text-xs"
          >
            <RefreshCw className="w-3 h-3" />
            Rafraîchir
          </button>
          <button
            onClick={clearAllStorage}
            className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-xs"
          >
            🗑️ Tout Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}