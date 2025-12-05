import React from "react";
import NavBar from "./NavBar";

export default function ProfilPage({ currentUser }) {
  return (
    <div className="min-h-screen  from-emerald-400 to-emerald-500 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Mon Profil</h2>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Nom complet</p>
          <p className="text-lg font-semibold">{currentUser.nom}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-lg font-semibold">{currentUser.email}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Téléphone</p>
          <p className="text-lg font-semibold">{currentUser.telephone}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Adresse</p>
          <p className="text-lg font-semibold">{currentUser.adresse}</p>
        </div>
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl mt-4">Modifier mes informations</button>
      </div>
      <NavBar />
  </div>
 );
}
