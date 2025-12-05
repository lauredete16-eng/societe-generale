import React, { useState, useEffect } from "react";
import { Check, Info, Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usersDB } from "../services/UserService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const [step, setStep] = useState("code"); // "code" ou "password"
  const [loginCode, setLoginCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("savedLoginCode");
    if (saved) {
      setLoginCode(saved);
      setRememberMe(true);
    }
  }, []);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (loginCode.length === 8) {
      const user = usersDB[loginCode];
      if (user) {
        setStep("password");
      } else {
        setError("Code d'accès incorrect");
      }
    } else {
      setError("Le code doit contenir 8 chiffres");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const result = login(loginCode, password);

    if (result.success) {
      if (rememberMe) localStorage.setItem("savedLoginCode", loginCode);
      else localStorage.removeItem("savedLoginCode");

      navigate("/accueil"); // ✅ redirection vers la page suivante
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

     {/* HEADER AVEC LOGO */}
       <div className="bg-white border-b border-gray-200 py-4 px-4">
          {/* HEADER AVEC LOGO */}
<div className="bg-white border-b border-gray-200 py-4 px-4">
  <div className="max-w-2xl mx-auto">
    <div className="w-16 h-16 mx-auto relative">
      <div className="w-full h-full rounded-sm flex flex-col overflow-hidden">
        {/* Partie rouge en haut */}
        <div className="w-full h-1/2 bg-red-600"></div>
        {/* Partie noire en bas */}
        <div className="w-full h-1/2 bg-gray-900"></div>
      </div>
      {/* Tiret blanc au milieu (positionné absolument) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-white"></div>
    </div>
  </div>
</div>
     </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-12">
            Connexion - Espace client
          </h1>

          {step === "code" ? (
            // === ÉTAPE 1 : CODE CLIENT ===
            <form onSubmit={handleCodeSubmit} className="space-y-8">
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-4">
                  Saisissez votre code client
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    className="w-full px-0 py-4 border-0 border-b-2 border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 text-3xl tracking-wider bg-transparent"
                    placeholder=""
                    maxLength="8"
                  />
                  {loginCode && loginCode.length >= 6 && (
                    <Check size={32} className="absolute right-0 top-1/2 -translate-y-1/2 text-green-600" />
                  )}
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>

              {/* SE SOUVENIR DE MOI */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-10 h-10 rounded-full border-2 border-gray-400 bg-white flex items-center justify-center focus:outline-none focus:border-gray-600"
                >
                  {rememberMe && <div className="w-5 h-5 rounded-full bg-gray-700"></div>}
                </button>
                <span className="text-gray-600 text-lg">Se souvenir de moi</span>
                <Info size={24} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>

              {/* BOUTON VALIDER */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-5 rounded-full transition shadow-lg"
              >
                Valider
              </button>

              {/* TEXTES DU BAS */}
              <div className="mt-16 space-y-4 text-gray-700">
                <h2 className="text-xl font-semibold">Obtenir vos codes</h2>
                <p className="text-sm leading-relaxed">
                  Le code client vous est attribué par un conseiller au moment de l'inscription 
                  au contrat Banque à distance en agence. Lors de l'ouverture de compte en ligne, 
                  le code client vous est envoyé par courrier. Il est également indiqué sur vos 
                  relevés de compte.
                </p>

                <div className="pt-4">
                  <h3 className="font-semibold mb-2">Code secret oublié</h3>
                  <a href="#" className="text-blue-600 underline hover:text-blue-800">
                    Effectuer une nouvelle demande
                  </a>
                </div>
              </div>
            </form>
          ) : (
            // === ÉTAPE 2 : MOT DE PASSE ===
            <form onSubmit={handlePasswordSubmit} className="space-y-8">
              <div>
                <label className="block text-gray-700 text-lg font-semibold mb-4">
                  Saisissez votre code secret
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-0 py-4 pr-12 border-0 border-b-2 border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 text-3xl tracking-wider bg-transparent"
                    placeholder=""
                    maxLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
                  </button>
                </div>

                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>

              {/* BOUTONS */}
              <div className="space-y-4">
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-5 rounded-full transition shadow-lg"
                >
                  Valider
                </button>

                <button
                  type="button"
                  onClick={() => setStep("code")}
                  className="w-full bg-white hover:bg-gray-100 text-gray-700 font-semibold text-lg py-4 rounded-full transition border-2 border-gray-300"
                >
                  Retour
                </button>
              </div>

              {/* TEXTES DU BAS */}
              <div className="mt-16 space-y-4 text-gray-700">
                <h2 className="text-xl font-semibold">Obtenir votre code secret</h2>
                <p className="text-sm leading-relaxed">
                  Votre code secret est confidentiel. Ne le partagez jamais avec quelqu’un.
                  Si vous l’avez oublié, cliquez sur le lien ci-dessous.
                </p>

                <div className="pt-4">
                  <h3 className="font-semibold mb-2">Code secret oublié</h3>
                  <a href="#" className="text-blue-600 underline hover:text-blue-800">
                    Effectuer une nouvelle demande
                  </a>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
  </div>
);
}
