import React from "react";
import { formatEuro } from "../utils/Format.js";
import NavBar from "./NavBar";

export default function DecouvertPage({ currentUser }) {
  return (
    <div className="min-h-screen bg-emerald-400 to-emerald-500 p-4">
      <div className="max-w-xl mx-auto space-y-3">
        <div className="bg-emerald-50 p-5 rounded-xl mb-3">
          <p className="text-gray-700 font-semibold text-sm">Découvert autorisé</p>
          <p className="text-2xl font-bold text-emerald-600">{formatEuro(currentUser.decouvertAutorise)}</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl">
          <p className="text-gray-700 font-semibold text-sm">Découvert utilisé</p>
          <p className="text-2xl font-bold text-gray-900">{formatEuro(currentUser.decouvertUtilise)}</p>
        </div>
      </div>
      <NavBar />
  </div>
 );
}