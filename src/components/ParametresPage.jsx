import React from "react";
import NavBar from "./NavBar";

export default function ParametresPage({ currentUser }) {
  return (
    <div className="min-h-screen  from-emerald-400 to-emerald-500 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Paramètres</h2>
        <button className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-xl text-left font-semibold">Changer le mot de passe</button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-xl text-left font-semibold">Notifications</button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-xl text-left font-semibold">Sécurité</button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-xl text-left font-semibold">Langue et région</button>
        <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 p-4 rounded-xl text-left font-semibold mt-6">
          Déconnexion
        </button>
      </div>
      <NavBar />
  </div>
 );
}
