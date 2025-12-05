import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentUser?.prenom} {currentUser?.nom}
              </h2>
              <p className="text-gray-600">Client Société Générale</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-semibold">{currentUser?.email || 'non renseigné'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Téléphone</p>
                <p className="text-sm font-semibold">{currentUser?.telephone || 'non renseigné'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Adresse</p>
                <p className="text-sm font-semibold">{currentUser?.adresse || 'non renseignée'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Client depuis</p>
                <p className="text-sm font-semibold">Janvier 2020</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/accueil')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg"
        >
          Retour à l'accueil
        </button>
      </main>
    </div>
  );
}