import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
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
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function AppRoutes() {
  const { isLoggedIn, loading, currentUser } = useAuth();

  console.log('');
  console.log('🎬 ========================================');
  console.log('🎬 AppRoutes RENDER');
  console.log('🎬 ========================================');
  console.log('📊 État actuel:', {
    loading,
    isLoggedIn,
    hasUser: !!currentUser,
    userName: currentUser?.nom
  });
  console.log('🎬 ========================================');
  console.log('');

  if (loading) {
    console.log('⏳ Affichage écran de chargement...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>Chargement...</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          (Ouvre la console F12 pour voir les logs)
        </div>
      </div>
    );
  }

  console.log('✅ Chargement terminé, affichage des routes');
  console.log('🔀 isLoggedIn =', isLoggedIn);
  console.log('🔀 Redirection vers:', isLoggedIn ? '/accueil' : '/login');

  return (
    <Routes>
      <Route
        path="/login"
        element={!isLoggedIn ? <LoginScreen /> : <Navigate to="/accueil" replace />}
      />

      <Route
        path="/accueil"
        element={
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/virement"
        element={
          <PrivateRoute>
            <VirementPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/decouvert"
        element={
          <PrivateRoute>
            <DecouvertPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/cartes"
        element={
          <PrivateRoute>
            <CartesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/assurances"
        element={
          <PrivateRoute>
            <AssurancesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/conditions-tarifaires"
        element={
          <PrivateRoute>
            <ConditionsTarifaires />
          </PrivateRoute>
        }
      />

      <Route
        path="/profil"
        element={
          <PrivateRoute>
            <ProfilPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/parametres"
        element={
          <PrivateRoute>
            <ParametresPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/depot"
        element={
          <PrivateRoute>
            <DepotPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/vue-ensemble"
        element={
          <PrivateRoute>
            <VueEnsemblePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/rib"
        element={
          <PrivateRoute>
            <RibPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/historique"
        element={
          <PrivateRoute>
            <HistoriquePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/releve"
        element={
          <PrivateRoute>
            <RelevePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/securite"
        element={
          <PrivateRoute>
            <SecuritePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/conseiller"
        element={
          <PrivateRoute>
            <ConseillerPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/faq"
        element={
          <PrivateRoute>
            <FaqPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/agences"
        element={
          <PrivateRoute>
            <AgencesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/accueil" : "/login"} replace />}
      />
    </Routes>
  );
}

export default function App() {
  console.log('🚀 ========================================');
  console.log('🚀 App.jsx RENDER');
  console.log('🚀 ========================================');
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}