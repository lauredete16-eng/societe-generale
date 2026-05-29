// AuthContext.jsx - VERSION FIREBASE + LOGIN PAR EMAIL
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getUser, loginUser, updateSolde, updateUser } from "../services/UserService.js";

export const AuthContext = createContext();

const USER_STORAGE_KEY = "user:current";

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const data = sessionStorage.getItem(USER_STORAGE_KEY);
      if (data) {
        const { code } = JSON.parse(data);
        const freshUser = await getUser(code);
        if (freshUser) {
          setCurrentUserState(freshUser);
          setIsLoggedIn(true);
          console.log("✅ Session restaurée:", freshUser.nom);
        } else {
          sessionStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.log("ℹ️ Aucune session active");
    } finally {
      setLoading(false);
    }
  };

  const saveSession = (code) => {
    try {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ code }));
    } catch (error) {
      console.error("❌ Erreur sauvegarde session:", error);
    }
  };

  // Connexion par code client
  const login = async (code, password) => {
    console.log("🔐 Connexion par code:", code);
    const user = await loginUser(code, password);
    if (!user) return { success: false };
    const userWithCredentials = { ...user, code, username: code };
    setCurrentUserState(userWithCredentials);
    setIsLoggedIn(true);
    saveSession(code);
    console.log("✅ Connexion réussie:", user.nom);
    return { success: true, user: userWithCredentials };
  };

  // Connexion par email + mot de passe
  const loginByEmail = async (email, password) => {
    console.log("🔐 Connexion par email:", email);
    try {
      const q = query(
        collection(db, "utilisateurs"),
        where("email", "==", email.trim().toLowerCase())
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        return { success: false, message: "Aucun compte associé à cet email" };
      }

      const userDoc = snap.docs[0];
      const user = { ...userDoc.data(), code: userDoc.id };

      if (user.password !== password) {
        return { success: false, message: "Mot de passe incorrect" };
      }

      const userWithCredentials = { ...user, username: user.code };
      setCurrentUserState(userWithCredentials);
      setIsLoggedIn(true);
      saveSession(user.code);

      console.log("✅ Connexion par email réussie:", user.nom);
      return { success: true, user: userWithCredentials };
    } catch (error) {
      console.error("❌ Erreur loginByEmail:", error);
      return { success: false, message: "Erreur de connexion, réessayez" };
    }
  };

  const logout = () => {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUserState(null);
    setIsLoggedIn(false);
    console.log("✅ Déconnexion réussie");
  };

  const setCurrentUser = async (updatedUserData) => {
    setCurrentUserState(updatedUserData);
    if (updatedUserData.code) {
      await updateSolde(updatedUserData.code, updatedUserData.solde);
      const { code, username, ...firestoreData } = updatedUserData;
      await updateUser(updatedUserData.code, firestoreData);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      currentUser,
      setCurrentUser,
      loading,
      login,
      loginByEmail,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);