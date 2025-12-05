import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Power,
  MoreVertical,
  Plus,
  MapPin,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const handleNavigation = (path) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
    }, 600);
  };

  const comptes = [
    {
      titre: "Compte Bancaire",
      numero: `•••• ${currentUser?.code?.slice(-4) || "9527"}`,
      solde: currentUser?.solde || 0,
      principal: true,
    },
    {
      titre: "CB GOLD Evolution",
      numero: `•••• ${currentUser?.carte || "4298"}`,
      solde: null,
      principal: false,
    },
  ];

  const formatMontant = (montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header fixe */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 fixed top-0 w-full z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between w-full relative">
          <button className="flex flex-col items-center text-gray-700 md:hidden">
            <Menu size={24} />
            <span className="text-xs mt-1">MENU</span>
          </button>

          {/* Logo centré */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="w-9 h-9 border-2 border-black rounded-sm flex flex-col overflow-hidden relative">
              <div className="w-full flex-1 bg-red-600"></div>
              <div className="absolute top-1/2 left-1/5 right-1/5 h-0.5 bg-white transform -translate-y-1/2 z-10"></div>
              <div className="w-full flex-1 bg-black"></div>
            </div>
          </div>

          {/* Bouton déconnexion */}
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 ml-auto"
          >
            <Power size={24} />
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 pt-20 px-4 w-full bg-white">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Mes comptes</h1>

        <div className="space-y-3 mb-6">
          {comptes.map((compte, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between ${
                compte.principal ? "border-l-4 border-red-600" : ""
              }`}
            >
              {/* Header compte */}
              <div className="flex justify-between items-start">
                <div className={`flex-1 ${!compte.principal ? "pl-3" : ""}`}>
                  <h3 className="text-base font-semibold text-gray-900">
                    {compte.titre}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">{compte.numero}</p>
                </div>
                {compte.principal && (
                  <button className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300">
                    <MoreVertical size={14} />
                  </button>
                )}
              </div>

              {/* Somme en bas à droite */}
              {compte.solde !== null && (
                <div className="flex justify-end mt-3">
                  <p className="text-xl font-bold text-gray-900">
                    {formatMontant(compte.solde)} €
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Opérations externes */}
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          OPÉRATION EXTERNE
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => handleNavigation("/virement")}
            disabled={isNavigating}
            className="w-full bg-white rounded-lg p-4 shadow-sm flex items-center gap-3 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Plus size={24} className="text-red-600" strokeWidth={3} />
            </div>
            <span className="text-base font-semibold text-gray-900">Virement</span>
          </button>

          <button
            onClick={() => handleNavigation("/cartes")}
            disabled={isNavigating}
            className="w-full bg-white rounded-lg p-4 shadow-sm flex items-center gap-3 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Plus size={24} className="text-red-600" strokeWidth={3} />
            </div>
            <span className="text-base font-semibold text-gray-900">
              Carte Bancaire
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div>
        <div className="bg-black py-6">
          <div className="max-w-3xl mx-auto px-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex flex-col items-center gap-2 text-white hover:opacity-80 transition">
                <HelpCircle size={32} strokeWidth={1.5} />
                <span className="text-xs font-medium">Questions fréquentes</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white hover:opacity-80 transition">
                <MapPin size={32} strokeWidth={1.5} />
                <span className="text-xs font-medium">Trouver une agence</span>
              </button>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 text-white hover:opacity-80 transition border-t border-b border-gray-700 mb-6">
              <span className="text-sm font-medium">Autres sites Société Générale</span>
              <ChevronDown size={18} />
            </button>

            <div className="flex items-center justify-center gap-8 mb-6 text-white">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 py-6 w-full">
          <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-9 h-9 border-2 border-black rounded-sm flex flex-col overflow-hidden relative">
                <div className="w-full flex-1 bg-red-600"></div>
                <div className="absolute top-1/2 left-1/5 right-1/5 h-0.5 bg-white transform -translate-y-1/2 z-10"></div>
                <div className="w-full flex-1 bg-black"></div>
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-black leading-tight">SOCIETE</div>
                <div className="text-lg font-bold text-black leading-tight">GENERALE</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 text-xs text-gray-700">
              <button>Sécurité</button>
              <button>Nos engagements</button>
              <button>Gestion des Cookies</button>
              <button>Données personnelles</button>
              <button>Documentation et Tarifs</button>
              <button>Informations légales</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}