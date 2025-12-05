import React from "react";
import { formatEuro } from "../utils/format";
import NavBar from "./NavBar";

export default function DecouvertPage({ currentUser }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-400 to-emerald-500 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-emerald-50 p-6 rounded-xl mb-4">
          <p className="text-gray-700 font-semibold">Découvert autorisé</p>
          <p className="text-3xl font-bold text-emerald-600">{formatEuro(currentUser.decouvertAutorise)}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl">
          <p className="text-gray-700 font-semibold">Découvert utilisé</p>
          <p className="text-3xl font-bold text-gray-900">{formatEuro(currentUser.decouvertUtilise)}</p>
        </div>
      </div>
      <NavBar />
  </div>
 );
}
