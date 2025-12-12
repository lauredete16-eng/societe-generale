import React from "react";
import { ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";

export default function CodeSecretPage({ currentUser, navigateTo, showCode, setShowCode }) {
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex items-start">
            <Shield className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-sm font-bold text-yellow-800 mb-1">Important</h3>
              <p className="text-sm text-yellow-700">
                Assurez-vous d'être dans un endroit sûr avant de consulter votre code secret. Ne le partagez jamais avec personne.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Votre code secret</h2>
            <p className="text-sm text-gray-600">Carte terminant par •••• {currentUser?.carte}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-12 mb-6 relative">
            {showCode ? (
              <div className="text-center">
                <p className="text-6xl font-bold text-gray-900 tracking-[0.5em] mb-4">
                  {currentUser?.codeSecret || "1234"}
                </p>
                <p className="text-sm text-gray-600">Code secret de votre carte</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-6xl font-bold text-gray-400 tracking-[0.5em] mb-4">••••</p>
                <p className="text-sm text-gray-600">Cliquez sur le bouton ci-dessous pour révéler</p>
              </div>
            )}
          </div>

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
        </div>

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
          </ul>
        </div>
      </div>
    </div>
  );
}