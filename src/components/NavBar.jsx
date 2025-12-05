import React from "react";
import { Link } from "react-router-dom";
import { Send, Euro, User, Settings } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-xl rounded-t-3xl p-4 flex justify-around">
      <Link to="/virement" className="flex flex-col items-center">
        <Send size={24} /> 
        <span className="text-xs">Virement</span>
      </Link>
      
      <Link to="/depot" className="flex flex-col items-center">
        <Euro size={24} /> 
        <span className="text-xs">Dépôt</span>
      </Link>
      
      <Link to="/profil" className="flex flex-col items-center">
        <User size={24} /> 
        <span className="text-xs">Profil</span>
      </Link>
      
      <Link to="/parametres" className="flex flex-col items-center">
        <Settings size={24} /> 
        <span className="text-xs">Paramètres</span>
      </Link>
    </nav>
  );
}