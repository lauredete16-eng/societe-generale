import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DepotPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [montant, setMontant] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDepot = () => {
    if (montant && parseFloat(montant) > 0) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setMontant('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden border-4 border-black">
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, #dc2626 0%, #dc2626 50%, #000000 50%, #000000 100%)'}}></div>
            <div className="w-6 h-0.5 bg-white absolute" style={{top: '50%', transform: 'translateY(-50%)'}}></div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition"
          >
            <Power className="w-7 h-7 text-white" />
          </button>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-5xl mx-auto px-4 py-6 pt-20">
        <h1 className="text-2xl font-bold mb-6">Faire un dépôt</h1>

        {showSuccess ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dépôt enregistré !</h2>
            <p className="text-gray-600">Votre dépôt de {parseFloat(montant).toFixed(2)} € a été pris en compte.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-8 h-8 text-red-600" />
                <h2 className="text-xl font-bold">Dépôt d'espèces</h2>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Montant du dépôt (€)
                </label>
                <input
                  type="number"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-xl font-semibold"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600  mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Information importante</p>
                  <p>Les dépôts sont traités sous 24 à 48h ouvrées. Vous recevrez une confirmation par email.</p>
                </div>
              </div>

              <button
                onClick={handleDepot}
                disabled={!montant || parseFloat(montant) <= 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Confirmer le dépôt
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold mb-3">Comment effectuer un dépôt ?</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Rendez-vous dans une agence Société Générale</li>
                <li>Présentez votre carte bancaire ou RIB</li>
                <li>Remettez vos espèces au guichet</li>
                <li>Conservez votre reçu de dépôt</li>
              </ol>
            </div>
          </>
        )}

        <button 
          onClick={() => navigate('/accueil')}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg mt-6"
        >
          Retour à l'accueil
        </button>
      </main>
    </div>
  );
}