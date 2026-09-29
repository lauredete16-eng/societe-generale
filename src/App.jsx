// App.jsx

import React, { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginScreen from "./components/LoginScreen";
import HomePage from "./components/HomePage";
import AccountPage from "./components/AccountPage";
import VirementPage from "./components/VirementPage";
import DecouvertPage from "./components/DecouvertPage";
import CartesPage from "./components/CartesPage";
import ProfilPage from "./components/ProfilPage";
import ParametresPage from "./components/ParametresPage";
import DepotPage from "./components/DepotPage";
import VueEnsemblePage from "./components/VueEnsemblePage";
import RibPage from "./components/RibPage";
import HistoriquePage from "./components/HistoriquePage";
import RelevePage from "./components/RelevePage";
import NotificationsPage from "./components/NotificationsPage";
import SecuritePage from "./components/SecuritePage";
import ConseillerPage from "./components/ConseillerPage";
import FaqPage from "./components/FaqPage";
import AgencesPage from "./components/AgencesPage";
import AssurancesPage from "./pages/AssurancesPage";
import ConditionsTarifaires from "./pages/ConditionsTarifaires";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import PrivateRoute from "./components/PrivateRoute";

import {
  initialiserUtilisateurs,
} from "./services/UserService";

// =====================================================
// ROUTES
// =====================================================

function AppRoutes() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <Routes>

      {/* ACCUEIL */}
      <Route
        path="/"
        element={
          !isLoggedIn ? (
            <HomePage />
          ) : (
            <Navigate
              to="/accueil"
              replace
            />
          )
        }
      />

      {/* CONNEXION */}
      <Route
        path="/login"
        element={
          !isLoggedIn ? (
            <LoginScreen />
          ) : (
            <Navigate
              to="/accueil"
              replace
            />
          )
        }
      />

      {/* INSCRIPTION */}
      <Route
        path="/inscription"
        element={
          !isLoggedIn ? (
            <LoginScreen />
          ) : (
            <Navigate
              to="/accueil"
              replace
            />
          )
        }
      />

      {/* ACCUEIL DU COMPTE */}
      <Route
        path="/accueil"
        element={
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        }
      />

      {/* VIREMENT */}
      <Route
        path="/virement"
        element={
          <PrivateRoute>
            <VirementPage />
          </PrivateRoute>
        }
      />

      {/* DÉCOUVERT */}
      <Route
        path="/decouvert"
        element={
          <PrivateRoute>
            <DecouvertPage />
          </PrivateRoute>
        }
      />

      {/* CARTES */}
      <Route
        path="/cartes"
        element={
          <PrivateRoute>
            <CartesPage />
          </PrivateRoute>
        }
      />

      {/* ASSURANCES */}
      <Route
        path="/assurances"
        element={
          <PrivateRoute>
            <AssurancesPage />
          </PrivateRoute>
        }
      />

      {/* CONDITIONS TARIFAIRES */}
      <Route
        path="/conditions-tarifaires"
        element={
          <PrivateRoute>
            <ConditionsTarifaires />
          </PrivateRoute>
        }
      />

      {/* PROFIL */}
      <Route
        path="/profil"
        element={
          <PrivateRoute>
            <ProfilPage />
          </PrivateRoute>
        }
      />

      {/* PARAMÈTRES */}
      <Route
        path="/parametres"
        element={
          <PrivateRoute>
            <ParametresPage />
          </PrivateRoute>
        }
      />

      {/* DÉPÔT */}
      <Route
        path="/depot"
        element={
          <PrivateRoute>
            <DepotPage />
          </PrivateRoute>
        }
      />

      {/* VUE D'ENSEMBLE */}
      <Route
        path="/vue-ensemble"
        element={
          <PrivateRoute>
            <VueEnsemblePage />
          </PrivateRoute>
        }
      />

      {/* RIB */}
      <Route
        path="/rib"
        element={
          <PrivateRoute>
            <RibPage />
          </PrivateRoute>
        }
      />

      {/* HISTORIQUE */}
      <Route
        path="/historique"
        element={
          <PrivateRoute>
            <HistoriquePage />
          </PrivateRoute>
        }
      />

      {/* RELEVÉ */}
      <Route
        path="/releve"
        element={
          <PrivateRoute>
            <RelevePage />
          </PrivateRoute>
        }
      />

      {/* NOTIFICATIONS */}
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      {/* SÉCURITÉ */}
      <Route
        path="/securite"
        element={
          <PrivateRoute>
            <SecuritePage />
          </PrivateRoute>
        }
      />

      {/* CONSEILLER */}
      <Route
        path="/conseiller"
        element={
          <PrivateRoute>
            <ConseillerPage />
          </PrivateRoute>
        }
      />

      {/* FAQ */}
      <Route
        path="/faq"
        element={
          <PrivateRoute>
            <FaqPage />
          </PrivateRoute>
        }
      />

      {/* AGENCES */}
      <Route
        path="/agences"
        element={
          <PrivateRoute>
            <AgencesPage />
          </PrivateRoute>
        }
      />

      {/* ROUTE INCONNUE */}
      <Route
        path="*"
        element={
          <Navigate
            to={isLoggedIn ? "/accueil" : "/"}
            replace
          />
        }
      />

    </Routes>
  );
}

// =====================================================
// APPLICATION
// =====================================================

export default function App() {
  useEffect(() => {
    initialiserUtilisateurs()
      .then((success) => {
        if (success) {
          console.log("🔥 Firestore initialisé !");
        } else {
          console.error(
            "❌ Échec de l'initialisation Firestore."
          );
        }
      })
      .catch((error) => {
        console.error(
          "❌ Erreur initialisation Firestore :",
          error
        );
      });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}