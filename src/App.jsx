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
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function AppRoutes() {
  const { isLoggedIn, currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!isLoggedIn ? <LoginScreen /> : <Navigate to="/accueil" replace />}
      />

      <Route
        path="/accueil"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <AccountPage currentUser={currentUser} />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/virement"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <VirementPage currentUser={currentUser} />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/decouvert"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <DecouvertPage currentUser={currentUser} />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/cartes"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <CartesPage currentUser={currentUser} />
          </PrivateRoute>
        }
      />

      <Route
        path="/profil"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <ProfilPage currentUser={currentUser} />
          </PrivateRoute>
        }
      />

      <Route
        path="/parametres"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <ParametresPage currentUser={currentUser} />
          </PrivateRoute>
        }
      />

      <Route
        path="/depot"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <DepotPage currentUser={currentUser} />
          </PrivateRoute>
        }
      />

      <Route
            path="*"
            element={<Navigate to={isLoggedIn ?"/accueil": "/login"}replace/>}
            />
      
      
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}