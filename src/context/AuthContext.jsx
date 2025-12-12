// AuthContext.jsx - VERSION LOCALSTORAGE
import React, { createContext, useContext, useState, useEffect } from "react";
import { usersDB } from "../services/UserService.js";

export const AuthContext = createContext();

const USER_STORAGE_KEY = 'user:current';
const USERS_STORAGE_KEY = 'users:database';

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    try {
      console.log('🔍 Chargement de l\'utilisateur depuis localStorage...');
      const data = localStorage.getItem(USER_STORAGE_KEY);
      
      if (data) {
        const userData = JSON.parse(data);
        setCurrentUserState(userData);
        setIsLoggedIn(true);
        console.log('✅ Utilisateur chargé:', userData.nom);
        console.log('💰 Solde:', userData.solde);
      } else {
        console.log('ℹ️ Aucun utilisateur connecté');
      }
    } catch (error) {
      console.log('ℹ️ Première connexion');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentUser = (userData) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log('💾 Utilisateur sauvegardé:', userData.username);
      console.log('💰 Solde sauvegardé:', userData.solde);
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde utilisateur:', error);
      return false;
    }
  };

  const loadUsersDB = () => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      
      if (data) {
        const users = JSON.parse(data);
        console.log('✅ Base de données chargée:', Object.keys(users).length, 'utilisateurs');
        return users;
      }
      return null;
    } catch (error) {
      console.log('ℹ️ Initialisation de la base de données');
      return null;
    }
  };

  const saveUsersDB = (users) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      console.log('💾 Base de données utilisateurs sauvegardée');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde base de données:', error);
      return false;
    }
  };

  const getUsersDatabase = () => {
    let savedUsers = loadUsersDB();
    
    if (!savedUsers) {
      savedUsers = { ...usersDB };
      saveUsersDB(savedUsers);
      console.log('🔄 Base de données initialisée');
    }
    
    return savedUsers;
  };

  const login = (code, password) => {
    console.log('🔐 Tentative de connexion:', code);
    const users = getUsersDatabase();
    const user = users[code];
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return { success: false };
    }
    if (user.password !== password) {
      console.log('❌ Mot de passe incorrect');
      return { success: false };
    }

    console.log('✅ Connexion réussie');
    console.log('👤 Utilisateur:', user.nom);
    console.log('💰 Solde initial:', user.solde);

    // ✅ FIX : garder l'IBAN, ne jamais remettre le code
    const userWithCredentials = {
      ...user,
      username: code,
      numeroCompte: user.numeroCompte  // <-- ICI la correction
    };
    
    setCurrentUserState(userWithCredentials);
    setIsLoggedIn(true);
    
    saveCurrentUser(userWithCredentials);
    
    return { success: true, user: userWithCredentials };
  };

  const logout = () => {
    try {
      console.log('👋 Déconnexion en cours...');
      
      localStorage.removeItem(USER_STORAGE_KEY);
      
      setCurrentUserState(null);
      setIsLoggedIn(false);
      
      console.log('✅ Déconnexion réussie');
      console.log('💾 Virements conservés dans localStorage');
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
    }
  };

  const setCurrentUser = (updatedUserData) => {
    console.log('🔄 Mise à jour utilisateur');
    console.log('💰 Ancien solde:', currentUser?.solde);
    console.log('💰 Nouveau solde:', updatedUserData.solde);
    
    setCurrentUserState(updatedUserData);
    saveCurrentUser(updatedUserData);
    
    if (updatedUserData.username) {
      const users = getUsersDatabase();
      if (users[updatedUserData.username]) {
        users[updatedUserData.username] = {
          ...users[updatedUserData.username],
          solde: updatedUserData.solde
        };
        saveUsersDB(users);
        console.log('💾 Solde synchronisé dans la base');
      }
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        currentUser, 
        setCurrentUser,
        loading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);