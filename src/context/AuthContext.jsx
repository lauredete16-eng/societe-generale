import React, { createContext, useContext, useState, useEffect } from "react";
import { usersDB } from "../services/UserService.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurer la session au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Erreur lors de la restauration de la session", error);
        localStorage.removeItem("currentUser"); 
      }
    }
    setLoading(false);
  }, []);

  const login = (code, password) => {
    const user = usersDB[code];
    if (!user) return { success: false };
    if (user.password !== password) return { success: false };

    setCurrentUser(user);
    setIsLoggedIn(true);
    
    // Sauvegarder dans localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    
    // Supprimer de localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("savedLoginCode");
    
    // ✅ AJOUT : Redirection forcée
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
