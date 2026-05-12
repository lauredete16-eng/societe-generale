// AuthContext.jsx - VERSION AVEC SUPPORT VERSIONING
import React, { createContext, useContext, useState, useEffect } from "react";
import { usersDB, getDBVersion } from "../services/UserService.js";

export const AuthContext = createContext();

const USER_STORAGE_KEY = 'user:current';
const USERS_STORAGE_KEY = 'users:database';
const VERSION_STORAGE_KEY = 'users:db_version';

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
      const savedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
      const currentVersion = getDBVersion();
      
      console.log(`📦 Version sauvegardée: ${savedVersion}`);
      console.log(`📦 Version actuelle: ${currentVersion}`);
      
      if (savedVersion && parseInt(savedVersion) !== currentVersion) {
        console.log('🔄 Nouvelle version détectée ! Rechargement de la base...');
        return null;
      }
      
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
      localStorage.setItem(VERSION_STORAGE_KEY, getDBVersion().toString());
      console.log('💾 Base de données utilisateurs sauvegardée');
      console.log(`📦 Version ${getDBVersion()} enregistrée`);
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
      console.log(`🔄 Base de données initialisée (version ${getDBVersion()})`);
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

    const userWithCredentials = {
      ...user,
      // ✅ CORRECTION : `code` est maintenant attaché à currentUser.
      // Sans ce champ, getMontantDeblocage(currentUser.code) retournait
      // toujours undefined → montantDeblocage = 0 et virement bloqué.
      code: code,
      username: code,
      numeroCompte: user.numeroCompte
    };
    
    setCurrentUserState(userWithCredentials);
    setIsLoggedIn(true);
    
    saveCurrentUser(userWithCredentials);
    
    console.log('🔑 code attaché à currentUser:', code);
    console.log('💰 montantDeblocage:', user.montantDeblocage);

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