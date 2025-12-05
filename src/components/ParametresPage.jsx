import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, Bell, Lock, Eye, Globe, Moon, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ParametresPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

        <div className="space-y-4">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">Notifications</p>
                  <p className="text-sm text-gray-500">Recevoir les alertes</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition ${
                  notifications ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition transform ${
                  notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Sécurité */}
          <button className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <p className="font-semibold">Sécurité</p>
                <p className="text-sm text-gray-500">Changer mon code</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Confidentialité */}
          <button className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <p className="font-semibold">Confidentialité</p>
                <p className="text-sm text-gray-500">Gérer mes données</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Langue */}
          <button className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <p className="font-semibold">Langue</p>
                <p className="text-sm text-gray-500">Français</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Mode sombre */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">Mode sombre</p>
                  <p className="text-sm text-gray-500">Thème de l'application</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition ${
                  darkMode ? 'bg-red-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/accueil')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg mt-6"
        >
          Retour à l'accueil
        </button>
      </main>
    </div>
  );
}