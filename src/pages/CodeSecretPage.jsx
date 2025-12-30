import React, { useState } from "react";
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Check, X } from "lucide-react";

const USERS_STORAGE_KEY = 'users:database';
const USER_STORAGE_KEY = 'user:current';

export default function CodeSecretPage({ currentUser, setCurrentUser, navigateTo }) {
  const [showCode, setShowCode] = useState(false);
  const [isChangingCode, setIsChangingCode] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangeCode = () => {
    setError("");
    setSuccess("");

    // DEBUG: Afficher les valeurs
    console.log('🔍 DEBUG COMPARAISON:');
    console.log('  - Code saisi:', currentCode, '(type:', typeof currentCode, ')');
    console.log('  - Code stocké:', currentUser?.password, '(type:', typeof currentUser?.password, ')');
    console.log('  - Égalité stricte:', currentCode === currentUser?.password);
    console.log('  - CurrentUser complet:', currentUser);

    // Vérifications
    if (currentCode !== currentUser?.password) {
      setError("Le code secret actuel est incorrect");
      return;
    }

    if (newCode.length !== 6 || !/^\d+$/.test(newCode)) {
      setError("Le nouveau code doit contenir exactement 6 chiffres");
      return;
    }

    if (newCode !== confirmCode) {
      setError("Les deux nouveaux codes ne correspondent pas");
      return;
    }

    if (newCode === currentCode) {
      setError("Le nouveau code doit être différent de l'ancien");
      return;
    }

    try {
      console.log('🔄 Début de la modification du code...');
      console.log('👤 Utilisateur actuel:', currentUser);
      
      // Vérifier que currentUser existe
      if (!currentUser) {
        throw new Error("Utilisateur non connecté");
      }

      // Trouver le code utilisateur (username ou identifiant)
      const userCode = currentUser.username || currentUser.identifiant || null;
      console.log('🔑 Code utilisateur:', userCode);
      
      // 1. Mettre à jour la base de données utilisateurs SI elle existe
      try {
        const usersData = localStorage.getItem(USERS_STORAGE_KEY);
        console.log('📦 Données utilisateurs récupérées:', usersData ? 'Oui' : 'Non');
        
        if (usersData && userCode) {
          const users = JSON.parse(usersData);
          console.log('📋 Utilisateurs disponibles:', Object.keys(users));
          
          if (users[userCode]) {
            console.log('✅ Utilisateur trouvé dans la base');
            users[userCode].password = newCode;
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            console.log('💾 Base de données mise à jour');
          } else {
            console.warn('⚠️ Utilisateur non trouvé dans la base, mais on continue...');
          }
        }
      } catch (dbError) {
        console.warn('⚠️ Erreur base de données (on continue quand même):', dbError);
      }

      // 2. Mettre à jour l'utilisateur courant (TOUJOURS)
      const updatedUser = {
        ...currentUser,
        password: newCode
      };
      
      console.log('💾 Sauvegarde de l\'utilisateur courant...');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      console.log('✅ Code secret modifié avec succès');
      console.log('🔑 Ancien code:', currentCode);
      console.log('🔑 Nouveau code:', newCode);
      
      setSuccess("✅ Votre code secret a été modifié avec succès. Utilisez ce nouveau code lors de votre prochaine connexion.");
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setIsChangingCode(false);
        setCurrentCode("");
        setNewCode("");
        setConfirmCode("");
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError("Une erreur est survenue lors de la modification du code");
      console.error("❌ Erreur modification code:", err);
      console.error("❌ Message:", err.message);
      console.error("❌ Stack:", err.stack);
    }
  };

  const cancelChange = () => {
    setIsChangingCode(false);
    setCurrentCode("");
    setNewCode("");
    setConfirmCode("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full bg-red-600 pt-6 pb-8 text-center relative">
        <button 
          onClick={() => navigateTo('main')}
          className="absolute left-4 top-6 text-white hover:bg-red-700 p-2 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white px-4">Code Secret</h1>
        <p className="text-white mt-2">CB Gold Evolution</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Message de succès global */}
        {success && !isChangingCode && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-lg">
            <p className="text-sm font-semibold text-green-800">{success}</p>
          </div>
        )}

        {/* Alerte de sécurité */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex items-start">
            <Shield className="text-yellow-600 mr-3  mt-0.5" size={24} />
            <div>
              <h3 className="text-sm font-bold text-yellow-800 mb-1">Important</h3>
              <p className="text-sm text-yellow-700">
                Assurez-vous d'être dans un endroit sûr avant de consulter votre code secret. Ne le partagez jamais avec personne.
              </p>
            </div>
          </div>
        </div>

        {!isChangingCode ? (
          // === MODE CONSULTATION ===
          <>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Votre code secret</h2>
                <p className="text-sm text-gray-600">Carte terminant par •••• {currentUser?.carte}</p>
              </div>

              <div className="bg-red-50 to-red-100 rounded-xl p-6 sm:p-12 mb-6 relative">
                {showCode ? (
                  <div className="text-center">
                    <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-[0.3em] sm:tracking-[0.5em] mb-4">
                      {currentUser?.password || "123456"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Code secret de votre carte</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-400 tracking-[0.3em] sm:tracking-[0.5em] mb-4">••••••</p>
                    <p className="text-xs sm:text-sm text-gray-600">Cliquez sur le bouton ci-dessous pour révéler</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  {showCode ? (
                    <>
                      <EyeOff size={20} />
                      Masquer le code
                    </>
                  ) : (
                    <>
                      <Eye size={20} />
                      Afficher le code
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsChangingCode(true)}
                  className="w-full bg-white border-2 border-red-600 text-red-600 py-4 rounded-lg font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
                >
                  <Lock size={20} />
                  Modifier mon code secret
                </button>
              </div>
            </div>
          </>
        ) : (
          // === MODE MODIFICATION ===
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Modifier votre code secret</h2>
              <p className="text-sm text-gray-600">Le code doit contenir exactement 6 chiffres</p>
            </div>

            <div className="space-y-6">
              {/* Code actuel */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Code secret actuel
                </label>
                <input
                  type="password"
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-xl sm:text-2xl tracking-widest text-center"
                  placeholder="••••••"
                  maxLength="6"
                />
              </div>

              {/* Nouveau code */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nouveau code secret
                </label>
                <input
                  type="password"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-xl sm:text-2xl tracking-widest text-center"
                  placeholder="••••••"
                  maxLength="6"
                />
                {newCode && newCode.length === 6 && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <Check size={16} /> Code valide
                  </p>
                )}
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Confirmer le nouveau code
                </label>
                <input
                  type="password"
                  value={confirmCode}
                  onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none text-xl sm:text-2xl tracking-widest text-center"
                  placeholder="••••••"
                  maxLength="6"
                />
                {confirmCode && confirmCode.length === 6 && (
                  <p className={`text-sm mt-2 flex items-center gap-1 ${
                    newCode === confirmCode ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {newCode === confirmCode ? (
                      <>
                        <Check size={16} /> Les codes correspondent
                      </>
                    ) : (
                      <>
                        <X size={16} /> Les codes ne correspondent pas
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Messages d'erreur/succès */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">{success}</p>
                </div>
              )}

              {/* Boutons */}
              <div className="space-y-3">
                <button
                  onClick={handleChangeCode}
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!currentCode || !newCode || !confirmCode || newCode !== confirmCode}
                >
                  <Check size={20} />
                  Valider la modification
                </button>

                <button
                  onClick={cancelChange}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conseils de sécurité */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-red-600" />
            Conseils de sécurité
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Ne communiquez jamais votre code secret, même à un conseiller bancaire</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Mémorisez votre code et ne le notez pas sur un support physique ou numérique</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Cachez le clavier lors de la composition de votre code aux distributeurs</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Changez régulièrement votre code secret pour plus de sécurité</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Utilisez un code difficile à deviner (évitez 123456, votre date de naissance, etc.)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}