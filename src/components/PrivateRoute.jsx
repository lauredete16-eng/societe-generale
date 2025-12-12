// PrivateRoute.js - VERSION CORRIGÉE
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth(); // ← Ajoute loading

  // ⏳ Attendre que le chargement soit terminé
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Chargement...
      </div>
    );
  }

  // ✅ Maintenant on peut vérifier en toute sécurité
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}