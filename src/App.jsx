import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import AccountPage from "./components/AccountPage";
import ProfilPage from "./components/ProfilPage";
import VirementPage from "./components/VirementPage";

import DecouvertPage from "./components/DecouvertPage";
import CartesPage from "./components/CartesPage";
import ParametresPage from "./components/ParametresPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function AppRoutes() {
  const { isLoggedIn, currentUser } = useAuth();

  return (
    <Routes>
      {/* Page login */}
      <Route
        path="/login"
        element={!isLoggedIn ? <LoginScreen /> : <Navigate to="/accueil" />}
      />

      {/* Pages protégées */}
      <Route
        path="/accueil"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <AccountPage currentUser={currentUser} />
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
        path="/parametres"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <ParametresPage currentUser={currentUser} />
          </PrivateRoute>
        }
      />

      {/* Redirections par défaut */}
      <Route path="/" element={<Navigate to={isLoggedIn ? "/accueil" : "/login"} />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/accueil" : "/login"} />} />
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
