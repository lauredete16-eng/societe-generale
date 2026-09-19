import React, { useState } from "react";
import { Check, Eye, EyeOff, Mail, Phone, MapPin, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDBVersion } from "../services/UserService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase.js";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

// ─── Helpers ─────────────────────────────────────────────────
const genererCodeClient = async () => {
  let code;
  let existe = true;
  while (existe) {
    code = Math.floor(10000000 + Math.random() * 90000000).toString();
    const snap = await getDoc(doc(db, "utilisateurs", code));
    existe = snap.exists();
  }
  return code;
};

const genererIBAN = () => {
  const num = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
  return `FR76 3000 6000 0${num.toString().slice(0, 15).replace(/(.{4})/g, "$1 ").trim()}`;
};

const genererCarte = () => Math.floor(1000 + Math.random() * 9000).toString();

// ─── Composant principal ──────────────────────────────────────
export default function LoginScreen() {
  const navigate = useNavigate();
  const { loginByEmail } = useAuth();

  const [mode, setMode] = useState("login");

  // Connexion
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Inscription
  const [registerStep, setRegisterStep] = useState(1);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerForm, setRegisterForm] = useState({
    prenom: "", nom: "", email: "", telephone: "",
    adresse: "", ville: "", codePostal: "", pays: "France",
    password: "", confirmPassword: "",
  });

  const inputClass = "w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-0 text-base bg-transparent transition-colors";
  const labelClass = "block text-gray-600 text-sm font-medium mb-1";

  // ═══════════════════════════════════════════════════════════
  // CONNEXION
  // ═══════════════════════════════════════════════════════════
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Veuillez remplir tous les champs"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Adresse email invalide"); return; }

    setIsLoading(true);
    try {
      const result = await loginByEmail(email, password);
      if (result.success) {
        navigate("/accueil");
      } else {
        setError(result.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur lors de la connexion. Réessayez.");
    }
    setIsLoading(false);
  };

  // ═══════════════════════════════════════════════════════════
  // INSCRIPTION
  // ═══════════════════════════════════════════════════════════
  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    setRegisterError("");
  };

  const handleRegisterStep1 = (e) => {
    e.preventDefault();
    setRegisterError("");
    const { prenom, nom, email: regEmail, telephone, adresse, ville, codePostal } = registerForm;
    if (!prenom || !nom || !regEmail || !telephone || !adresse || !ville || !codePostal) {
      setRegisterError("Veuillez remplir tous les champs obligatoires"); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setRegisterError("Adresse email invalide"); return;
    }
    setRegisterStep(2);
  };

  const handleRegisterStep2 = async (e) => {
    e.preventDefault();
    setRegisterError("");
    const { password: pwd, confirmPassword } = registerForm;
    if (pwd.length < 4) { setRegisterError("Le mot de passe doit contenir au moins 4 caractères"); return; }
    if (pwd !== confirmPassword) { setRegisterError("Les mots de passe ne correspondent pas"); return; }

    setIsLoading(true);
    try {
      // Vérifier email non déjà utilisé
      const q = query(collection(db, "utilisateurs"), where("email", "==", registerForm.email.trim().toLowerCase()));
      const snap = await getDocs(q);
      if (!snap.empty) { setRegisterError("Un compte existe déjà avec cet email"); setIsLoading(false); return; }

      // Créer le compte directement
      const code = await genererCodeClient();
      const iban = genererIBAN();
      const carte = genererCarte();

      await setDoc(doc(db, "utilisateurs", code), {
        code,
        nom: `${registerForm.nom.toUpperCase()} ${registerForm.prenom}`,
        prenom: registerForm.prenom,
        nomFamille: registerForm.nom,
        email: registerForm.email.trim().toLowerCase(),
        telephone: registerForm.telephone,
        adresse: `${registerForm.adresse}, ${registerForm.codePostal} ${registerForm.ville}`,
        ville: registerForm.ville,
        codePostal: registerForm.codePostal,
        pays: registerForm.pays,
        numeroCompte: iban,
        solde: 0.0,
        carte,
        numeroComplet: `${carte} 0000 0000 0000`,
        exp: "12/28",
        decouvertAutorise: 0,
        decouvertUtilise: 0,
        compteBloque: false,
        notifications: 0,
        password: registerForm.password,
        montantDeblocage: 0,
        dateCreation: new Date().toISOString(),
      });

      console.log("✅ Compte créé:", code);
      setRegisterStep(3); // → succès
    } catch (err) {
      setRegisterError("Erreur. Réessayez.");
    }
    setIsLoading(false);
  };

  const handleLoginAfterRegister = async () => {
    const result = await loginByEmail(registerForm.email, registerForm.password);
    if (result.success) navigate("/accueil");
  };

  const resetToLogin = () => {
    setMode("login");
    setRegisterStep(1);
    setRegisterError("");
    setRegisterForm({
      prenom: "", nom: "", email: "", telephone: "",
      adresse: "", ville: "", codePostal: "", pays: "France",
      password: "", confirmPassword: "",
    });
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="max-w-xl mx-auto flex justify-center">
          <img src="images/logo sg.jpg" alt="Société Générale" className="h-12 object-contain" />
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-xl mx-auto">

          {/* ── CONNEXION ── */}
          {mode === "login" && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
              <p className="text-gray-500 text-sm mb-8">Accédez à votre espace client</p>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className={labelClass}>Adresse email</label>
                  <div className="relative">
                    <input type="email" value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className={inputClass} placeholder="votre@email.com"
                      disabled={isLoading} autoComplete="email" />
                    <Mail size={18} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mot de passe</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className={inputClass + " pr-10"} placeholder="••••••"
                      disabled={isLoading} autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <a href="#" className="text-red-600 text-sm hover:underline">Mot de passe oublié ?</a>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-full transition shadow-lg disabled:opacity-50">
                  {isLoading ? "Vérification..." : "Se connecter"}
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-gray-400 text-sm">ou</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <button type="button" onClick={() => setMode("register")}
                  className="w-full bg-white hover:bg-gray-50 text-red-600 font-bold text-base py-4 rounded-full transition border-2 border-red-600">
                  Ouvrir mon compte
                </button>
              </form>
            </>
          )}

          {/* ── INSCRIPTION ── */}
          {mode === "register" && (
            <>
              {/* Header */}
              {registerStep < 3 && (
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => registerStep === 1 ? resetToLogin() : setRegisterStep(1)}
                    className="p-2 rounded-full hover:bg-gray-200 transition">
                    <ArrowLeft size={22} className="text-gray-700" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ouvrir un compte</h1>
                    <p className="text-sm text-gray-500">Étape {registerStep} sur 2</p>
                  </div>
                </div>
              )}

              {/* Barre de progression */}
              {registerStep < 3 && (
                <div className="flex gap-2 mb-8">
                  <div className={`h-1 flex-1 rounded-full transition-colors ${registerStep >= 1 ? "bg-red-600" : "bg-gray-200"}`}></div>
                  <div className={`h-1 flex-1 rounded-full transition-colors ${registerStep >= 2 ? "bg-red-600" : "bg-gray-200"}`}></div>
                </div>
              )}

              {/* ÉTAPE 1 : Infos personnelles */}
              {registerStep === 1 && (
                <form onSubmit={handleRegisterStep1} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Prénom *</label>
                      <input name="prenom" value={registerForm.prenom} onChange={handleRegisterChange}
                        className={inputClass} placeholder="Jean" />
                    </div>
                    <div>
                      <label className={labelClass}>Nom *</label>
                      <input name="nom" value={registerForm.nom} onChange={handleRegisterChange}
                        className={inputClass} placeholder="Dupont" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Adresse email *</label>
                    <div className="relative">
                      <input name="email" type="email" value={registerForm.email} onChange={handleRegisterChange}
                        className={inputClass} placeholder="jean.dupont@email.com" />
                      <Mail size={18} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Téléphone *</label>
                    <div className="relative">
                      <input name="telephone" type="tel" value={registerForm.telephone} onChange={handleRegisterChange}
                        className={inputClass} placeholder="+33 6 00 00 00 00" />
                      <Phone size={18} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Adresse *</label>
                    <div className="relative">
                      <input name="adresse" value={registerForm.adresse} onChange={handleRegisterChange}
                        className={inputClass} placeholder="12 Rue de la Paix" />
                      <MapPin size={18} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Code postal *</label>
                      <input name="codePostal" value={registerForm.codePostal} onChange={handleRegisterChange}
                        className={inputClass} placeholder="75001" maxLength="10" />
                    </div>
                    <div>
                      <label className={labelClass}>Ville *</label>
                      <input name="ville" value={registerForm.ville} onChange={handleRegisterChange}
                        className={inputClass} placeholder="Paris" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Pays</label>
                    <select name="pays" value={registerForm.pays} onChange={handleRegisterChange}
                      className={inputClass + " cursor-pointer"}>
                      <option>France</option><option>Belgique</option><option>Suisse</option>
                      <option>Luxembourg</option><option>Côte d'Ivoire</option><option>Sénégal</option>
                      <option>Maroc</option><option>Algérie</option><option>Tunisie</option>
                      <option>Cameroun</option><option>Mali</option><option>Autre</option>
                    </select>
                  </div>
                  {registerError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{registerError}</p>
                    </div>
                  )}
                  <button type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-full transition shadow-lg mt-4">
                    Continuer
                  </button>
                </form>
              )}

              {/* ÉTAPE 2 : Mot de passe */}
              {registerStep === 2 && (
                <form onSubmit={handleRegisterStep2} className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
                    <div className="flex items-start gap-3">
                      <Lock size={20} className="text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-blue-800 font-semibold text-sm">Choisissez votre mot de passe</p>
                        <p className="text-blue-600 text-xs mt-1">Minimum 4 caractères.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Mail size={18} className="text-gray-500 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Connexion avec</p>
                      <p className="text-sm font-semibold text-gray-800">{registerForm.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Mot de passe *</label>
                    <div className="relative">
                      <input name="password" type={showRegisterPassword ? "text" : "password"}
                        value={registerForm.password} onChange={handleRegisterChange}
                        className={inputClass + " pr-10"} placeholder="••••••" minLength="4" />
                      <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500">
                        {showRegisterPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Confirmer le mot de passe *</label>
                    <div className="relative">
                      <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                        value={registerForm.confirmPassword} onChange={handleRegisterChange}
                        className={inputClass + " pr-10"} placeholder="••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500">
                        {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                    {registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword && (
                      <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                        <Check size={16} /> Mots de passe identiques
                      </p>
                    )}
                  </div>
                  {registerError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{registerError}</p>
                    </div>
                  )}
                  <button type="submit" disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-full transition shadow-lg disabled:opacity-50">
                    {isLoading ? "Création en cours..." : "Créer mon compte"}
                  </button>
                </form>
              )}

              {/* ÉTAPE 3 : Succès */}
              {registerStep === 3 && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Compte créé !</h2>
                  <p className="text-gray-600 mb-8">
                    Bienvenue chez Société Générale,<br />
                    <span className="font-semibold">{registerForm.prenom} {registerForm.nom}</span>
                  </p>
                  <div className="bg-gray-900 rounded-2xl p-6 mb-8 text-left space-y-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Votre email de connexion</p>
                      <p className="text-white font-semibold">{registerForm.email}</p>
                    </div>
                    <div className="h-px bg-gray-700"></div>
                    <div className="bg-yellow-500 rounded-lg p-3">
                      <p className="text-gray-900 text-xs font-semibold">
                        ✅ Connectez-vous avec votre email et votre mot de passe.
                      </p>
                    </div>
                  </div>
                  <button onClick={handleLoginAfterRegister}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-full transition shadow-lg mb-4">
                    Accéder à mon compte
                  </button>
                  <button onClick={resetToLogin}
                    className="w-full bg-white hover:bg-gray-100 text-gray-700 font-semibold text-base py-3 rounded-full transition border-2 border-gray-300">
                    Retour à la connexion
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <div className="fixed bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
        v{getDBVersion()}
      </div>
    </div>
  );
}