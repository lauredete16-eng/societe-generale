import React, { createContext, useContext, useState } from "react";
import { usersDB } from "../services/UserService.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (code, password) => {
    const user = usersDB[code];
    if (!user) return { success: false };
    if (user.password !== password) return { success: false };

    console.log('User connecté:', user);
    console.log('exp:', user.exp);
    
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);