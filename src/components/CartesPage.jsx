import React, { useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { downloadDocument } from "./documentGenerator";
import MainPage from "../pages/MainPage";
import CodeSecretPage from "../pages/CodeSecretPage";
import { AugmenterPlafondPage } from "../pages/AugmenterPlafondPage";
import ModifierRetraitPage from "../pages/ModifierRetraitPage";
import ParametrerPage from "../pages/ParametrerPage";
import DeclarerVoyagePage from "../pages/DeclarerVoyage";
import AssurancesPage from "../pages/AssurancesPage";
import ConditionsTarifaires from "../pages/ConditionsTarifaires";

export default function CartesPage() {
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [carteActive, setCarteActive] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');
  
  const [showVerrouillerModal, setShowVerrouillerModal] = useState(false);
  const [showOppositionModal, setShowOppositionModal] = useState(false);
  const [showCode, setShowCode] = useState(false);
  
  const [nouveauPlafond, setNouveauPlafond] = useState('');
  const [nouveauRetrait, setNouveauRetrait] = useState('');
  const [voyageData, setVoyageData] = useState({
    pays: '',
    dateDebut: '',
    dateFin: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Vérifier si l'utilisateur existe
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur non trouvé</h2>
            <p className="text-gray-600 mb-6">
              Veuillez vous connecter pour accéder à votre espace.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 font-semibold transition"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleVerrouiller = () => {
    setShowVerrouillerModal(true);
  };

  const confirmerVerrouillage = () => {
    setCarteActive(false);
    setShowVerrouillerModal(false);
  };

  const handleOpposition = () => {
    setShowOppositionModal(true);
  };

  const confirmerPlafond = () => {
    if (nouveauPlafond && parseFloat(nouveauPlafond) > 0) {
      alert(`Nouveau plafond de ${nouveauPlafond} € enregistré !`);
      setNouveauPlafond('');
      navigateTo('main');
    }
  };

  const confirmerRetrait = () => {
    if (nouveauRetrait && parseFloat(nouveauRetrait) > 0) {
      alert(`Nouvelle capacité de retrait de ${nouveauRetrait} € enregistrée !`);
      setNouveauRetrait('');
      navigateTo('main');
    }
  };

  const confirmerVoyage = () => {
    if (voyageData.pays && voyageData.dateDebut && voyageData.dateFin) {
      alert(`Voyage déclaré : ${voyageData.pays} du ${voyageData.dateDebut} au ${voyageData.dateFin}`);
      setVoyageData({ pays: '', dateDebut: '', dateFin: '' });
      navigateTo('main');
    }
  };

  const handleLienUtile = (nomLien) => {
    alert(`Vous avez cliqué sur : ${nomLien}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="w-full bg-red-600 pt-8 pb-12 text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white px-4">CB Gold Evolution</h1>
          <p className="text-white font-semibold mt-2">Compte n° •••• {currentUser.carte}</p>
          <p className="text-white mt-1">Débit immédiat</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <Loader2 size={64} className="text-gray-400 animate-spin mb-6" />
          <p className="text-gray-600 text-lg">Un instant ...</p>
        </div>
      </div>
    );
  }

  const pageProps = {
    currentUser,
    navigateTo,
    carteActive,
    setCarteActive,
    showCode,
    setShowCode,
    nouveauPlafond,
    setNouveauPlafond,
    confirmerPlafond,
    nouveauRetrait,
    setNouveauRetrait,
    confirmerRetrait,
    voyageData,
    setVoyageData,
    confirmerVoyage,
    handleVerrouiller,
    handleOpposition,
    showVerrouillerModal,
    setShowVerrouillerModal,
    confirmerVerrouillage,
    showOppositionModal,
    setShowOppositionModal,
    optionsOpen,
    setOptionsOpen,
    handleLienUtile,
    downloadDocument
  };

  switch(currentPage) {
    case 'code-secret':
      return <CodeSecretPage {...pageProps} />;
    case 'augmenter-plafond':
      return <AugmenterPlafondPage {...pageProps} />;
    case 'modifier-retrait':
      return <ModifierRetraitPage {...pageProps} />;
    case 'parametrer':
      return <ParametrerPage {...pageProps} />;
    case 'declarer-voyage':
      return <DeclarerVoyagePage {...pageProps} />;
    case 'assurances':
      return <AssurancesPage {...pageProps} />;
    case 'conditions-tarifaires':
      return <ConditionsTarifaires {...pageProps} />;
    default:
      return <MainPage {...pageProps} />;
  }
}