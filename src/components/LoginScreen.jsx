
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Info,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase.js";

export default function LoginScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const isInscription = location.pathname === "/inscription";

  const [identifiant, setIdentifiant] = useState("");
  const [codeSecret, setCodeSecret] = useState("");
  const [step, setStep] = useState(1);
  const [showCode, setShowCode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [pays, setPays] = useState("");
  const [ville, setVille] = useState("");
  const [numero, setNumero] = useState("");

  const [inscriptionTerminee, setInscriptionTerminee] = useState(false);
  const [nouvelIdentifiant, setNouvelIdentifiant] = useState("");
  const [nouveauCode, setNouveauCode] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const genererIdentifiant = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const genererCodeSecret = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const ouvrirInscription = () => {
    setError("");
    navigate("/inscription");
  };

  const retournerConnexion = () => {
    setError("");
    navigate("/login");
  };

  const handleIdentifiantSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!identifiant.trim()) {
      setError("Veuillez saisir votre identifiant.");
      return;
    }

    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setCodeSecret("");
    setError("");
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!codeSecret.trim()) {
      setError("Veuillez saisir votre code secret.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        identifiant.trim(),
        codeSecret.trim(),
        rememberMe
      );

      if (!result?.success) {
        setError(result?.message || "Identifiant ou code secret incorrect.");
        return;
      }

      navigate("/accueil");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleInscription = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !nom.trim() ||
      !prenom.trim() ||
      !pays.trim() ||
      !ville.trim() ||
      !numero.trim()
    ) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      const usersRef = collection(db, "users");

      const phoneQuery = query(
        usersRef,
        where("telephone", "==", numero.trim())
      );

      const phoneSnapshot = await getDocs(phoneQuery);

      if (!phoneSnapshot.empty) {
        setError("Ce numéro de téléphone est déjà utilisé.");
        return;
      }

      let nouvelId = genererIdentifiant();
      let idExiste = true;

      while (idExiste) {
        const idQuery = query(
          usersRef,
          where("identifiant", "==", nouvelId)
        );

        const idSnapshot = await getDocs(idQuery);

        if (idSnapshot.empty) {
          idExiste = false;
        } else {
          nouvelId = genererIdentifiant();
        }
      }

      const nouveauCodeSecret = genererCodeSecret();

      const nouvelUtilisateur = {
        nom: nom.trim(),
        prenom: prenom.trim(),
        identifiant: nouvelId,
        codeSecret: nouveauCodeSecret,
        pays: pays.trim(),
        ville: ville.trim(),
        telephone: numero.trim(),
        email: "",
        solde: 0,
        devise: "$",
        compteBloque: false,
        comptes: {
          courant: {
            montant: 0,
          },
        },
        transactions: [],
        virements: [],
        notifications: [],
        createdAt: serverTimestamp(),
      };

      await addDoc(usersRef, nouvelUtilisateur);

      setNouvelIdentifiant(nouvelId);
      setNouveauCode(nouveauCodeSecret);
      setInscriptionTerminee(true);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de créer le compte. Vérifiez votre connexion puis réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isInscription) {
    return (
      <div className="min-h-screen bg-white flex flex-col">

        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-black">
                BG
              </div>

              <img
                src="/images/logo sg.jpg"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />
            </div>

            <button
              type="button"
              onClick={retournerConnexion}
              className="text-sm font-semibold text-gray-700 hover:underline"
            >
              Se connecter
            </button>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-xl mx-auto px-5 py-12">

            {!inscriptionTerminee ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Ouvrir un compte
                </h1>

                <p className="text-gray-600 mb-8">
                  Remplissez les informations demandées pour créer votre espace.
                </p>

                <form onSubmit={handleInscription} className="space-y-5">

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Nom
                    </label>

                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Prénom
                    </label>

                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                      placeholder="Votre prénom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Pays
                    </label>

                    <input
                      type="text"
                      value={pays}
                      onChange={(e) => setPays(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                      placeholder="Votre pays"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Ville
                    </label>

                    <input
                      type="text"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                      placeholder="Votre ville"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Numéro de téléphone
                    </label>

                    <input
                      type="tel"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                      placeholder="Votre numéro"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg disabled:opacity-50"
                  >
                    {loading ? "Création..." : "Créer mon compte"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">

                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-5" />

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Votre compte est créé
                </h1>

                <p className="text-gray-600 mb-8">
                  Conservez précieusement vos identifiants de connexion.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left space-y-4 mb-8">
                  <div>
                    <p className="text-sm text-gray-500">
                      Identifiant client
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {nouvelIdentifiant}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Code secret
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {nouveauCode}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={retournerConnexion}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg"
                >
                  Se connecter
                </button>
              </div>
            )}
          </div>
        </main>

        <section className="bg-black text-white">
          <div className="max-w-3xl mx-auto px-5 py-12">
            <div className="space-y-10">

              <div>
                <h2 className="text-xl font-bold mb-5">
                  Questions fréquentes
                </h2>

                <button
                  type="button"
                  className="text-white font-semibold hover:underline text-left"
                >
                  Consulter les questions fréquentes
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="text-white font-semibold hover:underline text-left"
                >
                  Trouver une agence
                </button>
              </div>

            </div>
          </div>
        </section>

        <footer className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-5 py-8">

            <div className="flex items-center gap-3 mb-8">
              <img
                src="/images/logo sg.jpg"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />

              <span className="text-xl font-bold text-gray-800">
                Société Générale
              </span>
            </div>

            <div className="flex flex-col gap-4 text-sm text-gray-600">
              <button type="button" className="text-left hover:underline">
                Accueil
              </button>

              <button type="button" className="text-left hover:underline">
                Sécurité
              </button>

              <button type="button" className="text-left hover:underline">
                Gestion des Cookies
              </button>

              <button type="button" className="text-left hover:underline">
                Données personnelles
              </button>

              <button type="button" className="text-left hover:underline">
                Documentation et Tarifs
              </button>

              <button type="button" className="text-left hover:underline">
                Informations légales
              </button>

              <button type="button" className="text-left hover:underline">
                Accessibilité numérique
              </button>
            </div>

          </div>
        </footer>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-black">
              BG
            </div>

            <img
              src="/images/logo sg.jpg"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </div>

          <button
            type="button"
            onClick={ouvrirInscription}
            className="text-sm font-semibold text-gray-700 hover:underline"
          >
            Ouvrir un compte
          </button>

        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-xl mx-auto px-5 py-12">

          <h1 className="text-xl font-bold text-gray-700 mb-3">
            connexion à votre Espace Client Particuliers
          </h1>

          

          {step === 1 ? (
            <form onSubmit={handleIdentifiantSubmit}>

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Saisissez votre identifiant client
              </label>

              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={identifiant}
                  onChange={(e) =>
                    setIdentifiant(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Identifiant client"
                />

                <Info className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>

              {/* SE SOUVENIR DE MOI */}
              <div className="flex items-center justify-between mt-5">

                <span className="text-sm text-gray-700">
                  Se souvenir de moi
                </span>

                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    rememberMe
                      ? "bg-red-600"
                      : "bg-gray-300"
                  }`}
                  aria-label="Se souvenir de moi"
                  aria-pressed={rememberMe}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      rememberMe
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>

              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mt-5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg mt-6"
              >
                Valider
              </button>

            </form>
          ) : (
            <form onSubmit={handleCodeSubmit}>

              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-gray-700 hover:underline mb-7"
              >
                <ArrowLeft className="w-4 h-4" />
                Modifier mon identifiant
              </button>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500">
                  Identifiant
                </p>

                <p className="font-bold text-gray-900">
                  {identifiant}
                </p>
              </div>

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Saisissez votre code secret
              </label>

              <div className="relative">
                <input
                  type={showCode ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={6}
                  value={codeSecret}
                  onChange={(e) =>
                    setCodeSecret(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:border-red-600"
                  placeholder="Code secret"
                />

                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-4 top-3.5 text-gray-500"
                >
                  {showCode ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mt-5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg mt-6 disabled:opacity-50"
              >
                {loading
                  ? "Connexion..."
                  : "Accéder à mon espace"}
              </button>

            </form>
          )}

          <div className="mt-12 space-y-8">

            <div>
              <h2 className="font-bold text-gray-700 mb-3">
                Où trouver mon Identifiant Client ?
              </h2>

              <h3 className="text-sm text-gray-600 font-semibold">
  Votre Identifiant Client vous a été communiqué lors de la souscription à la Banque à Distance. Il est également indiqué sur vos relevés de comptes.
</h3>
            </div>

            <div>
              <h2 className="font-bold text-gray-700 mb-3">
                Identifiant Client ou Code Secret inconnus ?
              </h2>

              <div className="flex flex-col gap-3">

                <button
                  type="button"
                  className="text-left text-sm text-gray-600 font-semibold hover:underline"
                >
                  Je souhaite obtenir mon Identifiant Client
                </button>

                <button
                  type="button"
                  className="text-left text-sm text-gray-600 font-semibold hover:underline"
                >
                  Je ne connais pas mon Code Secret
                </button>

              </div>
            </div>

            <div>
              <h2 className="font-bold text-gray-700 mb-3">
                Nos autres Espaces Client
              </h2>

              <div className="flex flex-col gap-3">

                <button
                  type="button"
                  className="text-left text-sm text-gray-600 font-semibold hover:underline"
                >
                  Espace Client Professionnels
                </button>

                <button
                  type="button"
                  className="text-left text-sm text-gray-600 font-semibold hover:underline"
                >
                  Espace Client Entreprises
                </button>

              </div>
            </div>

            <div>
              <h2 className="font-bold text-gray-700 mb-3">
                Liens utiles
              </h2>

              <div className="flex flex-col gap-3">

                <button
                  type="button"
                  className="text-left text-sm text-gray-600 font-semibold hover:underline"
                >
                  Urgences carte bancaire
                </button>

                <button
                  type="button"
                  className="text-left text-sm text-gray-600 font-semibold hover:underline"
                >
                  Faire opposition à votre carte bancaire
                </button>

                <button
                  type="button"
                  className="text-left text-sm text-gray-600 font-semibold hover:underline"
                >
                  Verrouiller votre carte bancaire
                </button>

              </div>
            </div>

          </div>
        </div>
      </main>

      <section className="bg-black text-white">
        <div className="max-w-3xl mx-auto px-5 py-12">

          <div className="space-y-10">

            <div>
              <h2 className="text-xl font-bold mb-5">
                Questions fréquentes
              </h2>

              <button
                type="button"
                className="text-white font-semibold hover:underline text-left"
              >
                Consulter les questions fréquentes
              </button>
            </div>

            <div>
              <button
                type="button"
                className="text-white font-semibold hover:underline text-left"
              >
                Trouver une agence
              </button>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-5 py-8">

          <div className="flex items-center gap-3 mb-8">

            <img
              src="/images/logo sg.jpg"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />

            <span className="text-xl font-bold text-gray-800">
              Société Générale
            </span>

          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-600">

            

            <button
              type="button"
              className="text-left hover:underline"
            >
              Sécurité
            </button>

            <button
              type="button"
              className="text-left hover:underline"
            >
              Gestion des Cookies
            </button>

            <button
              type="button"
              className="text-left hover:underline"
            >
              Données personnelles
            </button>

            <button
              type="button"
              className="text-left hover:underline"
            >
              Documentation et Tarifs
            </button>

            <button
              type="button"
              className="text-left hover:underline"
            >
              Informations légales
            </button>

            <button
              type="button"
              className="text-left hover:underline"
            >
              Accessibilité numérique
            </button>

          </div>

        </div>
      </footer>

    </div>
  );
}

