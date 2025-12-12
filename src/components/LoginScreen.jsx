import React, { useState, useEffect } from "react";
import { Check, Info, Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usersDB } from "../services/UserService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [rememberMe, setRememberMe] = useState(false);
  const [step, setStep] = useState("code");
  const [loginCode, setLoginCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    setTimeout(() => {
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
      setIsLoading(false);
    }, 800);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(async () => {
      const result = await login(loginCode, password);

      if (result.success) {
        if (rememberMe) localStorage.setItem("savedLoginCode", loginCode);
        else localStorage.removeItem("savedLoginCode");
        navigate("/accueil");
      } else {
        setError("Mot de passe incorrect");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

     {/* HEADER AVEC LOGO */}
       <div className="bg-white border-b border-gray-200 py-3 px-4">
          <div className="max-w-xl mx-auto flex justify-center">
            <img 
              src="images/logo sg.jpg" 
              alt="Société Générale" 
              className="h-12 object-contain"
            />
          </div>
     </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Connexion - Espace client
          </h1>

          {step === "code" ? (
            // === ÉTAPE 1 : CODE CLIENT ===
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-3">
                  Saisissez votre code client
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    className="w-full px-0 py-3 border-0 border-b-2 border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 text-2xl tracking-wider bg-transparent"
                    placeholder=""
                    maxLength="8"
                    disabled={isLoading}
                  />
                  {loginCode && loginCode.length >= 8 && (
                    <Check size={24} className="absolute right-0 top-1/2 -translate-y-1/2 text-green-600" />
                  )}
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>

              {/* SE SOUVENIR DE MOI */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-8 h-8 rounded-full border-2 border-gray-400 bg-white flex items-center justify-center focus:outline-none focus:border-gray-600"
                  disabled={isLoading}
                >
                  {rememberMe && <div className="w-4 h-4 rounded-full bg-gray-700"></div>}
                </button>
                <span className="text-gray-600 text-base">Se souvenir de moi</span>
                <Info size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>

              {/* BOUTON VALIDER */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-full transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Vérification..." : "Valider"}
              </button>

              {/* TEXTES DU BAS */}
              <div className="mt-12 space-y-3 text-gray-700">
                <h2 className="text-lg font-semibold">Obtenir vos codes</h2>
                <p className="text-sm leading-relaxed">
                  Le code client vous est attribué par un conseiller au moment de l'inscription 
                  au contrat Banque à distance en agence. Lors de l'ouverture de compte en ligne, 
                  le code client vous est envoyé par courrier. Il est également indiqué sur vos 
                  relevés de compte.
                </p>

                <div className="pt-3">
                  <h3 className="font-semibold mb-2 text-sm">Code secret oublié</h3>
                  <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
                    Effectuer une nouvelle demande
                  </a>
                </div>
              </div>
            </form>
          ) : (
            // === ÉTAPE 2 : MOT DE PASSE ===
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-3">
                  Saisissez votre code secret
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-0 py-3 pr-12 border-0 border-b-2 border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-0 text-2xl tracking-wider bg-transparent"
                    placeholder=""
                    maxLength="6"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                </div>

                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>

              {/* BOUTONS */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-full transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Connexion..." : "Valider"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("code")}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-100 text-gray-700 font-semibold text-base py-3 rounded-full transition border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Retour
                </button>
              </div>

              {/* TEXTES DU BAS */}
              <div className="mt-12 space-y-3 text-gray-700">
                <h2 className="text-lg font-semibold">Obtenir votre code secret</h2>
                <p className="text-sm leading-relaxed">
                  Votre code secret est confidentiel. Ne le partagez jamais avec quelqu'un.
                  Si vous l'avez oublié, cliquez sur le lien ci-dessous.
                </p>

                <div className="pt-3">
                  <h3 className="font-semibold mb-2 text-sm">Code secret oublié</h3>
                  <a href="#" className="text-blue-600 underline hover:text-blue-800 text-sm">
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