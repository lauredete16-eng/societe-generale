// AuthContext.jsx - FIREBASE + IDENTIFIANT CLIENT

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  getUser,
  loginUser,
  updateSolde,
  updateUser,
} from "../services/UserService.js";

export const AuthContext = createContext();

const USER_STORAGE_KEY = "user:current";

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  // ─────────────────────────────────────────────
  // RESTAURER LA SESSION
  // ─────────────────────────────────────────────
  const loadCurrentUser = async () => {
    try {
      const data = sessionStorage.getItem(USER_STORAGE_KEY);

      if (!data) {
        setLoading(false);
        return;
      }

      const { code } = JSON.parse(data);

      if (!code) {
        sessionStorage.removeItem(USER_STORAGE_KEY);
        setLoading(false);
        return;
      }

      const freshUser = await getUser(code);

      if (freshUser) {
        const userWithCredentials = {
          ...freshUser,
          code,
          username: code,
        };

        setCurrentUserState(userWithCredentials);
        setIsLoggedIn(true);

        console.log("✅ Session restaurée :", code);
      } else {
        sessionStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error("❌ Erreur restauration session :", error);
      sessionStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // SAUVEGARDER LA SESSION
  // ─────────────────────────────────────────────
  const saveSession = (code) => {
    try {
      sessionStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify({ code })
      );
    } catch (error) {
      console.error("❌ Erreur sauvegarde session :", error);
    }
  };

  // ─────────────────────────────────────────────
  // CONNEXION IDENTIFIANT CLIENT + CODE SECRET
  // ─────────────────────────────────────────────
  const login = async (code, password) => {
    try {
      const clientCode = String(code || "").trim();
      const secret = String(password || "");

      if (!clientCode || !secret) {
        return {
          success: false,
          message:
            "Veuillez saisir votre Identifiant Client et votre Code Secret.",
        };
      }

      console.log(
        "🔐 Connexion avec Identifiant Client :",
        clientCode
      );

      const user = await loginUser(clientCode, secret);

      if (!user) {
        return {
          success: false,
          message:
            "Identifiant Client ou Code Secret incorrect.",
        };
      }

      const userWithCredentials = {
        ...user,
        code: clientCode,
        username: clientCode,
      };

      setCurrentUserState(userWithCredentials);
      setIsLoggedIn(true);

      saveSession(clientCode);

      console.log("✅ Connexion réussie :", clientCode);

      return {
        success: true,
        user: userWithCredentials,
      };
    } catch (error) {
      console.error("❌ Erreur connexion :", error);

      return {
        success: false,
        message:
          "Erreur lors de la connexion. Veuillez réessayer.",
      };
    }
  };

  // ─────────────────────────────────────────────
  // DÉCONNEXION
  // ─────────────────────────────────────────────
  const logout = () => {
    sessionStorage.removeItem(USER_STORAGE_KEY);

    setCurrentUserState(null);
    setIsLoggedIn(false);

    console.log("✅ Déconnexion réussie");
  };

  // ─────────────────────────────────────────────
  // MODIFIER L'UTILISATEUR
  // ─────────────────────────────────────────────
  const setCurrentUser = async (updatedUserData) => {
    try {
      setCurrentUserState(updatedUserData);

      if (!updatedUserData?.code) {
        return;
      }

      if (
        updatedUserData.solde !== undefined &&
        updatedUserData.solde !== null
      ) {
        await updateSolde(
          updatedUserData.code,
          updatedUserData.solde
        );
      }

      const {
        code,
        username,
        ...firestoreData
      } = updatedUserData;

      await updateUser(
        updatedUserData.code,
        firestoreData
      );

      saveSession(updatedUserData.code);
    } catch (error) {
      console.error(
        "❌ Erreur mise à jour utilisateur :",
        error
      );
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);